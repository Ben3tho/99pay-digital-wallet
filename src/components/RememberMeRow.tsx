import React from 'react';
import { Check } from 'lucide-react';

interface RememberMeRowProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  onForgotPasswordClick: () => void;
}

export const RememberMeRow: React.FC<RememberMeRowProps> = ({
  rememberMe,
  onRememberMeChange,
  onForgotPasswordClick,
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-2 select-none">
      {/* Remember Me Checkbox with accessible 44px minimum touch target */}
      <label
        htmlFor="remember-me-checkbox"
        className="min-h-[44px] flex items-center gap-2.5 cursor-pointer group py-1 pr-2 select-none"
      >
        <div className="relative flex items-center">
          <input
            id="remember-me-checkbox"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => onRememberMeChange(e.target.checked)}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              rememberMe
                ? 'bg-[#00B887] border border-[#00B887] shadow-[0_0_8px_rgba(0,184,135,0.3)]'
                : 'bg-[#0B211B] border border-[#24473A] group-hover:border-[#00B887]/50'
            }`}
          >
            {rememberMe && (
              <Check className="w-3.5 h-3.5 text-[#03120E] stroke-[3]" />
            )}
          </div>
        </div>
        <span className="text-[13px] font-normal text-[#B7C8C1] group-hover:text-white transition-colors">
          Remember me
        </span>
      </label>

      {/* Forgot Password Action with comfortable touch target and pressed state */}
      <button
        type="button"
        onClick={onForgotPasswordClick}
        aria-label="Recover forgotten password"
        className="min-h-[44px] flex items-center justify-end text-[13px] font-semibold text-[#F4C95D] hover:text-[#F8D978] active:text-[#E6A92D] active:scale-[0.98] transition-all py-1 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/40 cursor-pointer text-right"
      >
        Forgot password?
      </button>
    </div>
  );
};
