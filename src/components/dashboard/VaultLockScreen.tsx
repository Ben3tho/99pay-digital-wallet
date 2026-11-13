import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { NineNinePayLogo } from '../NineNinePayLogo';

interface VaultLockScreenProps {
  onUnlock: () => void;
  reason?: string;
}

export const VaultLockScreen: React.FC<VaultLockScreenProps> = ({
  onUnlock,
  reason = 'Vault imefungwa kiotomatiki kulinda hati na kadi zako za benki.',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const correctPin = '1992';

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);

      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          setIsSuccess(true);
          setTimeout(() => {
            onUnlock();
          }, 350);
        } else {
          setError('PIN siyo sahihi. (Default: 1992)');
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleBiometric = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onUnlock();
    }, 400);
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
          ) : (
            <Lock className="w-7 h-7 text-[#F4C95D]" />
          )}
        </div>

        <h2 className="text-lg font-extrabold text-white mt-3 tracking-tight">
          99Pay Vault Imefungwa
        </h2>
        <p className="text-xs text-[#B7C8C1] mt-1 max-w-[260px] leading-relaxed">
          {reason}
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
          <div className="text-[11px] font-semibold text-[#FF6B6B] flex items-center gap-1.5 animate-bounce">
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
            className="h-14 rounded-2xl bg-[#00B887]/10 hover:bg-[#00B887]/20 border border-[#00B887]/40 active:scale-95 text-[#00B887] transition-all flex flex-col items-center justify-center cursor-pointer"
            title="Tumia Alama ya Kidole"
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
            className="h-14 rounded-2xl bg-[#06271D] hover:bg-white/10 border border-[#24473A] active:scale-95 text-[#B7C8C1] hover:text-white transition-all flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#B7C8C1] pt-4 px-1">
          <span>PIN ya Awali: <strong className="text-white">1992</strong></span>
          <span className="text-[#F4C95D] font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            256-Bit Shield
          </span>
        </div>
      </div>
    </div>
  );
};
