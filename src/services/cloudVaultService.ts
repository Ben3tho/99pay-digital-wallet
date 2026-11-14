import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  UserProfile,
  BankCardItem,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
  LipaMerchantItem,
  PensionLoyaltyItem,
  TransactionItem,
} from '../data/walletData';
import { encryptWithPassphrase, decryptWithPassphrase } from '../utils/vaultSecurity';

export interface CloudVaultPayload {
  userProfile: UserProfile;
  bankCards: BankCardItem[];
  mobileWallets: MobileMoneyItem[];
  identities: IdentityDocItem[];
  insuranceDocs: InsuranceDocItem[];
  lipaMerchants: LipaMerchantItem[];
  pensionCards: PensionLoyaltyItem[];
  transactions: TransactionItem[];
  syncedAt: string;
}

export interface CloudVaultMetadata {
  exists: boolean;
  itemCount: number;
  hasPinWrap: boolean;
  updatedAtLabel: string | null;
}

function buildSyncKey(uid: string, customSecret?: string): string {
  const cleanSecret = (customSecret || '').trim();
  return cleanSecret ? `uid:${uid}:secret:${cleanSecret}` : `uid:${uid}:99pay-cloud-v1`;
}

export async function syncUserProfileToCloud(
  user: User,
  profile: UserProfile
): Promise<void> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);

  try {
    const snap = await getDoc(ref);
    const fullName = (profile.fullName || user.displayName || '').trim().slice(0, 120);
    const phoneNumber = (profile.phoneNumber || user.phoneNumber || '').trim().slice(0, 32);
    const email = (profile.email || user.email || '').trim().slice(0, 160);

    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: user.uid,
        fullName,
        phoneNumber,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        fullName,
        phoneNumber,
        email,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchCloudVaultMetadata(
  user: User
): Promise<CloudVaultMetadata> {
  const path = `users/${user.uid}/vault/main`;
  const ref = doc(db, 'users', user.uid, 'vault', 'main');

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { exists: false, itemCount: 0, hasPinWrap: false, updatedAtLabel: null };
    }
    const data = snap.data();
    const updatedTs = data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null;
    return {
      exists: true,
      itemCount: typeof data.itemCount === 'number' ? data.itemCount : 0,
      hasPinWrap: Boolean(data.hasPinWrap),
      updatedAtLabel: updatedTs ? updatedTs.toLocaleString() : null,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function uploadEncryptedVaultToCloud(
  user: User,
  payload: CloudVaultPayload,
  syncPassphrase?: string
): Promise<number> {
  await syncUserProfileToCloud(user, payload.userProfile);

  const path = `users/${user.uid}/vault/main`;
  const ref = doc(db, 'users', user.uid, 'vault', 'main');
  const key = buildSyncKey(user.uid, syncPassphrase);
  const serialized = JSON.stringify(payload);
  const ciphertext = await encryptWithPassphrase(serialized, key);

  const itemCount =
    payload.bankCards.length +
    payload.mobileWallets.length +
    payload.identities.length +
    payload.insuranceDocs.length +
    payload.lipaMerchants.length +
    payload.pensionCards.length +
    payload.transactions.length;

  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: user.uid,
        vaultFormat: '99PAY_CLOUD_AESGCM_V1',
        ciphertext,
        itemCount,
        hasPinWrap: Boolean(syncPassphrase?.trim()),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        vaultFormat: '99PAY_CLOUD_AESGCM_V1',
        ciphertext,
        itemCount,
        hasPinWrap: Boolean(syncPassphrase?.trim()),
        updatedAt: serverTimestamp(),
      });
    }
    return itemCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function downloadAndDecryptCloudVault(
  user: User,
  syncPassphrase?: string
): Promise<CloudVaultPayload> {
  const path = `users/${user.uid}/vault/main`;
  const ref = doc(db, 'users', user.uid, 'vault', 'main');

  let snap;
  try {
    snap = await getDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }

  if (!snap.exists()) {
    throw new Error('NO_CLOUD_VAULT');
  }

  const data = snap.data();
  const ciphertext = data.ciphertext as string;
  const requiresSecret = Boolean(data.hasPinWrap);
  if (requiresSecret && !syncPassphrase?.trim()) {
    throw new Error('PASSPHRASE_REQUIRED');
  }

  const key = buildSyncKey(user.uid, syncPassphrase);
  try {
    const plainJson = await decryptWithPassphrase(ciphertext, key);
    return JSON.parse(plainJson) as CloudVaultPayload;
  } catch {
    throw new Error('DECRYPT_FAILED');
  }
}
