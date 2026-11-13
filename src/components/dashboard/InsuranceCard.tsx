import React, { useState } from 'react';
import { HeartPulse, Copy, Check, ShieldCheck } from 'lucide-react';
import { InsuranceDocItem } from '../../data/walletData';

interface InsuranceCardProps {
  item: InsuranceDocItem;
  onClick?: () => void;
}

export const InsuranceCard: React.FC<InsuranceCardProps> = ({ item, onClick }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.membershipNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="w-full p-4.5 rounded-2xl bg-gradient-to-br from-[#06271D] via-[#0B211B] to-[#041712] border border-[#24473A] hover:border-[#00B887]/40 transition-all duration-150 cursor-pointer select-none active:scale-[0.99] group overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#24473A]/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00B887]/15 border border-[#00B887]/30 flex items-center justify-center text-[#00B887]">
            <HeartPulse className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {item.provider}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00B887]/15 text-[#00B887] border border-[#00B887]/30">
                {item.status}
              </span>
            </div>
            <span className="text-[11px] text-[#B7C8C1]">
              {item.schemeName}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 text-[#B7C8C1] hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer"
          title="Copy membership number"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#00B887]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Number */}
      <div className="py-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-medium text-[#B7C8C1] uppercase tracking-wider block">
            Membership Number
          </span>
          <span className="font-mono text-base font-bold text-[#F4C95D] tracking-wider block mt-0.5">
            {item.membershipNumber}
          </span>
        </div>
      </div>

      {/* Beneficiary */}
      <div className="pt-2 border-t border-[#24473A]/60 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-[#B7C8C1] block">Principal Member</span>
          <span className="font-semibold text-white truncate max-w-[200px] block">
            {item.beneficiaryName}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#00B887]">
          <ShieldCheck className="w-3 h-3" />
          <span>Active Cover</span>
        </div>
      </div>
    </div>
  );
};
