import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface RegisterPasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onClearError?: () => void;
  showStrength?: boolean;
}

export const RegisterPasswordField: React.FC<RegisterPasswordFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  onClearError,
  showStrength = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error && onClearError) {
      onClearError();
    }
  };

  // Password strength calculation
  const hasMinLength = value.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^a-zA-Z0-9]/.test(value);

  const strengthScore = [hasMinLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel =
    value.length === 0
      ? ''
      : strengthScore <= 2
      ? 'Weak'
      : strengthScore === 3
      ? 'Good'
      : 'Strong';

  const strengthColor =
    strengthScore <= 2 ? 'text-[#FF6B6B]' : strengthScore === 3 ? 'text-[#F4C95D]' : 'text-[#00B887]';

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium px-1">
        <label htmlFor={id} className="text-[#B7C8C1]">
          {label}
        </label>
        {showStrength && value.length > 0 && (
          <span className={`text-[11px] font-semibold ${strengthColor} transition-colors`}>
            {strengthLabel}
          </span>
        )}
      </div>

      <div
        className={`relative w-full rounded-2xl transition-all duration-200 ${
          error
            ? 'bg-[#0B211B] ring-1 ring-[#FF6B6B]'
            : isFocused
            ? 'bg-[#0B211B] ring-1.5 ring-[#00B887] shadow-[0_0_12px_rgba(0,184,135,0.18)]'
            : 'bg-[#0B211B] border border-[#24473A] hover:border-[#24473A]/80'
        }`}
      >
        <div className="flex items-center h-13 sm:h-14 px-3.5 sm:px-4 gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <Lock
              className={`w-5 h-5 transition-colors ${
                error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
              }`}
            />
          </div>

          <input
            id={id}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className="w-full bg-transparent text-white text-[15px] placeholder-[#B7C8C1]/50 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            className="shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-[#B7C8C1] hover:text-white active:scale-95 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00B887]"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-[#00B887]" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {showStrength && isFocused && (
        <div className="flex items-center gap-2 px-1 pt-0.5 text-[11px] text-[#B7C8C1]/75">
          <span className={hasMinLength ? 'text-[#00B887]' : 'text-[#B7C8C1]/60'}>
            8+ chars
          </span>
          <span>•</span>
          <span className={hasLetter && hasNumber ? 'text-[#00B887]' : 'text-[#B7C8C1]/60'}>
            Letters & numbers
          </span>
        </div>
      )}

      {error && (
        <div
          id={`${id}-error`}
          className="flex items-center gap-1.5 text-xs text-[#FF6B6B] px-2 pt-0.5"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
