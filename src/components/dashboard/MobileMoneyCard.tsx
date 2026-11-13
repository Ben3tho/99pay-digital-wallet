import React, { useState } from 'react';
import { Smartphone, Copy, Check, Hash } from 'lucide-react';
import { MobileMoneyItem } from '../../data/walletData';

interface MobileMoneyCardProps {
  wallet: MobileMoneyItem;
  onClick?: () => void;
}

export const MobileMoneyCard: React.FC<MobileMoneyCardProps> = ({ wallet, onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(wallet.phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Provider emblem colors
  const providerBadgeMap: Record<string, { bg: string; text: string; border: string }> = {
    'Vodacom M-Pesa': {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      border: 'border-red-500/30',
    },
    'Tigo Pesa': {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    'Airtel Money': {
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
    },
    Halopesa: {
      bg: 'bg-orange-500/15',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
    },
  };

  const badge = providerBadgeMap[wallet.provider] || {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="w-full p-4 rounded-2xl bg-[#06271D]/60 hover:bg-[#06271D]/90 active:scale-[0.99] border border-[#24473A] hover:border-[#00B887]/40 transition-all duration-150 cursor-pointer select-none flex flex-col gap-3 group"
    >
      {/* Top Row: Provider badge & USSD helper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#00B887]">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">
                {wallet.provider}
              </span>
              {wallet.isPrimary && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00B887]/15 text-[#00B887] border border-[#00B887]/30">
                  Primary
                </span>
              )}
            </div>
            <span className="text-xs text-[#B7C8C1] block mt-0.5">
              {wallet.accountHolder}
            </span>
          </div>
        </div>

        {/* USSD Helper Badge */}
        <div className="px-2 py-1 rounded-md bg-[#0B211B] border border-[#24473A] flex items-center gap-1 text-[11px] font-mono font-medium text-[#F4C95D]">
          <Hash className="w-3 h-3 text-[#F4C95D]/70" />
          <span>{wallet.ussdCode}</span>
        </div>
      </div>

      {/* Bottom Row: Phone number & Quick Copy */}
      <div className="pt-2 border-t border-[#24473A]/60 flex items-center justify-between">
        <span className="font-mono text-sm font-semibold text-white tracking-wider">
          {wallet.phoneNumber}
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-[#B7C8C1] hover:text-white px-2 py-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00B887]" />
              <span className="text-[#00B887] text-[11px] font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy Number</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
