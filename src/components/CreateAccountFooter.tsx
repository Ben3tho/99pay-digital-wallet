import React from 'react';

interface CreateAccountFooterProps {
  onCreateAccountClick: () => void;
}

export const CreateAccountFooter: React.FC<CreateAccountFooterProps> = ({
  onCreateAccountClick,
}) => {
  return (
    <div className="w-full flex items-center justify-center flex-wrap gap-1 text-[13.5px] py-1 select-none">
      <span className="text-[#B7C8C1]">Don&apos;t have an account?</span>
      <button
        type="button"
        onClick={onCreateAccountClick}
        aria-label="Create a new 99Pay account"
        className="min-h-[44px] inline-flex items-center justify-center font-bold text-[#F4C95D] hover:text-[#F8D978] active:text-[#E6A92D] active:scale-[0.98] transition-all px-2 py-1 rounded-md cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#F4C95D]/50"
      >
        Create Account
      </button>
    </div>
  );
};
