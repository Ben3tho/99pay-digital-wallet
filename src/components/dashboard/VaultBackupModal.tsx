import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Lock,
  Trash2,
} from 'lucide-react';
import {
  BankCardItem,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
  LipaMerchantItem,
  PensionLoyaltyItem,
} from '../../data/walletData';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface VaultBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  vaultData: {
    bankCards: BankCardItem[];
    mobileWallets: MobileMoneyItem[];
    identities: IdentityDocItem[];
    insuranceDocs: InsuranceDocItem[];
    lipaMerchants: LipaMerchantItem[];
    pensionCards: PensionLoyaltyItem[];
  };
  onRestoreData: (restoredData: any) => void;
  onEmergencyWipe: () => void;
}

export const VaultBackupModal: React.FC<VaultBackupModalProps> = ({
  isOpen,
  onClose,
  lang,
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
  const [wipePin, setWipePin] = useState('');

  if (!isOpen) return null;

  // Real client-side JSON export
  const handleExportBackup = () => {
    try {
      const payload = {
        app: '99Pay Digital Wallet',
        version: '1.2.0-tz-release',
        exportDate: new Date().toISOString(),
        vaultFormat: '99PAY_ENCRYPTED_VAULT_V1',
        deviceLocale: 'Tanzania (sw-TZ)',
        stats: {
          bankCardsCount: vaultData.bankCards.length,
          mobileWalletsCount: vaultData.mobileWallets.length,
          identitiesCount: vaultData.identities.length,
          insuranceDocsCount: vaultData.insuranceDocs.length,
          lipaMerchantsCount: vaultData.lipaMerchants.length,
          pensionCardsCount: vaultData.pensionCards.length,
        },
        vaultPayload: vaultData,
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(payload, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      const filename = `99pay_vault_backup_${new Date().toISOString().slice(0, 10)}.99pay`;
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      setErrorMessage('Hitilafu wakati wa kutengeneza nakala ya faili.');
    }
  };

  // Real client-side JSON import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.vaultPayload) {
          throw new Error('Faili halina muundo sahihi wa 99Pay Vault.');
        }

        onRestoreData(parsed.vaultPayload);
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          onClose();
        }, 1500);
      } catch (err: any) {
        setErrorMessage(err.message || 'Faili limeharibika au si la 99Pay.');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteWipe = () => {
    if (wipePin !== '1992') {
      setErrorMessage('PIN siyo sahihi. Weka PIN yako ya vault (1992).');
      return;
    }
    onEmergencyWipe();
    setShowWipeConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
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
            className="w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white"
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

          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 text-[#00B887] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Nakala ya .99pay imepakuliwa salama kwenye simu yako!</span>
            </div>
          )}

          {importSuccess && (
            <div className="p-3 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 text-[#00B887] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Kadi na vitambulisho vyote vimepakiwa kwa mafanikio!</span>
            </div>
          )}

          {/* Non-Custodial Vault Guarantee */}
          <div className="p-3.5 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#00B887] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Uhuru Kamili wa Data (Self-Sovereign)</h4>
              <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
                99Pay haihifadhi kadi zako kwenye seva zetu. Data zote ziko mikononi mwako. Unaweza kupakua faili la nakala (backup) wakati wowote na kulihamishia kwenye simu nyingine.
              </p>
            </div>
          </div>

          {/* Action 1: Export */}
          <div className="p-4 rounded-xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-white">Pakua Nakala ya Vault</h5>
                <p className="text-[11px] text-[#B7C8C1]">
                  Inajumuisha kadi {vaultData.bankCards.length + vaultData.mobileWallets.length}, Lipa Namba {vaultData.lipaMerchants.length}, vitambulisho {vaultData.identities.length}.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-[#00B887]/15"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{t.exportVault}</span>
            </button>
          </div>

          {/* Action 2: Import */}
          <div className="p-4 rounded-xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div>
              <h5 className="font-bold text-white">Rejesha Kutoka Kwenye Faili</h5>
              <p className="text-[11px] text-[#B7C8C1]">
                Pakia faili la .99pay au .json uliilolihifadhi awali.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,.99pay"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#0B211B] transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#F4C95D]" />
              <span>{t.importVault}</span>
            </button>
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
                  ⚠️ Je, una uhakika unataka kufuta taarifa zote kwenye simu hii?
                </p>
                <p className="text-[11px] text-[#B7C8C1]">
                  Ingiza PIN ya vault (1992) kuthibitisha:
                </p>
                <input
                  type="password"
                  maxLength={4}
                  value={wipePin}
                  onChange={(e) => setWipePin(e.target.value)}
                  placeholder="PIN (1992)"
                  className="w-full bg-[#0B211B] border border-red-500/40 rounded-lg px-3 py-1.5 text-xs text-center font-mono text-white tracking-widest"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExecuteWipe}
                    className="flex-1 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-500 cursor-pointer"
                  >
                    Ndio, Futa Kila Kitu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWipeConfirm(false);
                      setWipePin('');
                    }}
                    className="py-1.5 px-3 rounded-lg bg-[#0B211B] border border-[#24473A] text-xs text-[#B7C8C1]"
                  >
                    Ghairi
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
