import React from 'react';

interface SignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative w-full h-14 rounded-2xl font-bold text-base text-[#03120E] transition-all duration-150 active:scale-[0.985] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F4C95D]/50 shadow-lg shadow-black/40 overflow-hidden group"
      style={{
        background: 'linear-gradient(90deg, #F8D978 0%, #F4C95D 50%, #E6A92D 100%)',
      }}
    >
      {/* Subtle shine hover effect */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center font-bold tracking-tight text-[16px]">
        Sign In
      </span>
    </button>
  );
};
