import React, { useState } from 'react';
import { User, AlertCircle } from 'lucide-react';

interface RegisterFullNameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  onClearError?: () => void;
}

export const RegisterFullNameField: React.FC<RegisterFullNameFieldProps> = ({
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

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs font-medium px-1">
        <label htmlFor="register-fullname" className="text-[#B7C8C1]">
          Full Name
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
          <div className="shrink-0 flex items-center justify-center text-[#B7C8C1]">
            <User
              className={`w-5 h-5 transition-colors ${
                error ? 'text-[#FF6B6B]' : isFocused ? 'text-[#00B887]' : 'text-[#B7C8C1]'
              }`}
            />
          </div>

          <input
            id="register-fullname"
            type="text"
            autoComplete="name"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter your full name"
            aria-invalid={!!error}
            aria-describedby={error ? 'fullname-error' : undefined}
            className="w-full bg-transparent text-white text-[15px] placeholder-[#B7C8C1]/50 focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <div
          id="fullname-error"
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
