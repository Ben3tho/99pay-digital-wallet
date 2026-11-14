import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Trash2,
  CloudUpload,
  CloudDownload,
  Lock,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  BankCardItem,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
  LipaMerchantItem,
  PensionLoyaltyItem,
  TransactionItem,
  UserProfile,
} from '../../data/walletData';
import { Language, TRANSLATIONS } from '../../i18n/translations';
import { encryptWithPassphrase, decryptWithPassphrase } from '../../utils/vaultSecurity';
import {
  uploadEncryptedVaultToCloud,
  downloadAndDecryptCloudVault,
  fetchCloudVaultMetadata,
  CloudVaultMetadata,
} from '../../services/cloudVaultService';

interface VaultBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  hasVaultPin: boolean;
  onVerifyPin: (pin: string) => Promise<boolean>;
  firebaseUser?: User | null;
  vaultData: {
    userProfile?: UserProfile;
    bankCards: BankCardItem[];
    mobileWallets: MobileMoneyItem[];
    identities: IdentityDocItem[];
    insuranceDocs: InsuranceDocItem[];
    lipaMerchants: LipaMerchantItem[];
    pensionCards: PensionLoyaltyItem[];
    transactions?: TransactionItem[];
  };
  onRestoreData: (restoredData: any) => void;
  onEmergencyWipe: () => void;
}

export const VaultBackupModal: React.FC<VaultBackupModalProps> = ({
  isOpen,
  onClose,
  lang,
  hasVaultPin,
  onVerifyPin,
  firebaseUser = null,
  vaultData,
  onRestoreData,
  onEmergencyWipe,
}) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [wipeInput, setWipeInput] = useState('');

  // AES-256-GCM Export Passphrase
  const [exportPassphrase, setExportPassphrase] = useState('');

  // Encrypted File Restore Prompt
  const [pendingEncryptedEnvelope, setPendingEncryptedEnvelope] = useState<string | null>(null);
  const [importPassphrase, setImportPassphrase] = useState('');

  // Cloud Sync State
  const [cloudMeta, setCloudMeta] = useState<CloudVaultMetadata | null>(null);
  const [cloudPassphrase, setCloudPassphrase] = useState('');
  const [cloudBusy, setCloudBusy] = useState<'upload' | 'download' | null>(null);
  const [cloudStatus, setCloudStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && firebaseUser) {
      setCloudStatus(null);
      void fetchCloudVaultMetadata(firebaseUser)
        .then(setCloudMeta)
        .catch(() => setCloudMeta(null));
    }
  }, [isOpen, firebaseUser]);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    try {
      const cleanPass = exportPassphrase.trim();
      const rawPayload = {
        userProfile: vaultData.userProfile,
        bankCards: vaultData.bankCards,
        mobileWallets: vaultData.mobileWallets,
        identities: vaultData.identities,
        insuranceDocs: vaultData.insuranceDocs,
        lipaMerchants: vaultData.lipaMerchants,
        pensionCards: vaultData.pensionCards,
        transactions: vaultData.transactions ?? [],
      };

      let fileContentObj: Record<string, unknown>;
      if (cleanPass.length > 0) {
        if (cleanPass.length < 4) {
          setErrorMessage(
            lang === 'sw'
              ? 'Nenosiri la kusimba faili lazima liwe angalau herufi/tarakimu 4.'
              : 'Encryption passphrase must be at least 4 characters.'
          );
          return;
        }
        const ciphertext = await encryptWithPassphrase(JSON.stringify(rawPayload), cleanPass);
        fileContentObj = {
          app: '99Pay Digital Wallet',
          version: '2.5.0',
          exportDate: new Date().toISOString(),
          vaultFormat: '99PAY_ENCRYPTED_VAULT_V1',
          cipher: 'PBKDF2-SHA256+AES-256-GCM',
          encryptedPayload: ciphertext,
        };
      } else {
        fileContentObj = {
          app: '99Pay Digital Wallet',
          version: '2.5.0',
          exportDate: new Date().toISOString(),
          vaultFormat: '99PAY_VAULT_V2',
          deviceLocale: lang === 'sw' ? 'sw-TZ' : 'en-TZ',
          vaultPayload: rawPayload,
        };
      }

      const blob = new Blob([JSON.stringify(fileContentObj, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = url;
      const filename = `99pay_vault_backup_${new Date().toISOString().slice(0, 10)}.99pay`;
      downloadAnchor.download = filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setExportPassphrase('');
      setErrorMessage('');
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      setErrorMessage(
        lang === 'sw'
          ? 'Hitilafu wakati wa kutengeneza nakala ya faili.'
          : 'Failed to generate backup file.'
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.vaultFormat === '99PAY_ENCRYPTED_VAULT_V1' && parsed.encryptedPayload) {
          setPendingEncryptedEnvelope(parsed.encryptedPayload);
          setImportPassphrase('');
          setErrorMessage('');
          return;
        }

        if (!parsed.vaultPayload) {
          throw new Error(
            lang === 'sw'
              ? 'Faili halina muundo sahihi wa 99Pay Vault.'
              : 'File does not contain a valid 99Pay Vault payload.'
          );
        }

        onRestoreData(parsed.vaultPayload);
        setImportSuccess(true);
        setErrorMessage('');
        setTimeout(() => {
          setImportSuccess(false);
          onClose();
        }, 1200);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : undefined;
        setErrorMessage(
          msg || (lang === 'sw' ? 'Faili limeharibika au si la 99Pay.' : 'Invalid or corrupted backup file.')
        );
      }
    };
    reader.readAsText(file);
  };

  const handleDecryptAndRestoreFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingEncryptedEnvelope) return;
    try {
      const plain = await decryptWithPassphrase(pendingEncryptedEnvelope, importPassphrase.trim());
      const parsed = JSON.parse(plain);
      onRestoreData(parsed);
      setPendingEncryptedEnvelope(null);
      setImportPassphrase('');
      setImportSuccess(true);
      setErrorMessage('');
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1200);
    } catch {
      setErrorMessage(
        lang === 'sw'
          ? 'Nenosiri la kufungua faili siyo sahihi.'
          : 'Incorrect passphrase for this encrypted backup.'
      );
    }
  };

  const handleCloudUpload = async () => {
    if (!firebaseUser) return;
    setCloudBusy('upload');
    setErrorMessage('');
    setCloudStatus(null);
    try {
      const count = await uploadEncryptedVaultToCloud(
        firebaseUser,
        {
          userProfile: vaultData.userProfile || { fullName: '' },
          bankCards: vaultData.bankCards,
          mobileWallets: vaultData.mobileWallets,
          identities: vaultData.identities,
          insuranceDocs: vaultData.insuranceDocs,
          lipaMerchants: vaultData.lipaMerchants,
          pensionCards: vaultData.pensionCards,
          transactions: vaultData.transactions ?? [],
          syncedAt: new Date().toISOString(),
        },
        cloudPassphrase.trim() || undefined
      );
      const updated = await fetchCloudVaultMetadata(firebaseUser);
      setCloudMeta(updated);
      setCloudStatus(
        lang === 'sw'
          ? `Vitu ${count} vimepakiwa na kusimbwa (AES-256-GCM) kwenye Wingu!`
          : `Encrypted & synced ${count} items to Cloud Vault!`
      );
    } catch {
      setErrorMessage(
        lang === 'sw'
          ? 'Imeshindikana kupakia kwenye Wingu. Hakikisha intaneti ipo sawa.'
          : 'Cloud upload failed. Please check your connection.'
      );
    } finally {
      setCloudBusy(null);
    }
  };

  const handleCloudRestore = async () => {
    if (!firebaseUser) return;
    setCloudBusy('download');
    setErrorMessage('');
    setCloudStatus(null);
    try {
      const restored = await downloadAndDecryptCloudVault(
        firebaseUser,
        cloudPassphrase.trim() || undefined
      );
      onRestoreData(restored);
      setCloudStatus(
        lang === 'sw'
          ? 'Vault imerejeshwa salama kutoka kwenye Wingu!'
          : 'Vault restored safely from Cloud!'
      );
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      const code = err instanceof Error ? err.message : '';
      if (code === 'NO_CLOUD_VAULT') {
        setErrorMessage(
          lang === 'sw'
            ? 'Hakuna nakala ya vault iliyohifadhiwa kwenye akaunti hii bado.'
            : 'No cloud vault backup found for this account yet.'
        );
      } else if (code === 'PASSPHRASE_REQUIRED' || code === 'DECRYPT_FAILED') {
        setErrorMessage(
          lang === 'sw'
            ? 'Ingiza nenosiri sahihi la kusimba (Sync Passphrase) ulilotumia wakati wa kupakia.'
            : 'Enter the correct Sync Passphrase used when uploading.'
        );
      } else {
        setErrorMessage(
          lang === 'sw' ? 'Hitilafu wakati wa kurejesha kutoka Wingu.' : 'Cloud restore failed.'
        );
      }
    } finally {
      setCloudBusy(null);
    }
  };

  const handleExecuteWipe = async () => {
    if (hasVaultPin) {
      const valid = await onVerifyPin(wipeInput.trim());
      if (!valid) {
        setErrorMessage(
          lang === 'sw'
            ? 'PIN siyo sahihi. Weka PIN yako ya vault kuthibitisha.'
            : 'Incorrect Vault PIN. Enter your Vault PIN to confirm.'
        );
        return;
      }
    } else if (wipeInput.trim().toUpperCase() !== 'FUTA' && wipeInput.trim().toUpperCase() !== 'WIPE') {
      setErrorMessage(
        lang === 'sw'
          ? 'Andika neno FUTA (au WIPE) kuthibitisha kufuta kila kitu.'
          : 'Type WIPE to confirm deleting all local vault data.'
      );
      return;
    }

    onEmergencyWipe();
    setShowWipeConfirm(false);
    setWipeInput('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#06271D] border border-[#24473A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#24473A] flex items-center justify-between bg-[#03120E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{t.backupTitle}</h3>
              <p className="text-[11px] text-[#B7C8C1]">{t.backupSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close backup modal"
            className="w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {cloudStatus && (
            <div className="p-3 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 text-[#00B887] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{cloudStatus}</span>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 text-[#00B887] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'sw'
                  ? 'Nakala ya .99pay imepakuliwa salama kwenye simu yako!'
                  : 'Vault .99pay backup downloaded successfully!'}
              </span>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 text-[#00B887] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'sw'
                  ? 'Kadi na vitambulisho vyote vimepakiwa kwa mafanikio!'
                  : 'All cards and documents restored successfully!'}
              </span>
            </div>
          )}

          {/* Encrypted Cloud Sync Section (Firebase) */}
          {firebaseUser && (
            <div className="p-4 rounded-xl bg-[#0B211B] border border-[#00B887]/40 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-white flex items-center gap-1.5">
                    <CloudUpload className="w-4 h-4 text-[#00B887]" />
                    <span>
                      {lang === 'sw'
                        ? 'Cloud Vault (AES-256 Encrypted)'
                        : 'Encrypted Cloud Sync'}
                    </span>
                  </h5>
                  <p className="text-[10px] text-[#B7C8C1] truncate">
                    {firebaseUser.email || firebaseUser.displayName}
                    {cloudMeta?.exists
                      ? ` • ${cloudMeta.itemCount} items (${cloudMeta.updatedAtLabel || 'Synced'})`
                      : lang === 'sw'
                      ? ' • Bado haijapakiwa'
                      : ' • Not synced yet'}
                  </p>
                </div>
              </div>

              <input
                type="password"
                value={cloudPassphrase}
                onChange={(e) => setCloudPassphrase(e.target.value)}
                placeholder={
                  lang === 'sw'
                    ? 'Nenosiri la ziada la Wingu (Hiari / Au acha wazi)'
                    : 'Optional extra cloud passphrase'
                }
                className="w-full h-9 px-3 rounded-lg bg-[#06271D] border border-[#24473A] text-white text-xs focus:outline-none focus:border-[#00B887]"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCloudUpload}
                  disabled={cloudBusy !== null}
                  className="py-2 px-3 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>
                    {cloudBusy === 'upload'
                      ? '...'
                      : lang === 'sw'
                      ? 'Pakia Wingu'
                      : 'Sync Up'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleCloudRestore}
                  disabled={cloudBusy !== null}
                  className="py-2 px-3 rounded-xl bg-[#06271D] border border-[#24473A] hover:border-[#F4C95D] text-[#F4C95D] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CloudDownload className="w-3.5 h-3.5" />
                  <span>
                    {cloudBusy === 'download'
                      ? '...'
                      : lang === 'sw'
                      ? 'Pakua Wingu'
                      : 'Restore'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Non-Custodial Vault Guarantee */}
          <div className="p-3.5 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#00B887] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">
                {lang === 'sw' ? 'Uhuru Kamili wa Data (AES-256-GCM)' : 'Encrypted Local Backup'}
              </h4>
              <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
                {lang === 'sw'
                  ? 'Weka nenosiri chini ili faili lako la .99pay lifungwe kwa usimbaji wa AES-256-GCM kabla ya kupakuliwa.'
                  : 'Enter a passphrase below to AES-256-GCM encrypt your .99pay backup file before export.'}
              </p>
            </div>
          </div>

          {/* Action 1: Export */}
          <div className="p-4 rounded-xl bg-[#0B211B] border border-[#24473A] space-y-2.5">
            <div>
              <h5 className="font-bold text-white">
                {lang === 'sw' ? 'Pakua Nakala ya Vault (.99pay)' : 'Export Vault Backup (.99pay)'}
              </h5>
              <p className="text-[11px] text-[#B7C8C1]">
                {lang === 'sw'
                  ? `Inajumuisha kadi ${vaultData.bankCards.length + vaultData.mobileWallets.length}, Lipa Namba ${vaultData.lipaMerchants.length}, vitambulisho ${vaultData.identities.length}, na miamala ${vaultData.transactions?.length ?? 0}.`
                  : `Includes ${vaultData.bankCards.length + vaultData.mobileWallets.length} cards, ${vaultData.lipaMerchants.length} tills, ${vaultData.identities.length} IDs, and ${vaultData.transactions?.length ?? 0} transactions.`}
              </p>
            </div>

            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-[#F4C95D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={exportPassphrase}
                onChange={(e) => setExportPassphrase(e.target.value)}
                placeholder={
                  lang === 'sw'
                    ? 'Nenosiri/PIN ya kufunga faili (Inapendekezwa)'
                    : 'Encryption passphrase (Recommended)'
                }
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#06271D] border border-[#24473A] text-white text-xs focus:outline-none focus:border-[#00B887]"
              />
            </div>

            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-[#00B887]/15"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>
                {exportPassphrase.trim()
                  ? lang === 'sw'
                    ? 'Pakua Faili Iliyosimbwa (AES-256)'
                    : 'Export Encrypted Backup'
                  : t.exportVault}
              </span>
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="p-4 rounded-xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div>
              <h5 className="font-bold text-white">
                {lang === 'sw' ? 'Rejesha Kutoka Kwenye Faili' : 'Restore From Backup File'}
              </h5>
              <p className="text-[11px] text-[#B7C8C1]">
                {lang === 'sw'
                  ? 'Pakia faili la .99pay (linalindwa kwa nenosiri au la kawaida).'
                  : 'Upload a previously exported .99pay backup file.'}
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.99pay"
              onChange={handleFileUpload}
              className="hidden"
            />
            {pendingEncryptedEnvelope ? (
              <form onSubmit={handleDecryptAndRestoreFile} className="space-y-2 pt-1">
                <input
                  type="password"
                  value={importPassphrase}
                  onChange={(e) => setImportPassphrase(e.target.value)}
                  placeholder={
                    lang === 'sw'
                      ? 'Weka nenosiri kufungua faili hili'
                      : 'Enter backup decryption passphrase'
                  }
                  className="w-full h-9 px-3 rounded-lg bg-[#06271D] border border-[#F4C95D]/60 text-white text-xs focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-[#F4C95D] text-[#03120E] font-bold text-xs cursor-pointer"
                  >
                    {lang === 'sw' ? 'Fungua & Rejesha' : 'Decrypt & Restore'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingEncryptedEnvelope(null);
                      setImportPassphrase('');
                    }}
                    className="py-2 px-3 rounded-xl bg-[#06271D] border border-[#24473A] text-xs text-[#B7C8C1]"
                  >
                    {lang === 'sw' ? 'Ghairi' : 'Cancel'}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#0B211B] transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#F4C95D]" />
                <span>{t.importVault}</span>
              </button>
            )}
          </div>

          {/* Action 3: Emergency Wipe */}
          <div className="pt-2 border-t border-[#24473A]">
            {!showWipeConfirm ? (
              <button
                type="button"
                onClick={() => setShowWipeConfirm(true)}
                className="w-full py-2 px-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.emergencyWipe}</span>
              </button>
            ) : (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-2">
                <p className="text-xs font-bold text-red-300">
                  {lang === 'sw'
                    ? 'Je, una uhakika unataka kufuta taarifa zote kwenye simu hii?'
                    : 'Are you sure you want to wipe all vault records on this device?'}
                </p>
                <p className="text-[11px] text-[#B7C8C1]">
                  {hasVaultPin
                    ? lang === 'sw'
                      ? 'Ingiza PIN yako ya vault kuthibitisha:'
                      : 'Enter your Vault PIN to confirm:'
                    : lang === 'sw'
                    ? 'Andika neno FUTA kuthibitisha:'
                    : 'Type WIPE to confirm:'}
                </p>
                <input
                  type={hasVaultPin ? 'password' : 'text'}
                  maxLength={hasVaultPin ? 4 : 10}
                  value={wipeInput}
                  onChange={(e) => {
                    setWipeInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={hasVaultPin ? '••••' : 'FUTA / WIPE'}
                  className="w-full bg-[#0B211B] border border-red-500/40 rounded-lg px-3 py-1.5 text-xs text-center font-mono text-white tracking-widest"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExecuteWipe}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-500 cursor-pointer"
                  >
                    {lang === 'sw' ? 'Ndio, Futa Kila Kitu' : 'Yes, Wipe All'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWipeConfirm(false);
                      setWipeInput('');
                      setErrorMessage('');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#0B211B] border border-[#24473A] text-xs text-[#B7C8C1] cursor-pointer"
                  >
                    {lang === 'sw' ? 'Ghairi' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
