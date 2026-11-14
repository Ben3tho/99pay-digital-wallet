import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  History,
  X,
  Clock,
  Fingerprint,
  KeyRound,
  Check,
  AlertCircle,
} from 'lucide-react';
import { computeSecurityScore } from '../../utils/vaultSecurity';
import {
  getEnrolledCredentialId,
  enrollDeviceBiometric,
  clearEnrolledBiometric,
  isPlatformBiometricSupported,
} from '../../utils/biometrics';
import { Language } from '../../i18n/translations';

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  status: 'safe' | 'warning' | 'info';
}

interface SecurityCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  hasVaultPin: boolean;
  onVerifyPin: (pin: string) => Promise<boolean>;
  onUpdateVaultPin: (newPin: string) => Promise<void>;
  autoLockSeconds: number;
  onChangeAutoLock: (seconds: number) => void;
  isFlagSecureEnabled: boolean;
  onToggleFlagSecure: () => void;
  isBiometricEnabled: boolean;
  onToggleBiometric: () => void;
  auditLogs: AuditLogEntry[];
  onLockVaultNow: () => void;
  hasCloudSync?: boolean;
  userDisplayName?: string;
}

export const SecurityCenterModal: React.FC<SecurityCenterModalProps> = ({
  isOpen,
  onClose,
  lang = 'sw',
  hasVaultPin,
  onVerifyPin,
  onUpdateVaultPin,
  autoLockSeconds,
  onChangeAutoLock,
  isFlagSecureEnabled,
  onToggleFlagSecure,
  isBiometricEnabled,
  onToggleBiometric,
  auditLogs,
  onLockVaultNow,
  hasCloudSync = false,
  userDisplayName = '',
}) => {
  const [showPinForm, setShowPinForm] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [hasBiometricEnrolled, setHasBiometricEnrolled] = useState(Boolean(getEnrolledCredentialId()));
  const [bioMsg, setBioMsg] = useState<{ type: 'error' | 'ok'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasBiometricEnrolled(Boolean(getEnrolledCredentialId()));
      setBioMsg(null);
      void isPlatformBiometricSupported().then(setBiometricSupported);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const securityScore = computeSecurityScore({
    hasVaultPin,
    isFlagSecureEnabled,
    isBiometricEnabled,
    autoLockSeconds,
    hasBiometricEnrolled,
    hasCloudSync,
  });

  const scoreLabel =
    securityScore >= 85
      ? lang === 'sw'
        ? 'Imara Sana (Strong Shield)'
        : 'Strong Shield'
      : securityScore >= 60
      ? lang === 'sw'
        ? 'Wastani (Weka PIN)'
        : 'Moderate (Set PIN)'
      : lang === 'sw'
      ? 'Chini (Inahitaji PIN)'
      : 'Low (Needs PIN)';

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMsg(null);

    if (hasVaultPin) {
      const ok = await onVerifyPin(currentPin);
      if (!ok) {
        setPinMsg({
          type: 'error',
          text: lang === 'sw' ? 'PIN ya sasa siyo sahihi.' : 'Current PIN is incorrect.',
        });
        return;
      }
    }

    if (!/^\d{4}$/.test(newPin)) {
      setPinMsg({
        type: 'error',
        text: lang === 'sw' ? 'PIN lazima iwe tarakimu 4.' : 'New PIN must be 4 digits.',
      });
      return;
    }

    if (newPin !== confirmPin) {
      setPinMsg({
        type: 'error',
        text: lang === 'sw' ? 'PIN mpya hazikulingana.' : 'New PINs do not match.',
      });
      return;
    }

    await onUpdateVaultPin(newPin);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setShowPinForm(false);
    setPinMsg({
      type: 'ok',
      text: lang === 'sw' ? 'PIN yako ya vault imehifadhiwa!' : 'Vault PIN updated successfully!',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm max-h-[90vh] rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24473A] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#00B887]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {lang === 'sw' ? 'Kituo cha Usalama (Security Hub)' : 'Security Center'}
              </h3>
              <p className="text-[10px] text-[#F4C95D] font-medium">
                {lang === 'sw' ? 'Ulinzi wa Hati & Kadi za Benki' : 'Cards & Document Protection'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close security center"
            className="p-1.5 rounded-lg bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs text-[#B7C8C1]">
          {/* Real Calculated Security Score Badge */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B211B] to-[#041712] border border-[#00B887]/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#00B887]">
                {lang === 'sw' ? 'Kiwango Halisi cha Ulinzi' : 'Live Security Score'}
              </span>
              <h4 className="text-base font-extrabold text-white">
                {securityScore}% {scoreLabel}
              </h4>
              <p className="text-[11px] text-[#B7C8C1]">
                {hasVaultPin
                  ? lang === 'sw'
                    ? 'PIN binafsi na ulinzi wa skrini vimewashwa'
                    : 'Private PIN and screen shield are active'
                  : lang === 'sw'
                  ? 'Weka PIN yako ya tarakimu 4 kuongeza usalama'
                  : 'Set your private 4-digit PIN to raise protection'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-[#00B887] flex items-center justify-center bg-[#00B887]/15 text-[#00B887] font-mono font-bold text-sm shadow-[0_0_15px_rgba(0,184,135,0.3)] shrink-0">
              {securityScore}%
            </div>
          </div>

          {/* Vault PIN Management */}
          <div className="p-3 rounded-2xl bg-[#0B211B] border border-[#24473A] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <KeyRound className="w-4 h-4 text-[#F4C95D]" />
                <span>
                  {hasVaultPin
                    ? lang === 'sw'
                      ? 'Badili PIN ya Vault'
                      : 'Change Vault PIN'
                    : lang === 'sw'
                    ? 'Weka PIN ya Vault'
                    : 'Set Vault PIN'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPinForm((v) => !v);
                  setPinMsg(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#06271D] border border-[#00B887]/40 text-[#00B887] text-[11px] font-bold cursor-pointer"
              >
                {showPinForm
                  ? lang === 'sw'
                    ? 'Funga'
                    : 'Close'
                  : hasVaultPin
                  ? lang === 'sw'
                    ? 'Badili'
                    : 'Change'
                  : lang === 'sw'
                  ? 'Weka Sasa'
                  : 'Set Now'}
              </button>
            </div>

            {pinMsg && (
              <div
                className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${
                  pinMsg.type === 'ok'
                    ? 'bg-[#00B887]/15 text-[#00B887] border border-[#00B887]/40'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-700/40'
                }`}
              >
                {pinMsg.type === 'ok' ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{pinMsg.text}</span>
              </div>
            )}

            {showPinForm && (
              <form onSubmit={handleSavePin} className="space-y-2 pt-1">
                {hasVaultPin && (
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'sw' ? 'PIN ya sasa (tarakimu 4)' : 'Current 4-digit PIN'}
                    className="w-full h-9 px-3 rounded-lg bg-[#06271D] border border-[#24473A] text-white font-mono text-xs"
                  />
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'sw' ? 'PIN mpya' : 'New PIN'}
                    className="w-full h-9 px-3 rounded-lg bg-[#06271D] border border-[#24473A] text-white font-mono text-xs"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder={lang === 'sw' ? 'Thibitisha PIN' : 'Confirm PIN'}
                    className="w-full h-9 px-3 rounded-lg bg-[#06271D] border border-[#24473A] text-white font-mono text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs cursor-pointer"
                >
                  {lang === 'sw' ? 'Hifadhi PIN ya Vault' : 'Save Vault PIN'}
                </button>
              </form>
            )}
          </div>

          {/* Instant Lock Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onLockVaultNow();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0B211B] hover:bg-[#FF6B6B]/15 border border-[#FF6B6B]/40 hover:border-[#FF6B6B] text-[#FF6B6B] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>
              {lang === 'sw' ? 'Funga Vault Mara Moja (Emergency Lock)' : 'Lock Vault Immediately'}
            </span>
          </button>

          {/* Section: Auto-Lock Interval */}
          <div className="space-y-2 p-3 rounded-2xl bg-[#0B211B] border border-[#24473A]">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Clock className="w-4 h-4 text-[#F4C95D]" />
              <span>
                {lang === 'sw' ? 'Muda wa Kufunga Kiotomatiki' : 'Auto-Lock Timeout'}
              </span>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              {lang === 'sw'
                ? 'Kama hutaigusa simu kwa muda huu, wallet itajifunga kulinda taarifa zako.'
                : 'Automatically locks your vault after inactivity.'}
            </p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { label: '30s', val: 30 },
                { label: '1m', val: 60 },
                { label: '2m', val: 120 },
                { label: '5m', val: 300 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChangeAutoLock(opt.val)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    autoLockSeconds === opt.val
                      ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                      : 'bg-[#06271D] text-[#B7C8C1] border border-[#24473A] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Android FLAG_SECURE (Screenshot Blocker) */}
          <div className="p-3 rounded-2xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <EyeOff className="w-4 h-4 text-[#00B887]" />
                <span>Ulinzi wa Screenshot (FLAG_SECURE)</span>
              </div>
              <button
                type="button"
                onClick={onToggleFlagSecure}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  isFlagSecureEnabled ? 'bg-[#00B887]' : 'bg-[#24473A]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isFlagSecureEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              {lang === 'sw'
                ? 'Huzuia simu kuchukua screenshots, kurekodi video ya kioo au kuonesha taarifa kwenye Recent Apps.'
                : 'Blocks screenshots, screen recording, and task-switcher previews on Android.'}
            </p>
          </div>

          {/* Section: Biometrics Toggle */}
          <div className="p-3 rounded-2xl bg-[#0B211B] border border-[#24473A] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Fingerprint className="w-4 h-4 text-[#F4C95D]" />
                <span>
                  {lang === 'sw' ? 'Ufunguzi wa Haraka (Biometrics)' : 'Quick Unlock (Biometrics)'}
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleBiometric}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  isBiometricEnabled ? 'bg-[#00B887]' : 'bg-[#24473A]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#B7C8C1] leading-relaxed">
              {lang === 'sw'
                ? 'Ruhusu kufungua kadi na hati zako kwa alama ya kidole au Face ID baada ya kusajili kifaa.'
                : 'Verify identity with hardware WebAuthn biometrics once enrolled.'}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              {hasBiometricEnrolled ? (
                <>
                  <span className="text-[10px] font-bold text-[#00B887]">
                    ✓ {lang === 'sw' ? 'Kifaa kimesajiliwa' : 'Device Enrolled'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearEnrolledBiometric();
                      setHasBiometricEnrolled(false);
                      setBioMsg({
                        type: 'ok',
                        text: lang === 'sw' ? 'Usajili wa alama ya kidole umeondolewa.' : 'Biometric credential removed.',
                      });
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-800/50 text-[10px] font-bold text-rose-300 cursor-pointer"
                  >
                    {lang === 'sw' ? 'Ondoa Usajili' : 'Remove'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    setBioMsg(null);
                    const res = await enrollDeviceBiometric(userDisplayName);
                    if (res.ok) {
                      setHasBiometricEnrolled(true);
                      setBioMsg({
                        type: 'ok',
                        text: lang === 'sw' ? 'Alama ya kidole imesajiliwa kikamilifu!' : 'Device biometrics enrolled!',
                      });
                    } else {
                      setBioMsg({
                        type: 'error',
                        text: res.error || (lang === 'sw' ? 'Usajili umeshindikana.' : 'Enrollment failed.'),
                      });
                    }
                  }}
                  disabled={!biometricSupported}
                  className="w-full py-2 rounded-xl bg-[#06271D] border border-[#00B887]/40 hover:border-[#00B887] text-[11px] font-bold text-[#00B887] cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {biometricSupported
                    ? lang === 'sw'
                      ? 'Sajili Alama ya Kidole / Face ID Sasa'
                      : 'Enroll Device Biometrics Now'
                    : lang === 'sw'
                    ? 'Kivinjari hiki hakiauni WebAuthn Biometrics — Tumia PIN'
                    : 'WebAuthn Biometrics unavailable here — Use Vault PIN'}
                </button>
              )}
            </div>
            {bioMsg && (
              <p className={`text-[10px] ${bioMsg.type === 'ok' ? 'text-[#00B887]' : 'text-rose-300'}`}>
                {bioMsg.text}
              </p>
            )}
          </div>

          {/* Section: Real Audit Activity Log */}
          <div className="space-y-2 p-3 rounded-2xl bg-[#0B211B] border border-[#24473A]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <History className="w-4 h-4 text-[#00B887]" />
                <span>
                  {lang === 'sw' ? 'Kumbukumbu ya Ufikiaji (Audit Log)' : 'Real-Time Audit Log'}
                </span>
              </div>
              <span className="text-[10px] text-[#F4C95D] font-mono">
                {auditLogs.length} {lang === 'sw' ? 'rekodi' : 'events'}
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pt-1 pr-1">
              {auditLogs.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#06271D] border border-[#24473A] text-center text-[11px] text-[#B7C8C1]">
                  {lang === 'sw'
                    ? 'Bado hakuna tukio lililorekodiwa. Hatua zako zitarekodiwa hapa kiotomatiki.'
                    : 'No events recorded yet. Your vault actions will appear here.'}
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded-xl bg-[#06271D] border border-[#24473A] flex items-start gap-2 text-[10px]"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                        log.status === 'warning'
                          ? 'bg-[#FF6B6B]'
                          : log.status === 'safe'
                          ? 'bg-[#00B887]'
                          : 'bg-[#F4C95D]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-white font-semibold gap-2">
                        <span className="truncate">{log.action}</span>
                        <span className="text-[9px] text-[#B7C8C1] font-mono flex-shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                      <span className="text-[#B7C8C1] text-[10px] block truncate">
                        {log.details}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BoT & Bank Guidelines Notice */}
          <div className="p-3 rounded-2xl bg-[#041712] border border-[#24473A]/80 space-y-1.5">
            <span className="text-[10px] font-bold text-[#F4C95D] uppercase tracking-wider block">
              {lang === 'sw' ? 'Sera ya Usalama (BoT Aligned)' : 'Security Policy (BoT Aligned)'}
            </span>
            <ul className="text-[10px] text-[#B7C8C1] space-y-1 list-disc list-inside">
              <li>
                {lang === 'sw'
                  ? '99Pay haihifadhi namba ya siri ya ATM (Bank PIN).'
                  : '99Pay never stores ATM PIN codes.'}
              </li>
              <li>
                {lang === 'sw'
                  ? 'Namba za siri za nyuma (CVV/CVC) hazihifadhiwi kamwe.'
                  : 'Card security codes (CVV/CVC) are never stored.'}
              </li>
              <li>
                {lang === 'sw'
                  ? 'Taarifa zote huhifadhiwa ndani ya kifaa chako pekee.'
                  : 'All vault records remain encrypted locally on your device.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#24473A] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#00B887] hover:bg-[#00B887]/90 text-[#03120E] font-bold text-xs cursor-pointer shadow-md transition-all"
          >
            {lang === 'sw' ? 'Funga Kituo cha Usalama' : 'Close Security Hub'}
          </button>
        </div>
      </div>
    </div>
  );
};
