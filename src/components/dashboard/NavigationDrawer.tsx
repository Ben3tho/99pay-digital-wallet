import React from 'react';
import {
  X,
  ShieldCheck,
  Globe,
  Lock,
  LogOut,
  HardDrive,
  ChevronRight,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenSecurityCenter: () => void;
  onOpenBackup: () => void;
  onLockVaultNow: () => void;
  onSignOut: () => void;
  bankCardsCount: number;
  mobileWalletsCount: number;
  identitiesCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  onToggleLang,
  onOpenSecurityCenter,
  onOpenBackup,
  onLockVaultNow,
  onSignOut,
  bankCardsCount,
  mobileWalletsCount,
  identitiesCount,
}) => {
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Slide-out Drawer from Left */}
      <div
        className="relative w-72 sm:w-80 h-full bg-gradient-to-b from-[#06271D] via-[#041712] to-[#03120E] border-r border-[#24473A] shadow-2xl flex flex-col justify-between text-white z-10 animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header with Profile */}
        <div className="p-5 border-b border-[#24473A]/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F8D978] to-[#E6A92D] flex items-center justify-center text-[#03120E] font-black text-xs">
                99
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">
                99Pay Wallet
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[#B7C8C1] hover:text-white bg-[#0B211B] border border-[#24473A] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-[#00B887]/20 border border-[#00B887]/50 flex items-center justify-center text-[#F4C95D] font-black text-base shadow-inner">
              JB
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-white truncate">
                Joseph B. Mlay
              </h3>
              <p className="text-[11px] text-[#00B887] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'sw' ? 'Vault Imethibitishwa' : 'Vault Verified'}</span>
              </p>
              <span className="text-[10px] text-[#B7C8C1] block mt-0.5">
                {lang === 'sw'
                  ? `Kadi: ${bankCardsCount + mobileWalletsCount} | Hati: ${identitiesCount}`
                  : `Cards: ${bankCardsCount + mobileWalletsCount} | Docs: ${identitiesCount}`}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Settings, Security, Language, Backup) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 select-none">
          <span className="text-[10px] font-bold text-[#B7C8C1] uppercase tracking-wider px-2 block mb-1">
            {lang === 'sw' ? 'Mipangilio & Usalama' : 'Settings & Security'}
          </span>

          {/* 1. Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="w-full p-3 rounded-2xl bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887]/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#00B887]/15 border border-[#00B887]/30 flex items-center justify-center text-[#00B887]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {lang === 'sw' ? 'Lugha (Language)' : 'App Language'}
                </span>
                <span className="text-[10px] text-[#B7C8C1]">
                  {lang === 'sw' ? 'Kiswahili kimechaguliwa' : 'English selected'}
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-[#06271D] border border-[#F4C95D]/40 text-[#F4C95D] text-[11px] font-bold">
              {lang === 'sw' ? '🇹🇿 SW' : '🇬🇧 EN'}
            </span>
          </button>

          {/* 2. Security Hub & Audit Logs */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSecurityCenter();
            }}
            className="w-full p-3 rounded-2xl bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887]/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {t.securityCenter}
                </span>
                <span className="text-[10px] text-[#00B887]">
                  FLAG_SECURE &amp; Audit Logs
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B7C8C1] group-hover:text-white transition-colors" />
          </button>

          {/* 3. Offline Backup & Export */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBackup();
            }}
            className="w-full p-3 rounded-2xl bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-blue-500/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {t.vaultBackup}
                </span>
                <span className="text-[10px] text-[#B7C8C1]">
                  Faili la .99pay (AES-256)
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B7C8C1] group-hover:text-white transition-colors" />
          </button>

          {/* 4. Instant Lock Vault */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLockVaultNow();
            }}
            className="w-full p-3 rounded-2xl bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#F4C95D]/50 flex items-center justify-between text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F4C95D]/15 border border-[#F4C95D]/30 flex items-center justify-center text-[#F4C95D]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {lang === 'sw' ? 'Funga Vault Sasa' : 'Lock Vault Now'}
                </span>
                <span className="text-[10px] text-[#B7C8C1]">
                  Instant Device Lockdown
                </span>
              </div>
            </div>
            <span className="text-[10px] text-[#F4C95D] font-bold">Lock</span>
          </button>
        </div>

        {/* Drawer Footer with Logout & Security Compliance */}
        <div className="p-4 border-t border-[#24473A]/80 space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'sw' ? 'Toka kwenye Akaunti (Log Out)' : 'Log Out Account'}</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] text-[#B7C8C1]/60 block">
              99Pay v2.4 • Non-Custodial Hardware Vault
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
