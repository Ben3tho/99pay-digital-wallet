import React from 'react';

interface RegisterFooterProps {
  onSignInClick: () => void;
}

export const RegisterFooter: React.FC<RegisterFooterProps> = ({ onSignInClick }) => {
  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-1 text-[13.5px] py-1 select-none">
      <span className="text-[#B7C8C1]">Already have an account?</span>
      <button
        type="button"
        onClick={onSignInClick}
        aria-label="Return to Sign In"
        className="min-h-[44px] inline-flex items-center justify-center font-bold text-[#F4C95D] hover:text-[#F8D978] active:text-[#E6A92D] active:scale-[0.98] transition-all px-2 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/50"
      >
        Sign In
      </button>
    </div>
  );
};
