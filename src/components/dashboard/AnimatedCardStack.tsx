import React, { useState } from 'react';
import { BankCardItem } from '../../data/walletData';
import { BankCardCard } from './BankCardCard';
import { ChevronUp, ChevronDown, Layers, CreditCard } from 'lucide-react';

interface AnimatedCardStackProps {
  cards: BankCardItem[];
  revealedCardId: string | null;
  revealedSecondsRemaining: number;
  onRequestReveal: (card: BankCardItem) => void;
  onHideNumber: () => void;
  onSelectCardDetail: (card: BankCardItem) => void;
}

export const AnimatedCardStack: React.FC<AnimatedCardStackProps> = ({
  cards,
  revealedCardId,
  revealedSecondsRemaining,
  onRequestReveal,
  onHideNumber,
  onSelectCardDetail,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#06271D]/40 border border-dashed border-[#24473A] text-center space-y-2.5">
        <div className="w-12 h-12 rounded-2xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#F4C95D] mx-auto">
          <Layers className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Bado Hujaweka Kadi</h4>
          <p className="text-xs text-[#B7C8C1] mt-0.5">
            Gusa kitufe cha duara cha (+) kilicho chini kulia ili kusajili kadi yako ya benki au pochi ya simu.
          </p>
        </div>
      </div>
    );
  }

  // Safe clamp index
  const safeIndex = Math.min(Math.max(selectedIndex, 0), cards.length - 1);
  const activeCard = cards[safeIndex];
  const activeBankLabel =
    activeCard.bankName === 'Other Bank' && activeCard.customBankName?.trim()
      ? activeCard.customBankName
      : activeCard.bankName;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Interactive Controls Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-bold text-[#F4C95D] flex items-center gap-1.5 shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-[#F4C95D]" />
            <span>Kadi {safeIndex + 1} ya {cards.length}</span>
          </span>
          <span className="text-[10px] text-[#B7C8C1]/80 truncate">
            • {activeBankLabel} ({activeCard.cardType})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Toggle Stack / Expanded Mode */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] text-[10px] font-bold text-[#B7C8C1] hover:text-white transition-colors cursor-pointer mr-1"
          >
            <Layers className="w-3 h-3 text-[#00B887]" />
            <span>{isExpanded ? 'Funga Tabaka' : 'Panua Zote'}</span>
          </button>

          {/* Up & Down Scroll Animation Buttons */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Kadi Iliyotangulia"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronUp className="w-4 h-4 text-[#F4C95D]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Kadi Inayofuata"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronDown className="w-4 h-4 text-[#F4C95D]" />
          </button>
        </div>
      </div>

      {/* 3D Stack / Scroll Container */}
      {!isExpanded ? (
        <div className="relative w-full h-[230px] sm:h-[245px] select-none">
          {cards.map((card, idx) => {
            const offset = idx - safeIndex;
            const isCurrent = idx === safeIndex;
            // Cards behind or ahead
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            // Compute 3D stacked transform
            // Positive offset: cards behind or peeking below
            const translateY = offset * 22;
            const scale = 1 - Math.abs(offset) * 0.05;
            const zIndex = 30 - Math.abs(offset) * 5;
            const opacity = 1 - Math.abs(offset) * 0.22;
            const brightness = isCurrent ? 1 : 0.82;

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isCurrent) {
                    onSelectCardDetail(card);
                  } else {
                    setSelectedIndex(idx);
                  }
                }}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `brightness(${brightness})`,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`absolute inset-x-0 top-0 cursor-pointer ${
                  isCurrent ? 'ring-2 ring-[#00B887]/60 rounded-3xl shadow-2xl' : ''
                }`}
              >
                <BankCardCard
                  card={card}
                  isRevealed={revealedCardId === card.id}
                  secondsRemaining={revealedSecondsRemaining}
                  onRequestReveal={onRequestReveal}
                  onHideNumber={onHideNumber}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Expanded full view with smooth animation */
        <div className="space-y-3.5 animate-in fade-in duration-300">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              onClick={() => {
                setSelectedIndex(idx);
                onSelectCardDetail(card);
              }}
              className={`transition-all duration-300 ${
                idx === safeIndex ? 'ring-2 ring-[#F4C95D] rounded-3xl shadow-lg' : ''
              }`}
            >
              <BankCardCard
                card={card}
                isRevealed={revealedCardId === card.id}
                secondsRemaining={revealedSecondsRemaining}
                onRequestReveal={onRequestReveal}
                onHideNumber={onHideNumber}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination indicators (Dots) */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {cards.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === safeIndex
                ? 'w-6 h-1.5 bg-[#F4C95D]'
                : 'w-1.5 h-1.5 bg-[#24473A] hover:bg-[#B7C8C1]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
