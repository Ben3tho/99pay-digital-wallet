import React, { useState } from 'react';
import {
  Lock,
  Fingerprint,
  Delete,
  ShieldCheck,
  CheckCircle2,
  ShieldAlert,
  KeyRound,
} from 'lucide-react';
import { NineNinePayLogo } from '../NineNinePayLogo';
import { Language } from '../../i18n/translations';
import { verifyDeviceBiometric } from '../../utils/biometrics';

interface VaultLockScreenProps {
  onUnlock: (verifiedPin?: string) => void;
  hasVaultPin: boolean;
  onVerifyPin: (pin: string) => Promise<boolean>;
  onSetPin: (pin: string) => Promise<void>;
  isBiometricEnabled?: boolean;
  lang?: Language;
  reason?: string;
}

export const VaultLockScreen: React.FC<VaultLockScreenProps> = ({
  onUnlock,
  hasVaultPin,
  onVerifyPin,
  onSetPin,
  isBiometricEnabled = true,
  lang = 'sw',
  reason,
}) => {
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCreatingPin = !hasVaultPin;

  const handleDigit = async (digit: string) => {
    if (pin.length >= 4 || isSuccess) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError(null);

    if (nextPin.length === 4) {
      if (isCreatingPin) {
        if (!firstPin) {
          setFirstPin(nextPin);
          setPin('');
        } else if (nextPin === firstPin) {
          await onSetPin(nextPin);
          setIsSuccess(true);
          setTimeout(() => {
            onUnlock(nextPin);
          }, 350);
        } else {
          setError(
            lang === 'sw'
              ? 'PIN hazikulingana. Weka upya.'
              : 'PINs did not match. Start again.'
          );
          setFirstPin(null);
          setPin('');
        }
      } else {
        const valid = await onVerifyPin(nextPin);
        if (valid) {
          setIsSuccess(true);
          setTimeout(() => {
            onUnlock(nextPin);
          }, 350);
        } else {
          setError(lang === 'sw' ? 'PIN siyo sahihi. Jaribu tena.' : 'Incorrect PIN. Try again.');
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleBiometric = async () => {
    if (!isBiometricEnabled || isCreatingPin) return;
    setError(null);
    const result = await verifyDeviceBiometric(
      lang === 'sw' ? 'Fungua 99Pay Vault' : 'Unlock 99Pay Vault',
      lang === 'sw' ? 'Thibitisha kwa alama ya kidole' : 'Verify with device biometrics'
    );
    if (result.verified) {
      setIsSuccess(true);
      setTimeout(() => {
        onUnlock();
      }, 300);
    } else if (result.reason === 'NOT_ENROLLED') {
      setError(
        lang === 'sw'
          ? 'Alama ya kidole haijasajiliwa bado. Fungua kwa PIN yako.'
          : 'Biometrics not enrolled yet. Unlock with your PIN.'
      );
    } else {
      setError(
        lang === 'sw'
          ? 'Uthibitisho wa alama ya kidole umeshindikana. Tumia PIN.'
          : 'Biometric check failed. Enter your PIN.'
      );
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-[#03120E] flex flex-col items-center justify-between p-6 text-white select-none animate-in fade-in duration-200">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] opacity-20"
          style={{ background: 'radial-gradient(circle, #00B887 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(circle, #F4C95D 0%, transparent 70%)' }}
        />
      </div>

      {/* Top Brand & Status */}
      <div className="flex flex-col items-center pt-8 z-10 text-center">
        <NineNinePayLogo />

        <div className="mt-6 w-14 h-14 rounded-2xl bg-[#06271D] border border-[#00B887]/40 flex items-center justify-center text-[#00B887] shadow-[0_0_25px_rgba(0,184,135,0.25)]">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-[#00B887]" />
          ) : isCreatingPin ? (
            <KeyRound className="w-7 h-7 text-[#F4C95D]" />
          ) : (
            <Lock className="w-7 h-7 text-[#F4C95D]" />
          )}
        </div>

        <h2 className="text-lg font-extrabold text-white mt-3 tracking-tight">
          {isCreatingPin
            ? firstPin
              ? lang === 'sw'
                ? 'Thibitisha PIN Yako Mpya'
                : 'Confirm Your New PIN'
              : lang === 'sw'
              ? 'Weka PIN ya Kufungua Vault'
              : 'Set Your Vault PIN'
            : lang === 'sw'
            ? '99Pay Vault Imefungwa'
            : '99Pay Vault Locked'}
        </h2>
        <p className="text-xs text-[#B7C8C1] mt-1 max-w-[260px] leading-relaxed">
          {isCreatingPin
            ? firstPin
              ? lang === 'sw'
                ? 'Ingiza tena tarakimu 4 kuthibitisha PIN yako.'
                : 'Re-enter your 4-digit PIN to confirm.'
              : lang === 'sw'
              ? 'Tengeneza PIN yako binafsi ya tarakimu 4 kufunga na kufungua vault.'
              : 'Create a private 4-digit PIN to lock and unlock your vault.'
            : reason ||
              (lang === 'sw'
                ? 'Vault imefungwa kulinda hati na kadi zako za benki.'
                : 'Vault is locked to protect your cards and IDs.')}
        </p>

        {/* 4 PIN Dots */}
        <div className="flex items-center justify-center gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#00B887] scale-125 shadow-[0_0_12px_#00B887]'
                    : 'bg-[#0B211B] border border-[#24473A]'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="text-[11px] font-semibold text-[#FF6B6B] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Numeric Keypad */}
      <div className="w-full max-w-xs z-10 pb-4">
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-[#06271D] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-xl font-bold text-white transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Biometrics */}
          <button
            type="button"
            onClick={handleBiometric}
            disabled={!isBiometricEnabled || isCreatingPin}
            className={`h-14 rounded-2xl border transition-all flex flex-col items-center justify-center ${
              isBiometricEnabled && !isCreatingPin
                ? 'bg-[#00B887]/10 hover:bg-[#00B887]/20 border-[#00B887]/40 active:scale-95 text-[#00B887] cursor-pointer'
                : 'bg-[#06271D]/40 border-[#24473A]/40 text-[#B7C8C1]/30 cursor-not-allowed'
            }`}
            title={lang === 'sw' ? 'Tumia Alama ya Kidole' : 'Use Biometrics'}
          >
            <Fingerprint className="w-6 h-6" />
          </button>

          {/* 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-[#06271D] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-xl font-bold text-white transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete digit"
            className="h-14 rounded-2xl bg-[#06271D] hover:bg-white/10 border border-[#24473A] active:scale-95 text-[#B7C8C1] hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#B7C8C1] pt-4 px-1">
          <span>
            {isCreatingPin
              ? lang === 'sw'
                ? 'Hifadhi ya SHA-256'
                : 'SHA-256 Local Lock'
              : lang === 'sw'
              ? 'Vault Imefungwa'
              : 'Vault Protected'}
          </span>
          <span className="text-[#F4C95D] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit Shield
          </span>
        </div>
      </div>
    </div>
  );
};
