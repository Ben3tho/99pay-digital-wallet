import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidNavigationBar } from './AndroidNavigationBar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { AnimatedCardStack } from './dashboard/AnimatedCardStack';
import { MobileMoneyCard } from './dashboard/MobileMoneyCard';
import { BottomNav, DashboardTab } from './dashboard/BottomNav';
import { LipaTab } from './dashboard/LipaTab';
import { TariffTab } from './dashboard/TariffTab';
import { VaultSettingsTab } from './dashboard/VaultSettingsTab';
import { AddCardModal, AddModalTab } from './dashboard/AddCardModal';
import { AddLipaNambaModal } from './dashboard/AddLipaNambaModal';
import { PinPromptModal } from './dashboard/PinPromptModal';
import { SecurityCenterModal, AuditLogEntry } from './dashboard/SecurityCenterModal';
import { VaultLockScreen } from './dashboard/VaultLockScreen';
import { QrCodeModal } from './dashboard/QrCodeModal';
import { VaultBackupModal } from './dashboard/VaultBackupModal';
import { NavigationDrawer } from './dashboard/NavigationDrawer';
import { RecentTransactions } from './dashboard/RecentTransactions';
import { CardBrandLogo } from './dashboard/CardBrandLogo';
import type { EditingCardItem } from './dashboard/AddCardModal';
import type { User } from 'firebase/auth';
import {
  INITIAL_USER_PROFILE,
  INITIAL_BANK_CARDS,
  INITIAL_MOBILE_MONEY,
  INITIAL_IDENTITIES,
  INITIAL_INSURANCE,
  INITIAL_LIPA_MERCHANTS,
  INITIAL_PENSION_LOYALTY,
  INITIAL_RECENT_TRANSACTIONS,
  UserProfile,
  BankCardItem,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
  LipaMerchantItem,
  PensionLoyaltyItem,
  TransactionItem,
  CardBrand,
} from '../data/walletData';
import {
  hashVaultPin,
  verifyVaultPin,
  encryptWithPassphrase,
  decryptWithPassphrase,
  isEncryptedEnvelope,
} from '../utils/vaultSecurity';
import { syncNativeFlagSecure } from '../utils/nativeSecurity';
import { collectVaultExpiryAlerts } from '../utils/expiryAlerts';
import {
  CreditCard,
  Smartphone,
  Plus,
  Search,
  X,
  Copy,
  Check,
  Lock,
  ShieldCheck,
  Trash2,
  Star,
  Pencil,
  AlertTriangle,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../i18n/translations';

const VAULT_STORAGE_KEY = '99pay_vault_state_v1';

interface PersistedVaultState {
  userProfile?: UserProfile;
  vaultPinHash?: string | null;
  bankCards?: BankCardItem[];
  mobileWallets?: MobileMoneyItem[];
  identities?: IdentityDocItem[];
  insuranceDocs?: InsuranceDocItem[];
  lipaMerchants?: LipaMerchantItem[];
  pensionCards?: PensionLoyaltyItem[];
  transactions?: TransactionItem[];
  auditLogs?: AuditLogEntry[];
  lang?: Language;
  autoLockSeconds?: number;
  isFlagSecureEnabled?: boolean;
  isBiometricEnabled?: boolean;
}

function loadPersistedVault(): PersistedVaultState {
  try {
    const raw = window.localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PersistedVaultState;
  } catch {
    return {};
  }
}

interface DashboardScreenProps {
  onSignOut: () => void;
  firebaseUser?: User | null;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSignOut,
  firebaseUser = null,
}) => {
  const initialVault = useRef<PersistedVaultState>(loadPersistedVault()).current;
  const sessionPinRef = useRef<string | null>(null);
  const [encryptionEpoch, setEncryptionEpoch] = useState(0);

  // Navigation Drawer State
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Navigation Tab State (Pochi | Lipa & Tills | Kikokotoo | Nyaraka & Mipangilio)
  const [activeTab, setActiveTab] = useState<DashboardTab>('wallet');

  // Bilingual Language State
  const [lang, setLang] = useState<Language>(initialVault.lang || 'sw');
  const t = TRANSLATIONS[lang];

  // Real User Profile & Hashed PIN State
  const [userProfile, setUserProfile] = useState<UserProfile>(
    initialVault.userProfile ?? INITIAL_USER_PROFILE
  );
  const [vaultPinHash, setVaultPinHash] = useState<string | null>(
    initialVault.vaultPinHash ?? null
  );

  // Vault Data State (Local non-custodial state persisted in localStorage)
  const [bankCards, setBankCards] = useState<BankCardItem[]>(
    initialVault.bankCards ?? INITIAL_BANK_CARDS
  );
  const [mobileWallets, setMobileWallets] = useState<MobileMoneyItem[]>(
    initialVault.mobileWallets ?? INITIAL_MOBILE_MONEY
  );
  const [identities, setIdentities] = useState<IdentityDocItem[]>(
    initialVault.identities ?? INITIAL_IDENTITIES
  );
  const [insuranceDocs, setInsuranceDocs] = useState<InsuranceDocItem[]>(
    initialVault.insuranceDocs ?? INITIAL_INSURANCE
  );
  const [lipaMerchants, setLipaMerchants] = useState<LipaMerchantItem[]>(
    initialVault.lipaMerchants ?? INITIAL_LIPA_MERCHANTS
  );
  const [pensionCards, setPensionCards] = useState<PensionLoyaltyItem[]>(
    initialVault.pensionCards ?? INITIAL_PENSION_LOYALTY
  );
  const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>(
    initialVault.transactions ?? INITIAL_RECENT_TRANSACTIONS
  );

  // Wallet Tab Sub-Filter (Zote | Benki | Pochi za Simu)
  const [walletFilter, setWalletFilter] = useState<'all' | 'bank' | 'momo'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Security & Vault Lock States
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [lockReason, setLockReason] = useState('Vault imefungwa kulinda taarifa zako.');
  const [autoLockSeconds, setAutoLockSeconds] = useState(initialVault.autoLockSeconds ?? 60);
  const [isFlagSecureEnabled, setIsFlagSecureEnabled] = useState(
    initialVault.isFlagSecureEnabled ?? true
  );
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(
    initialVault.isBiometricEnabled ?? true
  );

  // Security Audit Log State (starts clean; records real user actions)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialVault.auditLogs ?? []);

  // Sync Firebase user profile defaults if local profile is blank
  useEffect(() => {
    if (firebaseUser) {
      setUserProfile((prev) => ({
        fullName: prev.fullName || firebaseUser.displayName || '',
        phoneNumber: prev.phoneNumber || firebaseUser.phoneNumber || '',
        email: prev.email || firebaseUser.email || '',
      }));
    }
  }, [firebaseUser]);

  // Sync native Android Window FLAG_SECURE when toggled
  useEffect(() => {
    void syncNativeFlagSecure(isFlagSecureEnabled);
  }, [isFlagSecureEnabled]);

  // Save Vault changes locally (with AES-256-GCM encryption for card numbers & document numbers when PIN key is active)
  useEffect(() => {
    let cancelled = false;
    const persistVault = async () => {
      try {
        const activePin = sessionPinRef.current;
        const canEncrypt =
          Boolean(activePin) &&
          typeof window !== 'undefined' &&
          Boolean(window.crypto?.subtle);

        const persistedCards = canEncrypt && activePin
          ? await Promise.all(
              bankCards.map(async (c) => {
                if (!c.fullNumber || isEncryptedEnvelope(c.fullNumber)) return c;
                return {
                  ...c,
                  fullNumber: await encryptWithPassphrase(c.fullNumber, activePin),
                };
              })
            )
          : bankCards;

        const persistedIdentities = canEncrypt && activePin
          ? await Promise.all(
              identities.map(async (docItem) => {
                if (!docItem.documentNumber || isEncryptedEnvelope(docItem.documentNumber)) {
                  return docItem;
                }
                return {
                  ...docItem,
                  documentNumber: await encryptWithPassphrase(docItem.documentNumber, activePin),
                };
              })
            )
          : identities;

        if (cancelled) return;

        const payload: PersistedVaultState = {
          userProfile,
          vaultPinHash,
          bankCards: persistedCards,
          mobileWallets,
          identities: persistedIdentities,
          insuranceDocs,
          lipaMerchants,
          pensionCards,
          transactions: recentTransactions,
          auditLogs: auditLogs.slice(0, 50),
          lang,
          autoLockSeconds,
          isFlagSecureEnabled,
          isBiometricEnabled,
        };
        window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage quota errors in restricted webviews
      }
    };

    void persistVault();
    return () => {
      cancelled = true;
    };
  }, [
    userProfile,
    vaultPinHash,
    bankCards,
    mobileWallets,
    identities,
    insuranceDocs,
    lipaMerchants,
    pensionCards,
    recentTransactions,
    auditLogs,
    lang,
    autoLockSeconds,
    isFlagSecureEnabled,
    isBiometricEnabled,
    encryptionEpoch,
  ]);

  // Card Number Reveal Challenge (PIN/Biometric)
  const [pendingCardForReveal, setPendingCardForReveal] = useState<BankCardItem | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);
  const [revealedSecondsRemaining, setRevealedSecondsRemaining] = useState<number>(10);

  // Feature Modals & Editing States
  const [isAddLipaModalOpen, setIsAddLipaModalOpen] = useState(false);
  const [editingLipaMerchant, setEditingLipaMerchant] = useState<LipaMerchantItem | null>(null);
  const [activeQrMerchant, setActiveQrMerchant] = useState<LipaMerchantItem | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialTab, setAddModalInitialTab] = useState<AddModalTab>('bank');
  const [editingCardItem, setEditingCardItem] = useState<EditingCardItem | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  const addAuditLog = useCallback(
    (action: string, details: string, status: 'safe' | 'warning' | 'info' = 'safe') => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          action,
          details,
          timestamp: timeStr,
          status,
        },
        ...prev,
      ]);
    },
    []
  );

  // Copied state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string = 'Hati') => {
    navigator.clipboard?.writeText(text);
    setCopiedText(text);
    addAuditLog('Namba Imenakiliwa', `${label} imenakiliwa kwenye clipboard`, 'info');
    showToast(lang === 'sw' ? `${label} imenakiliwa!` : `${label} copied!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Lock Vault Action
  const handleLockVault = useCallback(
    (reason: string = 'Vault imefungwa kulinda usalama wako.') => {
      setLockReason(reason);
      setIsVaultLocked(true);
      setRevealedCardId(null);
      addAuditLog('Vault Imefungwa', reason, 'safe');
    },
    [addAuditLog]
  );

  // Inactivity auto-lock timer
  const inactivityTimerRef = useRef<number | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    if (autoLockSeconds > 0 && !isVaultLocked) {
      inactivityTimerRef.current = window.setTimeout(() => {
        handleLockVault(
          `Vault imefungwa kiotomatiki baada ya sekunde ${autoLockSeconds} bila kutumika.`
        );
      }, autoLockSeconds * 1000);
    }
  }, [autoLockSeconds, isVaultLocked, handleLockVault]);

  useEffect(() => {
    const handleUserActivity = () => resetInactivityTimer();
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('mousedown', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) window.clearTimeout(inactivityTimerRef.current);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetInactivityTimer]);

  // Card reveal countdown timer (10 seconds)
  useEffect(() => {
    let interval: number | null = null;
    if (revealedCardId) {
      setRevealedSecondsRemaining(10);
      interval = window.setInterval(() => {
        setRevealedSecondsRemaining((prev) => {
          if (prev <= 1) {
            setRevealedCardId(null);
            if (interval) window.clearInterval(interval);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [revealedCardId]);

  const decryptSecretsInMemory = useCallback(
    async (pin: string) => {
      sessionPinRef.current = pin;

      const hasEncryptedCard = bankCards.some((c) => isEncryptedEnvelope(c.fullNumber));
      if (hasEncryptedCard) {
        const decryptedCards = await Promise.all(
          bankCards.map(async (c) => {
            if (!c.fullNumber || !isEncryptedEnvelope(c.fullNumber)) return c;
            try {
              return { ...c, fullNumber: await decryptWithPassphrase(c.fullNumber, pin) };
            } catch {
              return c;
            }
          })
        );
        setBankCards(decryptedCards);
      }

      const hasEncryptedId = identities.some((d) => isEncryptedEnvelope(d.documentNumber));
      if (hasEncryptedId) {
        const decryptedIds = await Promise.all(
          identities.map(async (d) => {
            if (!d.documentNumber || !isEncryptedEnvelope(d.documentNumber)) return d;
            try {
              return { ...d, documentNumber: await decryptWithPassphrase(d.documentNumber, pin) };
            } catch {
              return d;
            }
          })
        );
        setIdentities(decryptedIds);
      }

      setEncryptionEpoch((e) => e + 1);
    },
    [bankCards, identities]
  );

  // Handle PIN Challenge Success
  const handlePinSuccess = async (verifiedPin?: string) => {
    if (verifiedPin) {
      await decryptSecretsInMemory(verifiedPin);
    }
    if (pendingCardForReveal) {
      setRevealedCardId(pendingCardForReveal.id);
      addAuditLog(
        'Namba ya Kadi Imeonekana',
        `Namba ya ${pendingCardForReveal.bankName} imeonyeshwa kwa sekunde 10 baada ya PIN challenge`,
        'warning'
      );
      setPendingCardForReveal(null);
    }
    setIsPinModalOpen(false);
  };

  const handleRequestReveal = (card: BankCardItem) => {
    setPendingCardForReveal(card);
    setIsPinModalOpen(true);
  };

  const handleHideNumber = () => {
    setRevealedCardId(null);
  };

  // Add & Update Handlers
  const handleAddBankCard = (card: BankCardItem) => {
    setBankCards((prev) => {
      const updatedPrev = card.isDefault ? prev.map((c) => ({ ...c, isDefault: false })) : prev;
      return [card, ...updatedPrev];
    });
    const label = card.bankName === 'Other Bank' && card.customBankName ? card.customBankName : card.bankName;
    addAuditLog('Kadi Mpya ya Benki', `${label} (${card.cardType}) imeongezwa kwenye vault`, 'safe');
    showToast(
      lang === 'sw'
        ? `${label} (${card.cardType}) imehifadhiwa!`
        : `${label} (${card.cardType}) saved!`
    );
    setActiveTab('wallet');
  };

  const handleUpdateBankCard = (updated: BankCardItem) => {
    setBankCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    const label = updated.bankName === 'Other Bank' && updated.customBankName ? updated.customBankName : updated.bankName;
    addAuditLog('Kadi Imehaririwa', `${label} (${updated.cardType}) imesasishwa`, 'info');
    showToast(lang === 'sw' ? `${label} imesasishwa!` : `${label} updated!`);
  };

  const handleAddMobileMoney = (momo: MobileMoneyItem) => {
    setMobileWallets((prev) => {
      const updatedPrev = momo.isPrimary ? prev.map((w) => ({ ...w, isPrimary: false })) : prev;
      return [momo, ...updatedPrev];
    });
    addAuditLog('Pochi Mpya ya Simu', `${momo.provider} (${momo.phoneNumber}) imeongezwa`, 'safe');
    showToast(lang === 'sw' ? `${momo.provider} imehifadhiwa!` : `${momo.provider} saved!`);
    setActiveTab('wallet');
  };

  const handleUpdateMobileMoney = (updated: MobileMoneyItem) => {
    setMobileWallets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    addAuditLog('Pochi Imehaririwa', `${updated.provider} (${updated.phoneNumber}) imesasishwa`, 'info');
    showToast(lang === 'sw' ? `${updated.provider} imesasishwa!` : `${updated.provider} updated!`);
  };

  const handleAddIdentity = (idItem: IdentityDocItem) => {
    setIdentities((prev) => [idItem, ...prev]);
    addAuditLog('Kitambulisho Kipya', `${idItem.docType} kimeongezwa`, 'safe');
    showToast(lang === 'sw' ? `${idItem.docType} kimehifadhiwa!` : `${idItem.docType} saved!`);
    setActiveTab('vault');
  };

  const handleUpdateIdentity = (updated: IdentityDocItem) => {
    setIdentities((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    addAuditLog('Kitambulisho Kimehaririwa', `${updated.docType} kimesasishwa`, 'info');
    showToast(lang === 'sw' ? `${updated.docType} kimesasishwa!` : `${updated.docType} updated!`);
  };

  const handleAddInsurance = (ins: InsuranceDocItem) => {
    setInsuranceDocs((prev) => [ins, ...prev]);
    addAuditLog('Kadi ya Bima Mpya', `${ins.provider} (${ins.schemeName}) imeongezwa`, 'safe');
    showToast(lang === 'sw' ? `${ins.provider} imehifadhiwa!` : `${ins.provider} saved!`);
    setActiveTab('vault');
  };

  const handleUpdateInsurance = (updated: InsuranceDocItem) => {
    setInsuranceDocs((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    addAuditLog('Bima Imehaririwa', `${updated.provider} imesasishwa`, 'info');
    showToast(lang === 'sw' ? `${updated.provider} imesasishwa!` : `${updated.provider} updated!`);
  };

  const handleAddPension = (pen: PensionLoyaltyItem) => {
    setPensionCards((prev) => [pen, ...prev]);
    addAuditLog('Kadi ya Mfuko / Uanachama', `${pen.title} (${pen.membershipNumber}) imeongezwa`, 'safe');
    showToast(lang === 'sw' ? `${pen.title} imehifadhiwa!` : `${pen.title} saved!`);
    setActiveTab('vault');
  };

  const handleUpdatePension = (updated: PensionLoyaltyItem) => {
    setPensionCards((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addAuditLog('Mfuko Umehaririwa', `${updated.title} imesasishwa`, 'info');
    showToast(lang === 'sw' ? `${updated.title} imesasishwa!` : `${updated.title} updated!`);
  };

  const handleDeletePensionCard = (id: string) => {
    setPensionCards((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('Kadi Imefutwa', 'Kadi ya mfuko/uanachama imeondolewa', 'warning');
    showToast(lang === 'sw' ? 'Imefutwa kwenye vault.' : 'Removed from vault.');
  };

  const handleAddLipaMerchant = (item: LipaMerchantItem) => {
    setLipaMerchants((prev) => [item, ...prev]);
    addAuditLog('Lipa Namba Mpya', `${item.merchantName} (Till: ${item.number}) imehifadhiwa`, 'safe');
    showToast(
      lang === 'sw'
        ? `${item.merchantName} imeongezwa!`
        : `${item.merchantName} saved!`
    );
  };

  const handleUpdateLipaMerchant = (updated: LipaMerchantItem) => {
    setLipaMerchants((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    addAuditLog('Lipa Namba Imehaririwa', `${updated.merchantName} imesasishwa`, 'info');
    showToast(lang === 'sw' ? `${updated.merchantName} imesasishwa!` : `${updated.merchantName} updated!`);
  };

  const handleDeleteLipaMerchant = (id: string) => {
    setLipaMerchants((prev) => prev.filter((m) => m.id !== id));
    addAuditLog('Lipa Namba Imefutwa', 'Biashara imeondolewa kwenye orodha ya Till', 'warning');
    showToast(lang === 'sw' ? 'Lipa Namba imefutwa.' : 'Merchant removed.');
  };

  const handleToggleFavoriteLipa = (id: string) => {
    setLipaMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m))
    );
  };

  const handleAddTransaction = (tx: TransactionItem) => {
    setRecentTransactions((prev) => [tx, ...prev]);
    addAuditLog('Muamala Umerekodiwa', `${tx.title} (TZS ${tx.amount.toLocaleString()})`, 'info');
    showToast(lang === 'sw' ? 'Muamala umehifadhiwa!' : 'Transaction recorded!');
  };

  const handleUpdateTransaction = (updated: TransactionItem) => {
    setRecentTransactions((prev) => prev.map((tx) => (tx.id === updated.id ? updated : tx)));
    addAuditLog('Muamala Umehaririwa', `${updated.title} umesasishwa`, 'info');
    showToast(lang === 'sw' ? 'Muamala umesasishwa!' : 'Transaction updated!');
  };

  const handleDeleteTransaction = (id: string) => {
    setRecentTransactions((prev) => prev.filter((tx) => tx.id !== id));
    showToast(lang === 'sw' ? 'Muamala umefutwa.' : 'Transaction removed.');
  };

  const handleVerifyPin = useCallback(
    async (enteredPin: string) => {
      if (!vaultPinHash) return false;
      return verifyVaultPin(enteredPin, vaultPinHash);
    },
    [vaultPinHash]
  );

  const handleSetPin = useCallback(
    async (newPin: string) => {
      const hashed = await hashVaultPin(newPin);
      sessionPinRef.current = newPin;
      setVaultPinHash(hashed);
      setEncryptionEpoch((e) => e + 1);
      addAuditLog('PIN ya Vault Imewekwa', 'PIN binafsi ya tarakimu 4 imehifadhiwa na kusimba AES-256-GCM', 'safe');
      showToast(lang === 'sw' ? 'PIN ya Vault imehifadhiwa!' : 'Vault PIN saved!');
    },
    [addAuditLog, showToast, lang]
  );

  // Active Detail Sheet State
  const [activeItemDetail, setActiveItemDetail] = useState<{
    id: string;
    type: 'bank' | 'momo' | 'id' | 'insurance' | 'lipa' | 'pension';
    cardBrand?: CardBrand;
    title: string;
    subtitle: string;
    primaryNumber: string;
    details: { label: string; value: string }[];
  } | null>(null);

  const handleSetDefaultItem = (detail: NonNullable<typeof activeItemDetail>) => {
    if (detail.type === 'bank') {
      setBankCards((prev) => prev.map((c) => ({ ...c, isDefault: c.id === detail.id })));
      showToast(lang === 'sw' ? 'Imewekwa kuwa kadi kuu!' : 'Set as default card!');
    } else if (detail.type === 'momo') {
      setMobileWallets((prev) => prev.map((w) => ({ ...w, isPrimary: w.id === detail.id })));
      showToast(lang === 'sw' ? 'Imewekwa kuwa pochi kuu!' : 'Set as primary wallet!');
    }
    setActiveItemDetail(null);
  };

  const handleEditDetailItem = (detail: NonNullable<typeof activeItemDetail>) => {
    if (detail.type === 'bank') {
      const card = bankCards.find((c) => c.id === detail.id);
      if (card) {
        setEditingCardItem({ type: 'bank', item: card });
        setIsAddModalOpen(true);
      }
    } else if (detail.type === 'momo') {
      const momo = mobileWallets.find((w) => w.id === detail.id);
      if (momo) {
        setEditingCardItem({ type: 'momo', item: momo });
        setIsAddModalOpen(true);
      }
    } else if (detail.type === 'id') {
      const doc = identities.find((d) => d.id === detail.id);
      if (doc) {
        setEditingCardItem({ type: 'id', item: doc });
        setIsAddModalOpen(true);
      }
    } else if (detail.type === 'insurance') {
      const ins = insuranceDocs.find((i) => i.id === detail.id);
      if (ins) {
        setEditingCardItem({ type: 'insurance', item: ins });
        setIsAddModalOpen(true);
      }
    }
    setActiveItemDetail(null);
  };

  const handleDeleteDetailItem = (detail: NonNullable<typeof activeItemDetail>) => {
    if (detail.type === 'bank') {
      setBankCards((prev) => prev.filter((c) => c.id !== detail.id));
      addAuditLog('Kadi Imefutwa', `${detail.title} imeondolewa kwenye vault`, 'warning');
    } else if (detail.type === 'momo') {
      setMobileWallets((prev) => prev.filter((w) => w.id !== detail.id));
      addAuditLog('Pochi Imefutwa', `${detail.title} imeondolewa kwenye vault`, 'warning');
    } else if (detail.type === 'id') {
      setIdentities((prev) => prev.filter((i) => i.id !== detail.id));
      addAuditLog('Kitambulisho Kimefutwa', `${detail.title} kimeondolewa`, 'warning');
    } else if (detail.type === 'insurance') {
      setInsuranceDocs((prev) => prev.filter((ins) => ins.id !== detail.id));
      addAuditLog('Bima Imefutwa', `${detail.title} imeondolewa`, 'warning');
    }
    showToast(lang === 'sw' ? 'Imefutwa kwenye vault.' : 'Removed from vault.');
    setActiveItemDetail(null);
  };

  // Restore and Emergency Wipe Handlers
  const handleRestoreData = (restoredPayload: any) => {
    if (restoredPayload.userProfile) setUserProfile(restoredPayload.userProfile);
    if (restoredPayload.bankCards) setBankCards(restoredPayload.bankCards);
    if (restoredPayload.mobileWallets) setMobileWallets(restoredPayload.mobileWallets);
    if (restoredPayload.identities) setIdentities(restoredPayload.identities);
    if (restoredPayload.insuranceDocs) setInsuranceDocs(restoredPayload.insuranceDocs);
    if (restoredPayload.lipaMerchants) setLipaMerchants(restoredPayload.lipaMerchants);
    if (restoredPayload.pensionCards) setPensionCards(restoredPayload.pensionCards);
    if (restoredPayload.transactions) setRecentTransactions(restoredPayload.transactions);

    addAuditLog('Vault Imerudishwa', 'Taarifa zimerudishwa kutoka kwenye faili la nakala', 'safe');
    showToast(lang === 'sw' ? 'Vault imerejeshwa!' : 'Vault restored!');
  };

  const handleEmergencyWipe = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setVaultPinHash(null);
    setBankCards([]);
    setMobileWallets([]);
    setIdentities([]);
    setInsuranceDocs([]);
    setLipaMerchants([]);
    setPensionCards([]);
    setRecentTransactions([]);
    setAuditLogs([]);
    try {
      window.localStorage.removeItem(VAULT_STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast(lang === 'sw' ? 'Data zote zimefutwa!' : 'All vault data wiped!');
  };

  // Search filtering for Wallet cards
  const query = searchQuery.toLowerCase().trim();

  const filteredBankCards = bankCards.filter(
    (c) =>
      !query ||
      c.bankName.toLowerCase().includes(query) ||
      (c.customBankName?.toLowerCase().includes(query) ?? false) ||
      c.cardType.toLowerCase().includes(query) ||
      c.cardholderName.toLowerCase().includes(query) ||
      c.maskedNumber.toLowerCase().includes(query)
  );

  const filteredMobileWallets = mobileWallets.filter(
    (m) =>
      !query ||
      m.provider.toLowerCase().includes(query) ||
      m.accountHolder.toLowerCase().includes(query) ||
      m.phoneNumber.toLowerCase().includes(query)
  );

  const totalWalletCount = bankCards.length + mobileWallets.length;
  const totalVaultCount = identities.length + insuranceDocs.length + pensionCards.length;
  const expiryAlerts = collectVaultExpiryAlerts(bankCards, identities, 45);

  const openContextualAdd = () => {
    setEditingCardItem(null);
    setEditingLipaMerchant(null);
    if (activeTab === 'lipa') {
      setIsAddLipaModalOpen(true);
    } else if (activeTab === 'vault') {
      setAddModalInitialTab('id');
      setIsAddModalOpen(true);
    } else {
      setAddModalInitialTab('bank');
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#03120E] text-white overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[110px] opacity-25"
          style={{ background: 'radial-gradient(circle, #00B887 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -left-36 w-80 h-80 rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #F4C95D 0%, transparent 70%)' }}
        />
      </div>

      {/* Android System Status Bar */}
      <AndroidStatusBar />

      {/* Vault Locked Overlay */}
      {isVaultLocked && (
        <VaultLockScreen
          reason={lockReason}
          hasVaultPin={Boolean(vaultPinHash)}
          onVerifyPin={handleVerifyPin}
          onSetPin={handleSetPin}
          isBiometricEnabled={isBiometricEnabled}
          lang={lang}
          onUnlock={(verifiedPin) => {
            if (verifiedPin) {
              void decryptSecretsInMemory(verifiedPin);
            }
            setIsVaultLocked(false);
            addAuditLog('Vault Imefunguliwa', 'Mtumiaji amefungua vault', 'safe');
            resetInactivityTimer();
          }}
        />
      )}

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#06271D] border border-[#00B887] text-xs font-bold text-white shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#00B887]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Scrollable Main View Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 overscroll-contain focus:outline-none scroll-smooth z-10 pb-20">
        <div className="w-full max-w-sm mx-auto flex flex-col space-y-3.5 pt-1">
          {/* Top Dashboard Header with Navigation Drawer Hamburger Menu & Greeting */}
          <DashboardHeader
            onOpenNavigationDrawer={() => setIsNavDrawerOpen(true)}
            lang={lang}
            userFullName={userProfile.fullName}
          />

          {/* ============================================================== */}
          {/* TAB 1: POCHI (BANK CARDS & MOBILE MONEY WALLETS) */}
          {/* ============================================================== */}
          {activeTab === 'wallet' && (
            <div className="space-y-3.5">
              {/* Clean Wallet Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06271D] via-[#0B211B] to-[#041712] border border-[#24473A] shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#B7C8C1] uppercase tracking-wider block">
                    {lang === 'sw' ? 'Pochi Yako ya Malipo' : 'Active Payment Cards'}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black text-[#F4C95D]">
                      {totalWalletCount}
                    </span>
                    <span className="text-xs text-[#B7C8C1]">
                      {lang === 'sw'
                        ? `(${bankCards.length} Benki, ${mobileWallets.length} Pochi za Simu)`
                        : `(${bankCards.length} Bank, ${mobileWallets.length} Mobile Wallets)`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#03120E]/80 border border-[#24473A] text-[10px] text-[#00B887] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{vaultPinHash ? 'AES-256 Vault' : '256-Bit Vault'}</span>
                </div>
              </div>

              {/* Expiry Alerts Banner */}
              {expiryAlerts.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-start gap-2.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="font-bold text-amber-200 block text-[11px]">
                      {lang === 'sw'
                        ? `Tahadhari ya Muda wa Kuisha (${expiryAlerts.length})`
                        : `Expiry Alerts (${expiryAlerts.length})`}
                    </span>
                    {expiryAlerts.slice(0, 2).map((alertItem) => (
                      <button
                        key={alertItem.id}
                        type="button"
                        onClick={() => {
                          if (alertItem.sourceType === 'bank') {
                            const card = bankCards.find((c) => c.id === alertItem.id);
                            if (card) {
                              setEditingCardItem({ type: 'bank', item: card });
                              setIsAddModalOpen(true);
                            }
                          } else {
                            const docItem = identities.find((d) => d.id === alertItem.id);
                            if (docItem) {
                              setEditingCardItem({ type: 'id', item: docItem });
                              setIsAddModalOpen(true);
                            }
                          }
                        }}
                        className="w-full text-left flex items-center justify-between gap-2 text-[11px] text-[#B7C8C1] hover:text-white cursor-pointer"
                      >
                        <span className="truncate">{alertItem.title}</span>
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            alertItem.status === 'expired' ? 'text-rose-300' : 'text-amber-300'
                          }`}
                        >
                          {alertItem.status === 'expired'
                            ? lang === 'sw'
                              ? 'Imeisha'
                              : 'Expired'
                            : `${alertItem.daysRemaining}d`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-Filter Pills (Vyote | Benki | Pochi za Simu) */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0B211B] border border-[#24473A]">
                <button
                  type="button"
                  onClick={() => setWalletFilter('all')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    walletFilter === 'all'
                      ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
                      : 'text-[#B7C8C1] hover:text-white'
                  }`}
                >
                  {lang === 'sw' ? 'Kadi Zote' : 'All'} ({totalWalletCount})
                </button>

                <button
                  type="button"
                  onClick={() => setWalletFilter('bank')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    walletFilter === 'bank'
                      ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
                      : 'text-[#B7C8C1] hover:text-white'
                  }`}
                >
                  {lang === 'sw' ? 'Kadi za Benki' : 'Bank Cards'} ({bankCards.length})
                </button>

                <button
                  type="button"
                  onClick={() => setWalletFilter('momo')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    walletFilter === 'momo'
                      ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
                      : 'text-[#B7C8C1] hover:text-white'
                  }`}
                >
                  {lang === 'sw' ? 'Pochi za Simu' : 'Mobile Wallets'} ({mobileWallets.length})
                </button>
              </div>

              {/* Search input for cards */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#B7C8C1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder={
                    lang === 'sw'
                      ? 'Tafuta kadi ya CRDB, Visa, Mastercard, M-Pesa...'
                      : 'Search Visa, Mastercard, Amex, M-Pesa...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-9 pr-8 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-xs placeholder:text-[#B7C8C1]/50 focus:outline-none focus:border-[#00B887]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear card search"
                    className="p-1 text-[#B7C8C1] hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* 1. Bank Cards Section */}
              {(walletFilter === 'all' || walletFilter === 'bank') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B7C8C1] flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#F4C95D]" />
                      {t.bankCards} (Auto-Detect)
                    </span>
                    <span className="text-[11px] text-[#00B887] font-semibold">
                      PIN Protected
                    </span>
                  </div>

                  <AnimatedCardStack
                    cards={filteredBankCards}
                    revealedCardId={revealedCardId}
                    revealedSecondsRemaining={revealedSecondsRemaining}
                    onRequestReveal={handleRequestReveal}
                    onHideNumber={handleHideNumber}
                    onSelectCardDetail={(card) => {
                      const bankDisplay =
                        card.bankName === 'Other Bank' && card.customBankName
                          ? card.customBankName
                          : card.bankName;
                      setActiveItemDetail({
                        id: card.id,
                        type: 'bank',
                        cardBrand: card.cardType,
                        title: bankDisplay,
                        subtitle: `${card.tier} • ${card.cardType}`,
                        primaryNumber:
                          revealedCardId === card.id &&
                          card.fullNumber &&
                          !isEncryptedEnvelope(card.fullNumber)
                            ? card.fullNumber
                            : card.maskedNumber,
                        details: [
                          { label: 'Mwenye Kadi', value: card.cardholderName },
                          { label: 'Mtandao (Network)', value: card.cardType },
                          { label: 'Tarehe ya Kuisha', value: card.expiryDate },
                          { label: 'Benki', value: bankDisplay },
                          { label: 'Sera ya CVV', value: 'Zero CVV Stored (BoT Guideline)' },
                        ],
                      });
                    }}
                  />
                </div>
              )}

              {/* 2. Mobile Money Wallets Section */}
              {(walletFilter === 'all' || walletFilter === 'momo') && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#B7C8C1] flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-[#00B887]" />
                      {t.mobileMoney} (Tanzania)
                    </span>
                    <span className="text-[11px] text-[#F4C95D] font-semibold">1-Tap USSD</span>
                  </div>

                  {filteredMobileWallets.length === 0 ? (
                    <div className="p-5 rounded-2xl bg-[#06271D]/40 border border-dashed border-[#24473A] text-center text-xs text-[#B7C8C1]">
                      {lang === 'sw' ? 'Hakuna pochi ya simu iliyopatikana.' : 'No mobile wallet found.'}
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredMobileWallets.map((momo) => (
                        <MobileMoneyCard
                          key={momo.id}
                          wallet={momo}
                          onClick={() =>
                            setActiveItemDetail({
                              id: momo.id,
                              type: 'momo',
                              title: momo.provider,
                              subtitle: momo.accountHolder,
                              primaryNumber: momo.phoneNumber,
                              details: [
                                { label: 'Mwenye Pochi', value: momo.accountHolder },
                                { label: 'Namba ya Simu', value: momo.phoneNumber },
                                { label: 'Mtandao', value: momo.provider },
                                { label: 'Menyu ya USSD', value: momo.ussdCode },
                                { label: 'Uhakiki wa TCRA', value: 'Active SIM Registration' },
                              ],
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Recent Transactions Section */}
              <RecentTransactions
                transactions={recentTransactions}
                lang={lang}
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: LIPA & TILLS DIRECTORY */}
          {/* ============================================================== */}
          {activeTab === 'lipa' && (
            <LipaTab
              merchants={lipaMerchants}
              lang={lang}
              onOpenAddLipaModal={() => {
                setEditingLipaMerchant(null);
                setIsAddLipaModalOpen(true);
              }}
              onOpenQr={(merchant) => setActiveQrMerchant(merchant)}
              onCopy={(txt, lbl) => copyToClipboard(txt, lbl)}
              onToggleFavorite={handleToggleFavoriteLipa}
              onEditMerchant={(merchant) => {
                setEditingLipaMerchant(merchant);
                setIsAddLipaModalOpen(true);
              }}
              onDeleteMerchant={handleDeleteLipaMerchant}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 3: KIKOKOTOO CHA MAKATO (TARIFF CALCULATOR) */}
          {/* ============================================================== */}
          {activeTab === 'tariff' && <TariffTab lang={lang} />}

          {/* ============================================================== */}
          {/* TAB 4: NYARAKA NA MIPANGILIO (VAULT & SETTINGS) */}
          {/* ============================================================== */}
          {activeTab === 'vault' && (
            <VaultSettingsTab
              userProfile={userProfile}
              onUpdateProfile={(profile) => {
                setUserProfile(profile);
                showToast(lang === 'sw' ? 'Wasifu umehifadhiwa!' : 'Profile updated!');
              }}
              identities={identities}
              insuranceDocs={insuranceDocs}
              pensionCards={pensionCards}
              lang={lang}
              onToggleLang={() => setLang(lang === 'sw' ? 'en' : 'sw')}
              onOpenAddModal={(tab = 'id') => {
                setEditingCardItem(null);
                setAddModalInitialTab(tab);
                setIsAddModalOpen(true);
              }}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
              onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
              onLockVaultNow={() =>
                handleLockVault('Umefunga Vault mara moja kutoka kwenye Mipangilio')
              }
              onSignOut={onSignOut}
              onEmergencyWipe={handleEmergencyWipe}
              copyToClipboard={copyToClipboard}
              onEditPensionCard={(pen) => {
                setEditingCardItem({ type: 'pension', item: pen });
                setIsAddModalOpen(true);
              }}
              onDeletePensionCard={handleDeletePensionCard}
              onViewIdentityDetail={(item) =>
                setActiveItemDetail({
                  id: item.id,
                  type: 'id',
                  title: item.docType,
                  subtitle: item.fullName,
                  primaryNumber: isEncryptedEnvelope(item.documentNumber)
                    ? '•••• •••• •••• (PIN Locked)'
                    : item.documentNumber,
                  details: [
                    { label: 'Jina Kamili', value: item.fullName },
                    {
                      label: 'Namba ya Hati',
                      value: isEncryptedEnvelope(item.documentNumber)
                        ? '•••• (Imelindwa kwa PIN)'
                        : item.documentNumber,
                    },
                    { label: 'Tarehe ya Kutolewa', value: item.issueDate },
                    { label: 'Mamlaka ya Utoaji', value: item.issuingAuthority },
                    { label: 'Tarehe ya Kuisha', value: item.expiryDate || 'Haina Ukomo' },
                  ],
                })
              }
              onViewInsuranceDetail={(item) =>
                setActiveItemDetail({
                  id: item.id,
                  type: 'insurance',
                  title: item.provider,
                  subtitle: item.schemeName,
                  primaryNumber: item.membershipNumber,
                  details: [
                    { label: 'Mwanachama', value: item.beneficiaryName },
                    { label: 'Namba ya Kadi', value: item.membershipNumber },
                    { label: 'Mpango wa Bima', value: item.schemeName },
                    { label: 'Hali ya Bima', value: item.status },
                  ],
                })
              }
              autoLockSeconds={autoLockSeconds}
              onChangeAutoLock={(sec) => {
                setAutoLockSeconds(sec);
                addAuditLog(
                  'Auto-Lock Badiliko',
                  `Muda wa kufunga vault umewekwa sekunde ${sec}`,
                  'info'
                );
              }}
              isFlagSecureEnabled={isFlagSecureEnabled}
              onToggleFlagSecure={() => {
                setIsFlagSecureEnabled((prev) => !prev);
                addAuditLog(
                  'FLAG_SECURE Badiliko',
                  !isFlagSecureEnabled
                    ? 'Screenshot blocker imeamilishwa'
                    : 'Screenshot blocker imezimwa',
                  !isFlagSecureEnabled ? 'safe' : 'warning'
                );
              }}
              isBiometricEnabled={isBiometricEnabled}
              onToggleBiometric={() => {
                setIsBiometricEnabled((prev) => !prev);
                addAuditLog(
                  'Biometric Badiliko',
                  'Hali ya alama ya kidole imebadilishwa',
                  'info'
                );
              }}
            />
          )}

          {/* Non-Custodial Security Notice Footer */}
          <div className="pt-2 pb-1 text-center text-xs text-[#B7C8C1]/60 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#00B887]" />
              <span className="font-semibold text-white/80">99Pay Encrypted Vault</span>
            </div>
            <span className="text-[10px] max-w-xs leading-relaxed">{t.nonCustodialNotice}</span>
          </div>
        </div>
      </div>

      {/* Item Detail Sheet Modal */}
      {activeItemDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveItemDetail(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#24473A] gap-2">
              <div className="min-w-0">
                <h4 className="font-bold text-base text-white tracking-tight truncate">
                  {activeItemDetail.title}
                </h4>
                <span className="text-xs text-[#B7C8C1] block truncate">
                  {activeItemDetail.subtitle}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {activeItemDetail.cardBrand && (
                  <CardBrandLogo brand={activeItemDetail.cardBrand} size="sm" />
                )}
                <button
                  type="button"
                  onClick={() => setActiveItemDetail(null)}
                  aria-label="Close detail modal"
                  className="p-2 text-[#B7C8C1] hover:text-white rounded-lg bg-[#0B211B] border border-[#24473A] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Primary Identifier Row */}
            <div className="py-4 border-b border-[#24473A] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#B7C8C1] uppercase tracking-wider block">
                  Namba / Kitambulisho
                </span>
                <span className="font-mono text-base font-bold text-[#F4C95D] tracking-wider block mt-0.5">
                  {activeItemDetail.primaryNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  copyToClipboard(activeItemDetail.primaryNumber, activeItemDetail.title)
                }
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                {copiedText === activeItemDetail.primaryNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00B887]" />
                    <span className="text-[#00B887] text-[11px]">Imenakiliwa</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B7C8C1]" />
                    <span className="text-[11px]">Nakili</span>
                  </>
                )}
              </button>
            </div>

            {/* Detailed metadata */}
            <div className="py-3 space-y-2.5 text-xs">
              {activeItemDetail.details.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-[#B7C8C1]">{row.label}</span>
                  <span className="font-semibold text-white text-right max-w-[180px] truncate">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#24473A] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {(activeItemDetail.type === 'bank' || activeItemDetail.type === 'momo') && (
                  <button
                    type="button"
                    onClick={() => handleSetDefaultItem(activeItemDetail)}
                    className="col-span-2 py-2.5 rounded-xl bg-[#00B887]/15 hover:bg-[#00B887]/25 border border-[#00B887]/40 text-xs font-bold text-[#00B887] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Weka Kuu' : 'Set Primary'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleEditDetailItem(activeItemDetail)}
                  className="py-2.5 rounded-xl bg-[#0B211B] hover:bg-[#03120E] border border-[#00B887]/40 text-xs font-bold text-[#F4C95D] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Hariri' : 'Edit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDetailItem(activeItemDetail)}
                  className="py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Futa' : 'Delete'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveItemDetail(null)}
                className="w-full py-2.5 rounded-xl bg-[#0B211B] hover:bg-[#03120E] border border-[#24473A] text-xs font-bold text-[#B7C8C1] hover:text-white transition-colors cursor-pointer"
              >
                {lang === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Lipa Namba Modal */}
      <AddLipaNambaModal
        isOpen={isAddLipaModalOpen}
        onClose={() => {
          setIsAddLipaModalOpen(false);
          setEditingLipaMerchant(null);
        }}
        onAdd={handleAddLipaMerchant}
        onUpdate={handleUpdateLipaMerchant}
        editingMerchant={editingLipaMerchant}
        lang={lang}
      />

      {/* QR Code Viewer Modal */}
      <QrCodeModal
        merchant={activeQrMerchant}
        isOpen={!!activeQrMerchant}
        onClose={() => setActiveQrMerchant(null)}
      />

      {/* Vault Backup & Restore Modal */}
      <VaultBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        lang={lang}
        hasVaultPin={Boolean(vaultPinHash)}
        onVerifyPin={handleVerifyPin}
        firebaseUser={firebaseUser}
        vaultData={{
          userProfile,
          bankCards,
          mobileWallets,
          identities,
          insuranceDocs,
          lipaMerchants,
          pensionCards,
          transactions: recentTransactions,
        }}
        onRestoreData={handleRestoreData}
        onEmergencyWipe={handleEmergencyWipe}
      />

      {/* Security Hub & BoT Compliance Modal */}
      <SecurityCenterModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        lang={lang}
        hasVaultPin={Boolean(vaultPinHash)}
        onVerifyPin={handleVerifyPin}
        onUpdateVaultPin={handleSetPin}
        autoLockSeconds={autoLockSeconds}
        onChangeAutoLock={(sec) => {
          setAutoLockSeconds(sec);
          addAuditLog('Auto-Lock Badiliko', `Muda wa kufunga vault umewekwa sekunde ${sec}`, 'info');
        }}
        isFlagSecureEnabled={isFlagSecureEnabled}
        onToggleFlagSecure={() => {
          setIsFlagSecureEnabled((prev) => !prev);
          addAuditLog(
            'FLAG_SECURE Badiliko',
            !isFlagSecureEnabled
              ? 'Screenshot blocker imeamilishwa'
              : 'Screenshot blocker imezimwa',
            !isFlagSecureEnabled ? 'safe' : 'warning'
          );
        }}
        isBiometricEnabled={isBiometricEnabled}
        onToggleBiometric={() => {
          setIsBiometricEnabled((prev) => !prev);
          addAuditLog(
            'Biometric Badiliko',
            'Hali ya uthibitisho kwa alama ya kidole imebadilishwa',
            'info'
          );
        }}
        auditLogs={auditLogs}
        onLockVaultNow={() => handleLockVault('Vault imefungwa mara moja na mtumiaji')}
        hasCloudSync={Boolean(firebaseUser)}
        userDisplayName={userProfile.fullName || firebaseUser?.displayName || ''}
      />

      {/* PIN Prompt Modal for Revealing Sensitive Numbers */}
      <PinPromptModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPendingCardForReveal(null);
        }}
        onSuccess={handlePinSuccess}
        hasVaultPin={Boolean(vaultPinHash)}
        onVerifyPin={handleVerifyPin}
        onSetPin={handleSetPin}
        isBiometricEnabled={
          isBiometricEnabled &&
          !(pendingCardForReveal?.fullNumber && isEncryptedEnvelope(pendingCardForReveal.fullNumber))
        }
        lang={lang}
        title={lang === 'sw' ? 'Thibitisha Kuona Namba ya Kadi' : 'Confirm to Reveal Card Number'}
        reason={
          pendingCardForReveal
            ? lang === 'sw'
              ? `Weka PIN yako kuthibitisha kuonyesha namba kamili ya kadi ya ${pendingCardForReveal.bankName}`
              : `Enter your Vault PIN to reveal full card number for ${pendingCardForReveal.bankName}`
            : undefined
        }
      />

      {/* Add / Edit Card / ID Modal */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCardItem(null);
        }}
        onAddBankCard={handleAddBankCard}
        onAddMobileMoney={handleAddMobileMoney}
        onAddIdentity={handleAddIdentity}
        onAddInsurance={handleAddInsurance}
        onAddPension={handleAddPension}
        onUpdateBankCard={handleUpdateBankCard}
        onUpdateMobileMoney={handleUpdateMobileMoney}
        onUpdateIdentity={handleUpdateIdentity}
        onUpdateInsurance={handleUpdateInsurance}
        onUpdatePension={handleUpdatePension}
        editingItem={editingCardItem}
        lang={lang}
        initialTab={addModalInitialTab}
      />

      {/* Circular Floating Action Button (FAB) at Bottom Right */}
      <div className="absolute right-4 bottom-20 z-30">
        <button
          type="button"
          onClick={openContextualAdd}
          aria-label="Ongeza Kadi au Hati Mpya"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#E6A92D] via-[#F4C95D] to-[#F8D978] text-[#03120E] shadow-[0_10px_25px_-5px_rgba(244,201,93,0.5)] border-2 border-[#F8D978] flex items-center justify-center cursor-pointer active:scale-90 hover:scale-105 transition-all group"
          title="Ongeza Kadi Mpya (+)"
        >
          <Plus className="w-7 h-7 stroke-[2.8] text-[#03120E] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Navigation Drawer (Slide-out from top-left) */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'sw' ? 'en' : 'sw')}
        onOpenSecurityCenter={() => setIsSecurityModalOpen(true)}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onLockVaultNow={() => handleLockVault('Umefunga Vault mara moja kutoka kwenye Menyu')}
        onSignOut={onSignOut}
        bankCardsCount={bankCards.length}
        mobileWalletsCount={mobileWallets.length}
        identitiesCount={identities.length}
        userProfile={userProfile}
        onUpdateProfile={(profile) => {
          setUserProfile(profile);
          showToast(lang === 'sw' ? 'Wasifu umehifadhiwa!' : 'Profile updated!');
        }}
        hasVaultPin={Boolean(vaultPinHash)}
        firebaseUserEmail={firebaseUser?.email || null}
      />

      {/* Native Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        lang={lang}
        walletCount={totalWalletCount}
        lipaCount={lipaMerchants.length}
        vaultCount={totalVaultCount}
      />

      {/* Android System Navigation Bar (Gesture Pill) */}
      <AndroidNavigationBar />
    </div>
  );
};
