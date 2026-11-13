import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  HeartPulse,
  Award,
  HardDrive,
  Download,
  Upload,
  Lock,
  LogOut,
  Trash2,
  Globe,
  Clock,
  ShieldAlert,
  ChevronRight,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { IdentityDocItem, InsuranceDocItem, PensionLoyaltyItem } from '../../data/walletData';
import { IdentityCard } from './IdentityCard';
import { AnimatedIdentityStack } from './AnimatedIdentityStack';
import { InsuranceCard } from './InsuranceCard';
import { PensionLoyaltyCard } from './PensionLoyaltyCard';
import { AuditLogEntry } from './SecurityCenterModal';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface VaultSettingsTabProps {
  identities: IdentityDocItem[];
  insuranceDocs: InsuranceDocItem[];
  pensionCards: PensionLoyaltyItem[];
  lang: Language;
  onToggleLang: () => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenSecurityModal: () => void;
  onLockVaultNow: () => void;
  onSignOut: () => void;
  onEmergencyWipe: () => void;
  copyToClipboard: (text: string, label: string) => void;
  onViewIdentityDetail: (item: IdentityDocItem) => void;
  onViewInsuranceDetail: (item: InsuranceDocItem) => void;
  autoLockSeconds: number;
  onChangeAutoLock: (sec: number) => void;
  isFlagSecureEnabled: boolean;
  onToggleFlagSecure: () => void;
  isBiometricEnabled: boolean;
  onToggleBiometric: () => void;
}

export const VaultSettingsTab: React.FC<VaultSettingsTabProps> = ({
  identities,
  insuranceDocs,
  pensionCards,
  lang,
  onToggleLang,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenSecurityModal,
  onLockVaultNow,
  onSignOut,
  onEmergencyWipe,
  copyToClipboard,
  onViewIdentityDetail,
  onViewInsuranceDetail,
  autoLockSeconds,
  onChangeAutoLock,
  isFlagSecureEnabled,
  onToggleFlagSecure,
  isBiometricEnabled,
  onToggleBiometric,
}) => {
  const t = TRANSLATIONS[lang];
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  // Sub-navigation filter within Settings/Vault for IDs vs Settings
  const [activeSubSection, setActiveSubSection] = useState<'documents' | 'security' | 'system'>('documents');

  return (
    <div className="w-full flex flex-col space-y-4 pb-6">
      {/* Vault Profile Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06271D] via-[#0B211B] to-[#041712] border border-[#24473A] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D] font-black text-lg">
            JM
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Joseph B. Mlay</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00B887]" />
              <span className="text-xs text-[#00B887] font-semibold">Vault Imehakikiwa</span>
              <span className="text-xs text-[#B7C8C1]">· +255 744 ***</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLockVaultNow}
          className="p-2 rounded-xl bg-[#03120E] border border-[#24473A] hover:border-[#F4C95D] text-[#F4C95D] transition-colors cursor-pointer active:scale-95"
          title="Funga Vault Mara Moja"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-section Switcher Pills */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0B211B] border border-[#24473A]">
        <button
          type="button"
          onClick={() => setActiveSubSection('documents')}
          className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
            activeSubSection === 'documents'
              ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
              : 'text-[#B7C8C1] hover:text-white'
          }`}
        >
          {lang === 'sw' ? 'Nyaraka & Hati' : 'Documents'} ({identities.length + insuranceDocs.length + pensionCards.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('security')}
          className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
            activeSubSection === 'security'
              ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
              : 'text-[#B7C8C1] hover:text-white'
          }`}
        >
          {lang === 'sw' ? 'Usalama' : 'Security'}
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('system')}
          className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all cursor-pointer ${
            activeSubSection === 'system'
              ? 'bg-[#06271D] text-[#F4C95D] border border-[#00B887] shadow-sm'
              : 'text-[#B7C8C1] hover:text-white'
          }`}
        >
          {lang === 'sw' ? 'Mipangilio' : 'Settings'}
        </button>
      </div>

      {/* ===================== VIEW 1: NYARAKA NA HATI ===================== */}
      {activeSubSection === 'documents' && (
        <div className="space-y-4">
          {/* Action Row */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#B7C8C1] uppercase tracking-wider">
              {lang === 'sw' ? 'Vitambulisho & Hati Rasmi' : 'Official IDs & Documents'}
            </span>
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1 text-xs text-[#00B887] hover:text-[#F4C95D] font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>{t.addNew}</span>
            </button>
          </div>

          {/* 1. National IDs with 3D Stack / Scroll Animation */}
          <AnimatedIdentityStack
            identities={identities}
            lang={lang}
            onViewIdentityDetail={onViewIdentityDetail}
          />

          {/* 2. Health Insurance (NHIF / Jubilee) */}
          <div className="pt-2 space-y-2.5">
            <span className="text-xs font-bold text-[#B7C8C1] uppercase tracking-wider block px-1">
              {lang === 'sw' ? 'Bima ya Afya' : 'Health Insurance'}
            </span>
            {insuranceDocs.map((item) => (
              <InsuranceCard
                key={item.id}
                item={item}
                onClick={() => onViewInsuranceDetail(item)}
              />
            ))}
          </div>

          {/* 3. Pension & Loyalty Cards */}
          <div className="pt-2 space-y-2.5">
            <span className="text-xs font-bold text-[#B7C8C1] uppercase tracking-wider block px-1">
              {lang === 'sw' ? 'Mifuko ya Hifadhi ya Jamii & Mafao' : 'Pension & Loyalty Cards'}
            </span>
            {pensionCards.map((item) => (
              <PensionLoyaltyCard
                key={item.id}
                item={item}
                lang={lang}
                onCopy={copyToClipboard}
              />
            ))}
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: USALAMA & NAKALA ===================== */}
      {activeSubSection === 'security' && (
        <div className="space-y-3.5">
          {/* Backup & Export Direct Banner */}
          <div className="p-4 rounded-2xl bg-[#06271D] border border-[#24473A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <HardDrive className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Hifadhi ya Nakala (Backup)' : 'Vault Backup & Export'}</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-bold">
                Offline .99pay
              </span>
            </div>
            <p className="text-xs text-[#B7C8C1]">
              {lang === 'sw'
                ? 'Hifadhi kadi na vitambulisho vyako kwenye faili la usalama lililofungwa kwa AES-256. Unaweza kulirejesha kwenye simu yoyote bila intaneti.'
                : 'Safely backup all cards and IDs into an encrypted .99pay file for offline recovery.'}
            </p>
            <button
              type="button"
              onClick={onOpenBackupModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Fungua Meneja wa Nakala' : 'Open Backup Manager'}</span>
            </button>
          </div>

          {/* Android FLAG_SECURE Controller */}
          <div className="p-3.5 rounded-2xl bg-[#06271D] border border-[#24473A] flex items-center justify-between">
            <div className="pr-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#00B887]" />
                <span>Android FLAG_SECURE</span>
              </div>
              <p className="text-[11px] text-[#B7C8C1] mt-0.5">
                {lang === 'sw'
                  ? 'Kuzuia screenshots na kurekodi video ya skrini'
                  : 'Block screenshots & screen recordings'}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleFlagSecure}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                isFlagSecureEnabled ? 'bg-[#00B887] justify-end' : 'bg-[#24473A] justify-start'
              }`}
            >
              <div className="w-5.5 h-5.5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Biometrics Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#06271D] border border-[#24473A] flex items-center justify-between">
            <div className="pr-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Lock className="w-4 h-4 text-[#F4C95D]" />
                <span>{lang === 'sw' ? 'Alama ya Kidole / Biometrics' : 'Biometric Auth'}</span>
              </div>
              <p className="text-[11px] text-[#B7C8C1] mt-0.5">
                {lang === 'sw'
                  ? 'Thibitisha kwa alama ya kidole kabla ya kuona namba ya kadi'
                  : 'Require fingerprint verification before revealing card number'}
              </p>
            </div>
            <button
              type="button"
              onClick={onToggleBiometric}
              className={`w-12 h-6.5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                isBiometricEnabled ? 'bg-[#00B887] justify-end' : 'bg-[#24473A] justify-start'
              }`}
            >
              <div className="w-5.5 h-5.5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          {/* Auto-Lock Duration */}
          <div className="p-3.5 rounded-2xl bg-[#06271D] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{lang === 'sw' ? 'Kufunga Skrini Kiotomatiki' : 'Auto-Lock Inactivity'}</span>
              </div>
              <span className="text-xs font-bold text-[#F4C95D]">
                {autoLockSeconds >= 60 ? `${autoLockSeconds / 60} min` : `${autoLockSeconds}s`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[30, 60, 120, 300].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onChangeAutoLock(sec)}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    autoLockSeconds === sec
                      ? 'bg-[#00B887] text-[#03120E]'
                      : 'bg-[#0B211B] text-[#B7C8C1] border border-[#24473A] hover:text-white'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Full Security Hub Modal Opener */}
          <button
            type="button"
            onClick={onOpenSecurityModal}
            className="w-full py-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#00B887] text-white font-bold text-xs flex items-center justify-between px-4 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Kumbukumbu za Usalama (Audit Logs)' : 'View Security Audit Logs'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B7C8C1]" />
          </button>
        </div>
      )}

      {/* ===================== VIEW 3: MIPANGILIO YA MFUMO ===================== */}
      {activeSubSection === 'system' && (
        <div className="space-y-3.5">
          {/* Language Switcher */}
          <div className="p-3.5 rounded-2xl bg-[#06271D] border border-[#24473A] flex items-center justify-between">
            <div className="flex items-center gap-2 text-white text-sm font-bold">
              <Globe className="w-4 h-4 text-[#00B887]" />
              <span>{lang === 'sw' ? 'Lugha ya Mfumo' : 'App Language'}</span>
            </div>
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B211B] border border-[#00B887]/50 text-xs font-bold text-[#F4C95D] cursor-pointer hover:border-[#F4C95D] transition-colors"
            >
              <span>{lang === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span>
            </button>
          </div>

          {/* Lock Vault Now Button */}
          <button
            type="button"
            onClick={onLockVaultNow}
            className="w-full py-3 rounded-2xl bg-[#06271D] border border-[#24473A] hover:border-[#F4C95D] text-white font-bold text-xs flex items-center justify-between px-4 cursor-pointer transition-all active:scale-98"
          >
            <div className="flex items-center gap-2.5 text-[#F4C95D]">
              <Lock className="w-4 h-4" />
              <span className="text-white">
                {lang === 'sw' ? 'Funga Vault Mara Moja' : 'Lock Vault Now'}
              </span>
            </div>
            <span className="text-[11px] text-[#B7C8C1]">Instant Lock</span>
          </button>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={onSignOut}
            className="w-full py-3 rounded-2xl bg-[#06271D] border border-[#24473A] hover:border-amber-500/50 text-white font-bold text-xs flex items-center justify-between px-4 cursor-pointer transition-all active:scale-98"
          >
            <div className="flex items-center gap-2.5 text-amber-400">
              <LogOut className="w-4 h-4" />
              <span className="text-white">
                {lang === 'sw' ? 'Toka kwenye Akaunti (Sign Out)' : 'Sign Out'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B7C8C1]" />
          </button>

          {/* Emergency Wipe Section */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>{lang === 'sw' ? 'Futa Data Zote (Emergency Wipe)' : 'Emergency Data Wipe'}</span>
            </div>
            <p className="text-xs text-rose-200/80">
              {lang === 'sw'
                ? 'Hufuta kabisa kadi, vitambulisho, na tills zote kwenye kumbukumbu ya simu hii mara moja iwapo kuna hatari.'
                : 'Instantly purges all cards, IDs, and records from local hardware storage in case of emergency.'}
            </p>

            {showWipeConfirm ? (
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-white block">
                  {lang === 'sw' ? 'Una uhakika unataka kufuta kila kitu sasa?' : 'Are you sure you want to permanently wipe?'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onEmergencyWipe();
                      setShowWipeConfirm(false);
                    }}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
                  >
                    {lang === 'sw' ? 'Ndio, Futa Kila Kitu' : 'Yes, Wipe Everything'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWipeConfirm(false)}
                    className="flex-1 py-2 rounded-xl bg-[#0B211B] border border-[#24473A] text-[#B7C8C1] font-bold text-xs cursor-pointer hover:text-white transition-colors"
                  >
                    {lang === 'sw' ? 'Ghairi' : 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowWipeConfirm(true)}
                className="w-full py-2.5 rounded-xl bg-rose-600/20 border border-rose-600/40 hover:bg-rose-600/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'sw' ? 'Futa Vault Kabisa' : 'Purge All Vault Data'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
