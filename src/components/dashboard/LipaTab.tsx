import React, { useState } from 'react';
import { Store, Search, Plus, X } from 'lucide-react';
import { LipaMerchantItem } from '../../data/walletData';
import { AnimatedLipaStack } from './AnimatedLipaStack';
import { Language } from '../../i18n/translations';

interface LipaTabProps {
  merchants: LipaMerchantItem[];
  lang: Language;
  onOpenAddLipaModal: () => void;
  onOpenQr: (item: LipaMerchantItem) => void;
  onCopy: (text: string, label: string) => void;
  onToggleFavorite: (id: string) => void;
  onEditMerchant?: (item: LipaMerchantItem) => void;
  onDeleteMerchant: (id: string) => void;
}

export const LipaTab: React.FC<LipaTabProps> = ({
  merchants,
  lang,
  onOpenAddLipaModal,
  onOpenQr,
  onCopy,
  onToggleFavorite,
  onEditMerchant,
  onDeleteMerchant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: lang === 'sw' ? 'Zote' : 'All' },
    { id: 'favorites', label: lang === 'sw' ? 'Vipendwa' : 'Favorites' },
    { id: 'Mafuta', label: lang === 'sw' ? 'Mafuta' : 'Fuel' },
    { id: 'Supermarket', label: 'Supermarket' },
    { id: 'Dawa & Afya', label: lang === 'sw' ? 'Dawa & Afya' : 'Pharmacy' },
    { id: 'Kodi & LUKU', label: lang === 'sw' ? 'Bili & LUKU' : 'Bills & LUKU' },
    { id: 'Mgahawa', label: lang === 'sw' ? 'Migahawa' : 'Dining' },
  ];

  const query = searchQuery.toLowerCase().trim();

  const filteredMerchants = merchants.filter((m) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      m.category === selectedCategory ||
      (selectedCategory === 'favorites' && m.favorite);

    const matchesSearch =
      !query ||
      m.merchantName.toLowerCase().includes(query) ||
      m.number.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query) ||
      (m.branchOrNotes?.toLowerCase().includes(query) ?? false);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col space-y-3.5 pb-6">
      {/* Lipa Directory Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06271D] to-[#0B211B] border border-[#24473A] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {lang === 'sw' ? 'Lipa Namba & Tills' : 'Merchant Pay & Tills'}
            </h2>
            <p className="text-xs text-[#B7C8C1]">
              {lang === 'sw' ? 'Piga USSD ya papo hapo au Scan QR' : 'Instant 1-tap USSD & QR pay'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAddLipaModal}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-[#F8D978] via-[#F4C95D] to-[#E6A92D] text-[#03120E] font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{lang === 'sw' ? 'Sajili Till' : 'Add Till'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#B7C8C1]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            lang === 'sw'
              ? 'Tafuta jina la duka, till, au namba...'
              : 'Search merchant, till number...'
          }
          className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#0B211B] border border-[#24473A] text-xs text-white placeholder-[#B7C8C1]/60 focus:outline-none focus:border-[#00B887] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B7C8C1] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Chips (Matched to LipaMerchantItem['category']) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                  : 'bg-[#06271D] text-[#B7C8C1] border border-[#24473A] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Merchant Count & Animated Stack */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-[#B7C8C1] uppercase tracking-wider">
            {lang === 'sw' ? 'Tills Zilizohifadhiwa' : 'Saved Tills'} ({filteredMerchants.length})
          </span>
          <span className="text-[10px] text-[#00B887]">USSD Ready</span>
        </div>

        <AnimatedLipaStack
          merchants={filteredMerchants}
          lang={lang}
          onOpenQr={onOpenQr}
          onCopy={onCopy}
          onToggleFavorite={onToggleFavorite}
          onEditMerchant={onEditMerchant}
          onDeleteMerchant={onDeleteMerchant}
          onOpenAddLipaModal={onOpenAddLipaModal}
        />
      </div>
    </div>
  );
};
