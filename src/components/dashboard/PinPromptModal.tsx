import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, Delete, X, ShieldAlert, CheckCircle2, KeyRound } from 'lucide-react';
import { Language } from '../../i18n/translations';
import { verifyDeviceBiometric } from '../../utils/biometrics';

interface PinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (verifiedPin?: string) => void;
  hasVaultPin: boolean;
  onVerifyPin: (pin: string) => Promise<boolean>;
  onSetPin: (pin: string) => Promise<void>;
  isBiometricEnabled?: boolean;
  lang?: Language;
  title?: string;
  reason?: string;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  hasVaultPin,
  onVerifyPin,
  onSetPin,
  isBiometricEnabled = true,
  lang = 'sw',
  title,
  reason,
}) => {
  const [pin, setPin] = useState<string>('');
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isCreatingPin = !hasVaultPin;

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setFirstPin(null);
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
            onSuccess(nextPin);
            onClose();
          }, 350);
        } else {
          setError(
            lang === 'sw'
              ? 'PIN hazikulingana. Jaribu tena tangu mwanzo.'
              : 'PINs did not match. Please try again.'
          );
          setFirstPin(null);
          setPin('');
        }
      } else {
        const valid = await onVerifyPin(nextPin);
        if (valid) {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess(nextPin);
            onClose();
          }, 350);
        } else {
          setError(
            lang === 'sw'
              ? 'PIN siyo sahihi. Jaribu tena.'
              : 'Incorrect Vault PIN. Try again.'
          );
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleBiometricAuth = async () => {
    if (!isBiometricEnabled || isCreatingPin) return;
    setError(null);
    const result = await verifyDeviceBiometric(
      lang === 'sw' ? 'Thibitisha Utambulisho' : 'Verify Identity',
      reason || (lang === 'sw' ? 'Thibitisha kuona namba ya kadi' : 'Authenticate to reveal card')
    );
    if (result.verified) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 300);
    } else if (result.reason === 'NOT_ENROLLED') {
      setError(
        lang === 'sw'
          ? 'Alama ya kidole haijasajiliwa. Sajili kupitia Security Hub au tumia PIN.'
          : 'Biometrics not enrolled yet. Enroll in Security Hub or use PIN.'
      );
    } else {
      setError(
        lang === 'sw'
          ? 'Uthibitisho wa alama ya kidole umeshindikana. Tumia PIN yako.'
          : 'Biometric verification failed. Please enter your PIN.'
      );
    }
  };

  const resolvedTitle = isCreatingPin
    ? firstPin
      ? lang === 'sw'
        ? 'Thibitisha PIN Yako Mpya'
        : 'Confirm Your New PIN'
      : lang === 'sw'
      ? 'Weka PIN Mpya ya Vault'
      : 'Create Your Vault PIN'
    : title || (lang === 'sw' ? 'Thibitisha Utambulisho Wako' : 'Verify Your Identity');

  const resolvedReason = isCreatingPin
    ? firstPin
      ? lang === 'sw'
        ? 'Ingiza tena tarakimu 4 kuthibitisha PIN yako binafsi.'
        : 'Re-enter your 4-digit PIN to confirm.'
      : lang === 'sw'
      ? 'Tengeneza PIN yako ya tarakimu 4 kulinda namba za kadi na vault.'
      : 'Create a private 4-digit PIN to protect card numbers and vault lock.'
    : reason ||
      (lang === 'sw'
        ? 'Weka PIN yako ya tarakimu 4 kuona taarifa nyeti'
        : 'Enter your 4-digit Vault PIN to continue');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-6 text-white text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close PIN prompt"
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#00B887]/15 border border-[#00B887]/40 flex items-center justify-center text-[#00B887] mb-3 shadow-[0_0_20px_rgba(0,184,135,0.2)]">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-[#00B887]" />
          ) : isCreatingPin ? (
            <KeyRound className="w-7 h-7 text-[#F4C95D]" />
          ) : (
            <Lock className="w-7 h-7 text-[#F4C95D]" />
          )}
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">{resolvedTitle}</h3>
        <p className="text-xs text-[#B7C8C1] mt-1 leading-relaxed max-w-[240px]">
          {resolvedReason}
        </p>

        {/* PIN Dots Indicator */}
        <div className="flex items-center justify-center gap-4 my-5">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-[#00B887] scale-125 shadow-[0_0_10px_#00B887]'
                    : 'bg-[#0B211B] border border-[#24473A]'
                }`}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="text-[11px] font-semibold text-[#FF6B6B] flex items-center gap-1 mb-2">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full mt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl bg-[#0B211B] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Biometrics Button (only when PIN exists and biometric enabled) */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            disabled={!isBiometricEnabled || isCreatingPin}
            className={`h-12 rounded-xl border transition-all flex items-center justify-center gap-1 ${
              isBiometricEnabled && !isCreatingPin
                ? 'bg-[#00B887]/10 hover:bg-[#00B887]/20 border-[#00B887]/40 active:scale-95 text-[#00B887] cursor-pointer'
                : 'bg-[#0B211B]/50 border-[#24473A]/50 text-[#B7C8C1]/30 cursor-not-allowed'
            }`}
            title={lang === 'sw' ? 'Alama ya Kidole' : 'Biometric Fingerprint'}
          >
            <Fingerprint className="w-5 h-5" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-[#0B211B] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete digit"
            className="h-12 rounded-xl bg-[#0B211B] hover:bg-white/10 border border-[#24473A] active:scale-95 text-[#B7C8C1] hover:text-white transition-all flex items-center justify-center cursor-pointer"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#24473A] w-full flex items-center justify-between text-[10px] text-[#B7C8C1]">
          <span>
            {isCreatingPin
              ? lang === 'sw'
                ? 'Hifadhi kwa SHA-256'
                : 'SHA-256 Protected'
              : lang === 'sw'
              ? 'PIN Binafsi Imelindwa'
              : 'Private Vault PIN'}
          </span>
          <span className="text-[#F4C95D] font-medium">99Pay Shield</span>
        </div>
      </div>
    </div>
  );
};
