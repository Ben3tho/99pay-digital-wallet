import React, { useState } from 'react';
import { Phone, AlertCircle } from 'lucide-react';

interface RegisterPhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onClearError?: () => void;
}

export const RegisterPhoneField: React.FC<RegisterPhoneFieldProps> = ({
  value,
  onChange,
  error,
  onClearError,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error && onClearError) {
      onClearError();
    }
  };

  const handlePrependTzPrefix = () => {
    if (!value.startsWith('+255')) {
      if (value.startsWith('0')) {
        onChange('+255 ' + value.slice(1).trim());
      } else if (value.trim() === '') {
        onChange('+255 ');
      } else {
        onChange('+255 ' + value.trim());
      }
    }
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium px-1">
        <label htmlFor="register-phone" className="text-[#B7C8C1]">
          Phone Number
        </label>

        {/* Optional Tanzania +255 country code helper */}
        {!value.startsWith('+255') && (
          <button
            type="button"
            onClick={handlePrependTzPrefix}
            className="text-[11px] text-[#00B887] hover:text-[#00B887]/80 active:scale-95 flex items-center gap-1 transition-all py-1 px-1.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00B887]/40"
            title="Optional: format with Tanzania country code (+255)"
          >
            <span>+255 (TZ)</span>
          </button>
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
          <div className="shrink-0 flex items-center justify-center text-[#B7C8C1]">
            <Phone
              className={`w-5 h-5 transition-colors ${
                error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
              }`}
            />
          </div>

          <input
            id="register-phone"
            type="tel"
            autoComplete="tel"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your phone number"
            aria-invalid={!!error}
            aria-describedby={error ? 'phone-error' : undefined}
            className="w-full bg-transparent text-white text-[15px] placeholder-[#B7C8C1]/50 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div
          id="phone-error"
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
