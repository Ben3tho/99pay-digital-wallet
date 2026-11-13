import React from 'react';
import { Fingerprint } from 'lucide-react';

interface BiometricSignInOptionProps {
  onClick: () => void;
}

export const BiometricSignInOption: React.FC<BiometricSignInOptionProps> = ({
  onClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Subtle Divider with "OR" */}
      <div className="w-full flex items-center justify-center py-0.5">
        <div className="h-[1px] flex-1 bg-[#24473A]/60" />
        <span className="px-3.5 text-xs font-medium text-[#B7C8C1]/60 tracking-wider">
          OR
        </span>
        <div className="h-[1px] flex-1 bg-[#24473A]/60" />
      </div>

      {/* Biometric Card Option with comfortable touch target and visible press state */}
      <button
        type="button"
        onClick={onClick}
        aria-label="Sign in using device biometrics or fingerprint"
        className="w-full mt-3 p-3 sm:p-3.5 rounded-2xl bg-[#06271D]/40 hover:bg-[#06271D]/70 active:bg-[#06271D]/90 border border-[#24473A] hover:border-[#00B887]/40 active:border-[#00B887]/60 transition-all duration-150 active:scale-[0.985] flex items-center text-left gap-3.5 group cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00B887]/50"
      >
        {/* Elegant Emerald Circular Container for Fingerprint Icon */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full bg-[#06271D] border border-[#00B887]/30 flex items-center justify-center group-hover:border-[#00B887]/60 group-active:border-[#00B887] group-hover:shadow-[0_0_12px_rgba(0,184,135,0.2)] transition-all">
          <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6 text-[#00B887] group-hover:scale-105 transition-transform" />
        </div>

        {/* Text Details */}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-semibold text-white tracking-tight">
            Sign in with Biometrics
          </span>
          <span className="text-xs text-[#B7C8C1] truncate mt-0.5">
            Use your fingerprint or device biometrics.
          </span>
        </div>
      </button>
    </div>
  );
};
