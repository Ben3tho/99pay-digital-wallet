import React, { useState } from 'react';
import { IdentityDocItem } from '../../data/walletData';
import { IdentityCard } from './IdentityCard';
import { ChevronUp, ChevronDown, Layers, Sparkles, ShieldCheck } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface AnimatedIdentityStackProps {
  identities: IdentityDocItem[];
  lang: Language;
  onViewIdentityDetail: (item: IdentityDocItem) => void;
}

export const AnimatedIdentityStack: React.FC<AnimatedIdentityStackProps> = ({
  identities,
  lang,
  onViewIdentityDetail,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (identities.length === 0) {
    return (
      <div className="p-7 rounded-3xl bg-[#06271D]/40 border border-dashed border-[#24473A] text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#00B887] mx-auto">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <p className="text-xs text-[#B7C8C1]">
          {lang === 'sw'
            ? 'Bado hujaweka kitambulisho cha NIDA au Leseni.'
            : 'No national ID or license added yet.'}
        </p>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(selectedIndex, 0), identities.length - 1);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : identities.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < identities.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Control bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#00B887] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Kitambulisho {safeIndex + 1} ya {identities.length}</span>
          </span>
          <span className="text-[10px] text-[#B7C8C1]/70 truncate max-w-[130px]">
            • {identities[safeIndex].docType}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] text-[10px] font-bold text-[#B7C8C1] hover:text-white transition-colors cursor-pointer mr-1"
          >
            <Layers className="w-3 h-3 text-[#00B887]" />
            <span>{isExpanded ? 'Funga Tabaka' : 'Panua Zote'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Hati Iliyotangulia"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronUp className="w-4 h-4 text-[#00B887]" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Hati Inayofuata"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronDown className="w-4 h-4 text-[#00B887]" />
          </button>
        </div>
      </div>

      {/* 3D Stack / Scroll Container */}
      {!isExpanded ? (
        <div className="relative w-full h-[185px] sm:h-[195px] select-none">
          {identities.map((item, idx) => {
            const offset = idx - safeIndex;
            const isCurrent = idx === safeIndex;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const translateY = offset * 20;
            const scale = 1 - Math.abs(offset) * 0.05;
            const zIndex = 30 - Math.abs(offset) * 5;
            const opacity = 1 - Math.abs(offset) * 0.22;
            const brightness = isCurrent ? 1 : 0.84;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isCurrent) {
                    onViewIdentityDetail(item);
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
                  isCurrent ? 'ring-2 ring-[#00B887]/60 rounded-2xl shadow-xl' : ''
                }`}
              >
                <IdentityCard item={item} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5 animate-in fade-in duration-300">
          {identities.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedIndex(idx);
                onViewIdentityDetail(item);
              }}
              className={`transition-all duration-300 ${
                idx === safeIndex ? 'ring-2 ring-[#00B887] rounded-2xl shadow-lg' : ''
              }`}
            >
              <IdentityCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {identities.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === safeIndex
                ? 'w-6 h-1.5 bg-[#00B887]'
                : 'w-1.5 h-1.5 bg-[#24473A] hover:bg-[#B7C8C1]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
