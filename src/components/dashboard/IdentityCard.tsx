import React, { useState } from 'react';
import { Copy, Check, ShieldCheck } from 'lucide-react';
import { IdentityDocItem } from '../../data/walletData';
import { getExpiryStatus } from '../../utils/expiryAlerts';
import { isEncryptedEnvelope } from '../../utils/vaultSecurity';

interface IdentityCardProps {
  item: IdentityDocItem;
  onClick?: () => void;
}

export const IdentityCard: React.FC<IdentityCardProps> = ({ item, onClick }) => {
  const [copied, setCopied] = useState(false);

  const isEncrypted = isEncryptedEnvelope(item.documentNumber);
  const displayNumber = isEncrypted ? '•••• •••• •••• (PIN Locked)' : item.documentNumber;
  const expiryInfo = getExpiryStatus(item.expiryDate, 45);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEncrypted) return;
    navigator.clipboard.writeText(item.documentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isNida = item.docType === 'NIDA National ID';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="w-full p-4.5 rounded-3xl bg-gradient-to-br from-[#06271D] via-[#0B211B] to-[#041712] border border-[#00B887]/40 shadow-xl transition-all duration-200 cursor-pointer select-none active:scale-[0.99] group overflow-hidden relative"
    >
      {/* Tanzanian National Flag Stripe Accent */}
      <div className="absolute top-0 inset-x-0 h-1.5 flex">
        <div className="flex-1 bg-[#1EB53A]" />
        <div className="w-4 bg-[#FCD116]" />
        <div className="flex-1 bg-[#00A3E0]" />
      </div>

      {/* National Emblem Watermark Effect */}
      <div className="absolute -right-4 -bottom-4 w-36 h-36 rounded-full border border-white/[0.04] flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 rounded-full border border-white/[0.03]" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 pt-1 border-b border-[#24473A]/60">
        <div className="flex items-center gap-2.5">
          {/* Government Coat of Arms Style Monogram */}
          <div className="w-9 h-9 rounded-xl bg-[#03120E] border border-[#00B887]/50 flex items-center justify-center text-[#F4C95D] font-black text-xs shadow-inner">
            {isNida ? 'NIDA' : 'TZ'}
          </div>
          <div>
            <span className="font-extrabold text-sm text-white block leading-tight">
              {item.docType}
            </span>
            <span className="text-[10px] text-[#00B887] font-semibold">
              Jamhuri ya Muungano wa Tanzania
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {expiryInfo && expiryInfo.status !== 'valid' && (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                expiryInfo.status === 'expired'
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}
            >
              {expiryInfo.status === 'expired' ? 'Imeisha' : 'Inaisha'}
            </span>
          )}
          <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00B887]/15 border border-[#00B887]/40 text-[#00B887] text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Smart ID</span>
          </div>
        </div>
      </div>

      {/* Identity Number Section (Formatted & High Legibility) */}
      <div className="py-2.5">
        <span className="text-[9px] font-bold text-[#B7C8C1] uppercase tracking-wider block">
          {isNida ? 'Namba ya Utambulisho wa Taifa (NIN)' : 'Namba ya Leseni / Hati'}
        </span>
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-mono text-base font-black text-[#F4C95D] tracking-wider drop-shadow-sm truncate pr-2">
            {displayNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={isEncrypted}
            className="p-1.5 text-[#B7C8C1] hover:text-white rounded-lg bg-[#0B211B] border border-[#24473A] transition-colors cursor-pointer active:scale-95 disabled:opacity-40"
            title="Nakili namba ya kitambulisho"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#00B887]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Details Row: Legal Name & Issue Authority */}
      <div className="pt-2 border-t border-[#24473A]/60 flex items-center justify-between text-xs">
        <div>
          <span className="text-[9px] text-[#B7C8C1] block font-semibold uppercase">Jina Kamili</span>
          <span className="font-bold text-white truncate max-w-[190px] block font-mono text-xs">
            {item.fullName}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-[#B7C8C1] block font-semibold uppercase">
            {item.expiryDate ? 'Inaisha' : 'Mamlaka'}
          </span>
          <span
            className={`font-mono font-medium text-xs ${
              expiryInfo?.status === 'expired'
                ? 'text-rose-300'
                : expiryInfo?.status === 'expiring_soon'
                ? 'text-amber-300'
                : 'text-white/90'
            }`}
          >
            {item.expiryDate || item.issuingAuthority}
          </span>
        </div>
      </div>
    </div>
  );
};
