import React, { useState } from 'react';
import { User, AlertCircle, Phone, Mail } from 'lucide-react';

interface SignInInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onClearError?: () => void;
}

export const SignInInputField: React.FC<SignInInputFieldProps> = ({
  value,
  onChange,
  error,
  onClearError,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Check if input looks like a phone number or email for dynamic icon hints
  const trimmed = value.trim();
  const isLikelyPhone = /^\+?[0-9\s-]{2,}$/.test(trimmed);
  const isLikelyEmail = trimmed.includes('@');

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
        <label htmlFor="signin-identifier" className="text-[#B7C8C1]">
          Phone number or email
        </label>

        {/* Helpful, completely optional Tanzanian phone helper (hidden if typing an email) */}
        {!value.startsWith('+255') && !isLikelyEmail && (
          <button
            type="button"
            onClick={handlePrependTzPrefix}
            className="text-[11px] text-[#00B887] hover:text-[#00B887]/80 active:scale-95 flex items-center gap-1 transition-all py-1 px-1.5 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00B887]/40"
            title="Optional: format with Tanzania country code (+255)"
          >
            <span>+255 format</span>
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
          {/* Dynamic contextual leading icon: Phone / Mail / Account */}
          <div className="shrink-0 flex items-center justify-center text-[#B7C8C1]">
            {isLikelyPhone ? (
              <Phone
                className={`w-5 h-5 transition-colors ${
                  error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
                }`}
              />
            ) : isLikelyEmail ? (
              <Mail
                className={`w-5 h-5 transition-colors ${
                  error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
                }`}
              />
            ) : (
              <User
                className={`w-5 h-5 transition-colors ${
                  error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
                }`}
              />
            )}
          </div>

          {/* Unified Input: accepts phone or email */}
          <input
            id="signin-identifier"
            type="text"
            autoComplete="username"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Phone number or email"
            aria-invalid={!!error}
            aria-describedby={error ? 'identifier-error' : undefined}
            className="w-full bg-transparent text-white text-[15px] placeholder-[#B7C8C1]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Accessible Inline Error Message */}
      {error && (
        <div
          id="identifier-error"
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
