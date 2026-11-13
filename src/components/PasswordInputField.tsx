import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface PasswordInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onClearError?: () => void;
  onEnterPress?: () => void;
}

export const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  value,
  onChange,
  error,
  onClearError,
  onEnterPress,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (error && onClearError) {
      onClearError();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnterPress) {
      onEnterPress();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium px-1">
        <label htmlFor="signin-password" className="text-[#B7C8C1]">
          Password
        </label>
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
          {/* Leading Lock Icon */}
          <div className="shrink-0 flex items-center justify-center">
            <Lock
              className={`w-5 h-5 transition-colors ${
                error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
              }`}
            />
          </div>

          {/* Password Input */}
          <input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Password"
            aria-invalid={!!error}
            aria-describedby={error ? 'password-error' : undefined}
            className="w-full bg-transparent text-white text-[15px] placeholder-[#B7C8C1]/50 focus:outline-none"
          />

          {/* Trailing Visibility Toggle with 44px touch target */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
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

      {/* Accessible Inline Error Message */}
      {error && (
        <div
          id="password-error"
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
