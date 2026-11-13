import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

interface TermsCheckboxRowProps {
  agreed: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onOpenTerms: () => void;
  error?: string | null;
}

export const TermsCheckboxRow: React.FC<TermsCheckboxRowProps> = ({
  agreed,
  onAgreedChange,
  onOpenTerms,
  error,
}) => {
  return (
    <div className="w-full flex flex-col gap-1 select-none">
      <div className="flex items-start gap-2.5 py-1">
        {/* Custom Emerald Checkbox with 44px tap hitbox */}
        <label
          htmlFor="register-terms-checkbox"
          className="min-h-[44px] min-w-[28px] flex items-center cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center">
            <input
              id="register-terms-checkbox"
              type="checkbox"
              checked={agreed}
              onChange={(e) => onAgreedChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                agreed
                  ? 'bg-[#00B887] border border-[#00B887] shadow-[0_0_8px_rgba(0,184,135,0.3)]'
                  : error
                  ? 'bg-[#0B211B] border border-[#FF6B6B]'
                  : 'bg-[#0B211B] border border-[#24473A] group-hover:border-[#00B887]/50'
              }`}
            >
              {agreed && (
                <Check className="w-3.5 h-3.5 text-[#03120E] stroke-[3]" />
              )}
            </div>
          </div>
        </label>

        {/* Text with Visually Distinguishable Terms & Privacy Links */}
        <div className="text-[12.5px] leading-snug text-[#B7C8C1] pt-2.5">
          <span>I agree to the </span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="font-semibold text-[#F4C95D] hover:text-[#F8D978] underline underline-offset-2 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/40 rounded px-0.5"
          >
            Terms &amp; Conditions
          </button>
          <span> and </span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="font-semibold text-[#F4C95D] hover:text-[#F8D978] underline underline-offset-2 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/40 rounded px-0.5"
          >
            Privacy Policy
          </button>
          <span>.</span>
        </div>
      </div>

      {error && (
        <div
          id="terms-error"
          className="flex items-center gap-1.5 text-xs text-[#FF6B6B] px-2 -mt-1"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
