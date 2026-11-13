import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, Delete, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface PinPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  reason?: string;
}

export const PinPromptModal: React.FC<PinPromptModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Thibitisha Utambulisho Wako',
  reason = 'Weka PIN yako ya tarakimu 4 au tumia alama ya kidole kuona taarifa nyeti',
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const correctPin = '1992'; // Standard demo/default vault PIN

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setError('PIN siyo sahihi. Jaribu tena (Default: 1992)');
      setPin('');
    }
  };

  const handleBiometricAuth = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xs rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-6 text-white text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#00B887]/15 border border-[#00B887]/40 flex items-center justify-center text-[#00B887] mb-3 shadow-[0_0_20px_rgba(0,184,135,0.2)]">
          {isSuccess ? (
            <CheckCircle2 className="w-7 h-7 text-[#00B887]" />
          ) : (
            <Lock className="w-7 h-7 text-[#F4C95D]" />
          )}
        </div>

        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-[#B7C8C1] mt-1 leading-relaxed max-w-[240px]">
          {reason}
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
            <ShieldAlert className="w-3.5 h-3.5" />
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
              className="h-12 rounded-xl bg-[#0B211B] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          {/* Biometrics Button */}
          <button
            type="button"
            onClick={handleBiometricAuth}
            className="h-12 rounded-xl bg-[#00B887]/10 hover:bg-[#00B887]/20 border border-[#00B887]/40 active:scale-95 text-[#00B887] transition-all flex items-center justify-center gap-1"
            title="Biometric Fingerprint"
          >
            <Fingerprint className="w-5 h-5" />
          </button>

          {/* Digit 0 */}
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-[#0B211B] hover:bg-[#00B887]/15 border border-[#24473A] hover:border-[#00B887]/50 active:scale-95 text-lg font-bold text-white transition-all flex items-center justify-center"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-xl bg-[#0B211B] hover:bg-white/10 border border-[#24473A] active:scale-95 text-[#B7C8C1] hover:text-white transition-all flex items-center justify-center"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-[#24473A] w-full flex items-center justify-between text-[10px] text-[#B7C8C1]">
          <span>PIN ya Awali: 1992</span>
          <span className="text-[#F4C95D] font-medium">99Pay Shield</span>
        </div>
      </div>
    </div>
  );
};
