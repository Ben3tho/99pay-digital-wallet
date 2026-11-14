import React, { useState } from 'react';
import { LipaMerchantItem } from '../../data/walletData';
import { LipaNambaCard } from './LipaNambaCard';
import { ChevronUp, ChevronDown, Layers, Store } from 'lucide-react';
import { Language } from '../../i18n/translations';

interface AnimatedLipaStackProps {
  merchants: LipaMerchantItem[];
  lang: Language;
  onOpenQr: (item: LipaMerchantItem) => void;
  onCopy: (text: string, label: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditMerchant?: (item: LipaMerchantItem) => void;
  onDeleteMerchant?: (id: string) => void;
  onOpenAddLipaModal: () => void;
}

export const AnimatedLipaStack: React.FC<AnimatedLipaStackProps> = ({
  merchants,
  lang,
  onOpenQr,
  onCopy,
  onToggleFavorite,
  onEditMerchant,
  onDeleteMerchant,
  onOpenAddLipaModal,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (merchants.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-[#06271D]/40 border border-dashed border-[#24473A] text-center space-y-2">
        <Store className="w-8 h-8 text-[#B7C8C1]/40 mx-auto" />
        <p className="text-xs text-[#B7C8C1]">
          {lang === 'sw'
            ? 'Bado hujaongeza Lipa Namba au Till yoyote.'
            : 'No Lipa Namba or Till saved yet.'}
        </p>
        <button
          type="button"
          onClick={onOpenAddLipaModal}
          className="text-xs text-[#00B887] hover:text-[#F4C95D] font-bold inline-block cursor-pointer"
        >
          {lang === 'sw' ? '+ Sajili Lipa Namba Hapa' : '+ Add New Merchant Till'}
        </button>
      </div>
    );
  }

  const safeIndex = Math.min(Math.max(selectedIndex, 0), merchants.length - 1);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : merchants.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < merchants.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="w-full space-y-2.5">
      {/* Control bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
            <Store className="w-3.5 h-3.5" />
            <span>Till {safeIndex + 1} ya {merchants.length}</span>
          </span>
          <span className="text-[10px] text-[#B7C8C1]/70 truncate max-w-[130px]">
            • {merchants[safeIndex].merchantName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* View Mode Toggle */}
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
            aria-label="Till Iliyotangulia"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-orange-400 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronUp className="w-4 h-4 text-orange-400" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Till Inayofuata"
            className="w-7 h-7 rounded-lg bg-[#0B211B] hover:bg-[#06271D] border border-[#24473A] hover:border-orange-400 text-white flex items-center justify-center cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronDown className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      </div>

      {/* 3D Stack / Scroll Container */}
      {!isExpanded ? (
        <div className="relative w-full h-[225px] sm:h-[235px] select-none">
          {merchants.map((merchant, idx) => {
            const offset = idx - safeIndex;
            const isCurrent = idx === safeIndex;
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            const translateY = offset * 22;
            const scale = 1 - Math.abs(offset) * 0.05;
            const zIndex = 30 - Math.abs(offset) * 5;
            const opacity = 1 - Math.abs(offset) * 0.22;
            const brightness = isCurrent ? 1 : 0.84;

            return (
              <div
                key={merchant.id}
                onClick={() => {
                  if (!isCurrent) setSelectedIndex(idx);
                }}
                style={{
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: `brightness(${brightness})`,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className={`absolute inset-x-0 top-0 cursor-pointer ${
                  isCurrent ? 'ring-2 ring-orange-400/60 rounded-2xl shadow-xl' : ''
                }`}
              >
                <LipaNambaCard
                  item={merchant}
                  lang={lang}
                  onOpenQr={onOpenQr}
                  onCopy={onCopy}
                  onToggleFavorite={onToggleFavorite}
                  onEdit={onEditMerchant}
                  onDelete={onDeleteMerchant}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5 animate-in fade-in duration-300">
          {merchants.map((merchant, idx) => (
            <div
              key={merchant.id}
              onClick={() => setSelectedIndex(idx)}
              className={`transition-all duration-300 ${
                idx === safeIndex ? 'ring-2 ring-orange-400 rounded-2xl shadow-lg' : ''
              }`}
            >
              <LipaNambaCard
                item={merchant}
                lang={lang}
                onOpenQr={onOpenQr}
                onCopy={onCopy}
                onToggleFavorite={onToggleFavorite}
                onEdit={onEditMerchant}
                onDelete={onDeleteMerchant}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {merchants.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              idx === safeIndex
                ? 'w-6 h-1.5 bg-orange-400'
                : 'w-1.5 h-1.5 bg-[#24473A] hover:bg-[#B7C8C1]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
