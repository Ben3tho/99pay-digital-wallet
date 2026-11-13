import React from 'react';
import { CreditCard } from 'lucide-react';
import { CardBrand } from '../../utils/cardDetection';

interface CardBrandLogoProps {
  brand: CardBrand;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CardBrandLogo: React.FC<CardBrandLogoProps> = ({
  brand,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: { box: 'h-6 px-1.5 rounded-md', svg: 'h-3.5 w-auto', text: 'text-[10px]' },
    md: { box: 'h-8 px-2.5 rounded-lg', svg: 'h-4.5 w-auto', text: 'text-xs' },
    lg: { box: 'h-10 px-3 rounded-xl', svg: 'h-5.5 w-auto', text: 'text-sm' },
  }[size];

  if (brand === 'Mastercard') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-sm border border-white/15 ${sizeStyles.box} ${className}`}
        aria-label="Mastercard"
        title="Mastercard"
      >
        <svg viewBox="0 0 42 26" className={sizeStyles.svg} role="img" aria-label="Mastercard logo">
          <circle cx="14" cy="13" r="10.5" fill="#EB001B" />
          <circle cx="28" cy="13" r="10.5" fill="#F79E1B" fillOpacity="0.92" />
          <path
            d="M21 4.7a10.48 10.48 0 0 0-3.9 8.3c0 3.3 1.52 6.26 3.9 8.3a10.48 10.48 0 0 0 3.9-8.3c0-3.3-1.52-6.26-3.9-8.3z"
            fill="#FF5F00"
          />
        </svg>
        {size === 'lg' && (
          <span className="font-bold tracking-tight text-white text-[11px]">Mastercard</span>
        )}
      </div>
    );
  }

  if (brand === 'Visa') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gradient-to-br from-[#1A1F71] to-[#0D134D] border border-white/25 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="Visa"
        title="Visa"
      >
        <svg viewBox="0 0 64 20" className={sizeStyles.svg} role="img" aria-label="Visa logo">
          <path
            d="M25.6 1.5L21.9 18.5h-4.4L21.2 1.5h4.4zm18.7 11l2.3-6.3 1.3 6.3h-3.6zm4.9 6h4.1L49.7 1.5h-3.8c-.85 0-1.57.5-1.89 1.26L37.4 18.5h4.62l.92-2.54h5.65l.61 2.54zM37.9 12.9c.02-4.49-6.21-4.74-6.17-6.75.01-.61.6-1.26 1.87-1.42.63-.08 2.38-.15 4.35.76l.78-3.63A11.87 11.87 0 0 0 34.6 1.1c-4.38 0-7.46 2.33-7.49 5.66-.03 2.47 2.2 3.84 3.88 4.66 1.72.84 2.3 1.38 2.29 2.13-.01 1.15-1.38 1.66-2.66 1.68-2.23.03-3.53-.6-4.56-1.08l-.8 3.76c1.04.48 2.96.89 4.95.91 4.66 0 7.7-2.3 7.71-5.92zM19.8 1.5L12.7 18.5H8.04L4.53 4.94c-.21-.84-.4-1.15-1.05-1.5C2.42 2.86.67 2.32-.85 1.99L-.63 1.5h7.42c.95 0 1.8.63 2.01 1.72l1.84 9.77L15.17 1.5h4.63z"
            fill="#FFFFFF"
          />
          <path d="M4.53 4.94L2.95 1.5H-.63l-.22.49C1.85 2.7 3.62 3.9 4.53 4.94z" fill="#F7B600" />
        </svg>
      </div>
    );
  }

  if (brand === 'American Express') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gradient-to-br from-[#006FCF] to-[#004A8F] border border-sky-300/40 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="American Express"
        title="American Express"
      >
        <svg viewBox="0 0 56 22" className={sizeStyles.svg} role="img" aria-label="American Express logo">
          <rect x="0.5" y="0.5" width="55" height="21" rx="3" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" />
          <text
            x="28"
            y="14.5"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="900"
            fontFamily="sans-serif"
            letterSpacing="1.2"
          >
            AMEX
          </text>
        </svg>
      </div>
    );
  }

  if (brand === 'Discover') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gradient-to-br from-[#181A1F] to-[#2B2F38] border border-orange-400/40 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="Discover"
        title="Discover"
      >
        <svg viewBox="0 0 72 20" className={sizeStyles.svg} role="img" aria-label="Discover logo">
          <text x="4" y="14" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">
            DISC
          </text>
          <circle cx="38" cy="10" r="5" fill="#FF6000" />
          <text x="45" y="14" fill="#FFFFFF" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.8">
            VER
          </text>
        </svg>
      </div>
    );
  }

  if (brand === 'UnionPay') {
    return (
      <div
        className={`inline-flex items-center gap-1 bg-black/45 border border-white/20 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="UnionPay"
        title="UnionPay"
      >
        <svg viewBox="0 0 56 22" className={sizeStyles.svg} role="img" aria-label="UnionPay logo">
          <polygon points="4,20 9,2 22,2 17,20" fill="#E21836" />
          <polygon points="18,20 23,2 37,2 32,20" fill="#00447C" />
          <polygon points="33,20 38,2 52,2 47,20" fill="#007B84" />
          <text x="28" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="800" fontFamily="sans-serif">
            UnionPay
          </text>
        </svg>
      </div>
    );
  }

  if (brand === 'Verve') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-gradient-to-br from-[#00425F] to-[#022738] border border-red-400/40 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="Verve"
        title="Verve"
      >
        <svg viewBox="0 0 56 20" className={sizeStyles.svg} role="img" aria-label="Verve logo">
          <circle cx="10" cy="10" r="6" fill="#EE312A" />
          <path d="M7.5 8l2.5 5 2.5-5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="20" y="14" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="sans-serif">
            Verve
          </text>
        </svg>
      </div>
    );
  }

  if (brand === 'Diners Club') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-[#004B87]/90 border border-sky-200/30 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="Diners Club"
        title="Diners Club"
      >
        <svg viewBox="0 0 64 20" className={sizeStyles.svg} role="img" aria-label="Diners Club logo">
          <circle cx="11" cy="10" r="7" fill="#FFFFFF" />
          <rect x="9.5" y="5" width="3" height="10" rx="1" fill="#004B87" />
          <text x="22" y="13.5" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="sans-serif">
            DINERS
          </text>
        </svg>
      </div>
    );
  }

  if (brand === 'JCB') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-black/45 border border-white/20 shadow-sm ${sizeStyles.box} ${className}`}
        aria-label="JCB"
        title="JCB"
      >
        <svg viewBox="0 0 48 22" className={sizeStyles.svg} role="img" aria-label="JCB logo">
          <rect x="2" y="2" width="13" height="18" rx="3" fill="#0B5CAD" />
          <rect x="17.5" y="2" width="13" height="18" rx="3" fill="#D71920" />
          <rect x="33" y="2" width="13" height="18" rx="3" fill="#007B3E" />
          <text x="8.5" y="14.5" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">J</text>
          <text x="24" y="14.5" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">C</text>
          <text x="39.5" y="14.5" textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="900" fontFamily="sans-serif">B</text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 bg-white/10 border border-white/20 text-white ${sizeStyles.box} ${className}`}
      aria-label="Payment Card"
    >
      <CreditCard className="w-4 h-4 text-[#F4C95D]" />
      <span className={`font-bold uppercase tracking-wider ${sizeStyles.text}`}>CARD</span>
    </div>
  );
};
