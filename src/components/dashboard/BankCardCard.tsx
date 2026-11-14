import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { BankCardItem } from '../../data/walletData';
import { CardBrandLogo } from './CardBrandLogo';
import { getExpiryStatus } from '../../utils/expiryAlerts';
import { isEncryptedEnvelope } from '../../utils/vaultSecurity';

interface BankCardCardProps {
  card: BankCardItem;
  onClick?: () => void;
  onRequestReveal?: (card: BankCardItem) => void;
  onHideNumber?: (cardId: string) => void;
  isRevealed?: boolean;
  secondsRemaining?: number;
}

export const BankCardCard: React.FC<BankCardCardProps> = ({
  card,
  onClick,
  onRequestReveal,
  onHideNumber,
  isRevealed = false,
  secondsRemaining = 10,
}) => {
  const [copied, setCopied] = useState(false);

  // Realistic bank visual themes
  const bankThemeMap: Record<
    string,
    { bg: string; border: string; accentColor: string; logoText: string }
  > = {
    'CRDB Bank': {
      bg: 'linear-gradient(135deg, #023618 0%, #06271D 45%, #0A4D27 100%)',
      border: 'border-[#00B887]/60 shadow-[0_16px_36px_-10px_rgba(0,184,135,0.35)]',
      accentColor: '#00B887',
      logoText: 'CRDB',
    },
    'NMB Bank': {
      bg: 'linear-gradient(135deg, #3A2304 0%, #1A1202 50%, #4D3305 100%)',
      border: 'border-[#F4C95D]/60 shadow-[0_16px_36px_-10px_rgba(244,201,93,0.3)]',
      accentColor: '#F4C95D',
      logoText: 'NMB',
    },
    Stanbic: {
      bg: 'linear-gradient(135deg, #051A3A 0%, #020C1C 50%, #0A2E63 100%)',
      border: 'border-blue-500/50 shadow-[0_16px_36px_-10px_rgba(59,130,246,0.3)]',
      accentColor: '#60A5FA',
      logoText: 'STANBIC',
    },
    NBC: {
      bg: 'linear-gradient(135deg, #3A0808 0%, #1F0303 50%, #520D0D 100%)',
      border: 'border-rose-500/50 shadow-[0_16px_36px_-10px_rgba(244,63,94,0.3)]',
      accentColor: '#FB7185',
      logoText: 'NBC',
    },
    'Standard Chartered': {
      bg: 'linear-gradient(135deg, #032729 0%, #021415 50%, #063C3F 100%)',
      border: 'border-teal-500/50 shadow-[0_16px_36px_-10px_rgba(20,184,166,0.3)]',
      accentColor: '#2DD4BF',
      logoText: 'SCB',
    },
    'Equity Bank': {
      bg: 'linear-gradient(135deg, #381808 0%, #1E0B03 50%, #58280D 100%)',
      border: 'border-amber-500/50 shadow-[0_16px_36px_-10px_rgba(217,119,6,0.3)]',
      accentColor: '#FBBF24',
      logoText: 'EQUITY',
    },
    'Absa Bank': {
      bg: 'linear-gradient(135deg, #3D0716 0%, #1F030B 50%, #610C24 100%)',
      border: 'border-pink-500/50 shadow-[0_16px_36px_-10px_rgba(236,72,153,0.3)]',
      accentColor: '#F472B6',
      logoText: 'ABSA',
    },
    'DTB Tanzania': {
      bg: 'linear-gradient(135deg, #0D1B3E 0%, #070E22 50%, #18306B 100%)',
      border: 'border-indigo-400/50 shadow-[0_16px_36px_-10px_rgba(99,102,241,0.3)]',
      accentColor: '#818CF8',
      logoText: 'DTB',
    },
    'Exim Bank': {
      bg: 'linear-gradient(135deg, #06283D 0%, #031521 50%, #0C4061 100%)',
      border: 'border-cyan-400/50 shadow-[0_16px_36px_-10px_rgba(34,211,238,0.3)]',
      accentColor: '#22D3EE',
      logoText: 'EXIM',
    },
    'KCB Bank': {
      bg: 'linear-gradient(135deg, #07331D 0%, #031A0E 50%, #0E5431 100%)',
      border: 'border-emerald-400/50 shadow-[0_16px_36px_-10px_rgba(16,185,129,0.3)]',
      accentColor: '#34D399',
      logoText: 'KCB',
    },
    'Other Bank': {
      bg: 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #334155 100%)',
      border: 'border-slate-400/40 shadow-[0_16px_36px_-10px_rgba(148,163,184,0.25)]',
      accentColor: '#CBD5E1',
      logoText: 'BANK',
    },
  };

  const theme = bankThemeMap[card.bankName] || bankThemeMap['CRDB Bank'];
  const displayBankName =
    card.bankName === 'Other Bank' && card.customBankName?.trim()
      ? card.customBankName.trim()
      : card.bankName;

  const customMonogram =
    card.bankName === 'Other Bank' && card.customBankName?.trim()
      ? card.customBankName
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 4)
          .toUpperCase()
      : theme.logoText;

  const expiryInfo = getExpiryStatus(card.expiryDate, 45);
  const canShowFull = isRevealed && Boolean(card.fullNumber) && !isEncryptedEnvelope(card.fullNumber);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = canShowFull && card.fullNumber ? card.fullNumber : card.maskedNumber;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRevealed) {
      if (onHideNumber) onHideNumber(card.id);
    } else {
      if (onRequestReveal) onRequestReveal(card);
    }
  };

  return (
    <div
      onClick={onClick}
      data-card-brand={card.cardType}
      className={`relative w-full h-52 sm:h-56 rounded-3xl p-5 sm:p-6 text-white border transition-all duration-200 cursor-pointer select-none group active:scale-[0.985] flex flex-col justify-between overflow-hidden ${theme.border}`}
      style={{ background: theme.bg }}
    >
      {/* Metallic Holographic Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/[0.03] pointer-events-none blur-2xl" />

      {/* Subtle Security Radial Accent */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 70% 30%, ${theme.accentColor} 0%, transparent 60%)`,
        }}
      />

      {/* Top Row: Bank Monogram + Network Brand Logo */}
      <div className="flex items-center justify-between z-10 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[11px] tracking-tighter shadow-md border shrink-0"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: `${theme.accentColor}55`,
              color: theme.accentColor,
            }}
          >
            {customMonogram}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
                {displayBankName}
              </span>
              {card.isDefault && (
                <span className="px-1.5 py-0.5 rounded bg-[#F4C95D]/20 border border-[#F4C95D]/40 text-[9px] font-bold text-[#F4C95D] uppercase shrink-0">
                  Kuu
                </span>
              )}
            </div>
            <span
              className="text-[10px] font-bold tracking-wider uppercase block truncate"
              style={{ color: theme.accentColor }}
            >
              {card.tier}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Wifi className="w-4 h-4 text-white/80 rotate-90" />
          <CardBrandLogo brand={card.cardType} size="md" />
        </div>
      </div>

      {/* Middle Row: Gold Metallic EMV Chip + Reveal & Copy Actions */}
      <div className="my-auto pt-2 z-10">
        <div className="flex items-center justify-between mb-2">
          {/* 3D Gold Metallic Smart Chip */}
          <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#92400E] p-[1.5px] shadow-md">
            <div className="w-full h-full rounded-[6px] bg-[#221603] flex items-center justify-center border border-[#FDE68A]/70 relative overflow-hidden">
              <div className="w-full h-[1px] bg-[#FDE68A]/60 absolute top-2" />
              <div className="w-full h-[1px] bg-[#FDE68A]/60 absolute bottom-2" />
              <div className="h-full w-[1px] bg-[#FDE68A]/60 absolute" />
              <div className="w-3 h-3 rounded-full border border-[#FDE68A]/40 absolute" />
            </div>
          </div>

          {/* Reveal & Copy Security Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleReveal}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors border cursor-pointer active:scale-95 ${
                isRevealed
                  ? 'bg-[#00B887]/25 border-[#00B887] text-[#00B887]'
                  : 'bg-black/30 hover:bg-black/50 border-white/20 text-[#B7C8C1] hover:text-white'
              }`}
              title={isRevealed ? 'Ficha namba sasa' : 'Onyesha namba kamili (Inahitaji PIN)'}
            >
              {isRevealed ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{secondsRemaining}s</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Onyesha</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-medium text-[#B7C8C1] hover:text-white px-2 py-1 rounded-lg bg-black/30 hover:bg-black/50 border border-white/15 transition-colors cursor-pointer active:scale-95"
              title="Nakili namba ya kadi"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00B887]" />
                  <span className="text-[#00B887]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Embossed Card Number Display */}
        <div className="font-mono text-base sm:text-lg font-bold tracking-[0.18em] text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
          <span className="truncate">
            {canShowFull && card.fullNumber ? card.fullNumber : card.maskedNumber}
          </span>
          {canShowFull && (
            <span className="text-[10px] font-bold tracking-normal text-[#00B887] bg-[#00B887]/20 px-2 py-0.5 rounded-md border border-[#00B887]/50 shrink-0">
              PIN Verified
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Cardholder Name, Brand Text & Expiration */}
      <div className="flex items-end justify-between text-xs z-10 pt-2 border-t border-white/15 gap-2">
        <div className="min-w-0">
          <span className="text-[9px] text-[#B7C8C1] uppercase tracking-wider block font-semibold">
            Mwenye Kadi / Cardholder
          </span>
          <span className="font-semibold text-white tracking-wider truncate max-w-[185px] block font-mono text-xs">
            {card.cardholderName}
          </span>
        </div>

        <div className="text-right shrink-0 flex items-end gap-3">
          <div>
            <span className="text-[9px] text-[#B7C8C1] uppercase tracking-wider block font-semibold">
              Mtandao
            </span>
            <span className="font-bold text-white/90 text-[11px] block">
              {card.cardType}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-[#B7C8C1] uppercase tracking-wider block font-semibold">
              Expires
            </span>
            <div className="flex items-center justify-end gap-1">
              <span
                className={`font-mono font-bold tracking-widest text-xs ${
                  expiryInfo?.status === 'expired'
                    ? 'text-rose-300'
                    : expiryInfo?.status === 'expiring_soon'
                    ? 'text-amber-300'
                    : 'text-white'
                }`}
              >
                {card.expiryDate}
              </span>
              {expiryInfo && expiryInfo.status !== 'valid' && (
                <span
                  className={`text-[8px] font-extrabold uppercase px-1 py-0.5 rounded ${
                    expiryInfo.status === 'expired'
                      ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                  }`}
                >
                  {expiryInfo.status === 'expired' ? 'EXP' : 'SOON'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
