import React from 'react';

interface NineNinePayLogoProps {
  className?: string;
  showTagline?: boolean;
}

export const NineNinePayLogo: React.FC<NineNinePayLogoProps> = ({
  className = '',
  showTagline = true,
}) => {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Brand Mark and Wordmark */}
      <div className="flex items-center gap-3">
        {/* Emblem: Stylized 99 with Gold & Emerald Dual Accent */}
        <div className="relative group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06271D] via-[#0B211B] to-[#03120E] p-[1.5px] shadow-lg shadow-emerald-950/40">
            <div className="w-full h-full rounded-[14px] bg-[#06271D]/90 flex items-center justify-center border border-[#00B887]/30 relative overflow-hidden">
              {/* Subtle light reflection on emblem */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#F4C95D]/10 to-transparent opacity-80" />

              {/* Number 99 with luxury gold and emerald treatment */}
              <span
                className="text-2xl font-black tracking-tighter bg-gradient-to-b from-[#F8D978] to-[#E6A92D] bg-clip-text text-transparent relative z-10"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                99
              </span>
            </div>
          </div>
        </div>

        {/* Brand Name: 99Pay */}
        <div className="flex items-baseline">
          <span
            className="text-3xl font-extrabold tracking-tight text-[#00B887]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            99
          </span>
          <span
            className="text-3xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pay
          </span>
        </div>
      </div>

      {/* Brand Positioning & Supporting Message */}
      {showTagline && (
        <div className="mt-2 flex flex-col items-center">
          <span className="text-xs font-semibold tracking-wide text-[#B7C8C1]">
            One App. All Your Cards.
          </span>
          <span className="text-[11px] font-normal text-[#B7C8C1]/70 mt-0.5">
            Your Digital Wallet
          </span>
        </div>
      )}
    </div>
  );
};
