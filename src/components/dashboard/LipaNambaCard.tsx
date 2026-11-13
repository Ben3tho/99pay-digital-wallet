import React, { useState } from 'react';
import {
  Store,
  PhoneCall,
  QrCode,
  Copy,
  Check,
  Fuel,
  ShoppingCart,
  Pill,
  Zap,
  UtensilsCrossed,
  Tag,
  Star,
  ExternalLink,
} from 'lucide-react';
import { LipaMerchantItem } from '../../data/walletData';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface LipaNambaCardProps {
  item: LipaMerchantItem;
  lang: Language;
  onOpenQr: (item: LipaMerchantItem) => void;
  onCopy: (text: string, label: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export const LipaNambaCard: React.FC<LipaNambaCardProps> = ({
  item,
  lang,
  onOpenQr,
  onCopy,
  onToggleFavorite,
}) => {
  const t = TRANSLATIONS[lang];
  const [copied, setCopied] = useState(false);
  const [isDialingModalOpen, setIsDialingModalOpen] = useState(false);
  const [dialAmount, setDialAmount] = useState('');

  const getCategoryIcon = (cat: LipaMerchantItem['category']) => {
    switch (cat) {
      case 'Mafuta':
        return <Fuel className="w-3.5 h-3.5 text-orange-400" />;
      case 'Supermarket':
        return <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Dawa & Afya':
        return <Pill className="w-3.5 h-3.5 text-blue-400" />;
      case 'Kodi & LUKU':
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Mgahawa':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const getProviderBadge = (provider: LipaMerchantItem['provider']) => {
    switch (provider) {
      case 'Vodacom M-Pesa':
        return { label: 'M-Pesa', bg: 'bg-red-500/20 text-red-400 border-red-500/30' };
      case 'Tigo Pesa':
        return { label: 'Tigo Pesa', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'Airtel Money':
        return { label: 'Airtel', bg: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      case 'Selcom':
        return { label: 'Selcom Pay', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'GePG Govt', bg: 'bg-teal-500/20 text-teal-400 border-teal-500/30' };
    }
  };

  const badge = getProviderBadge(item.provider);

  const handleCopyNumber = () => {
    onCopy(item.number, `Lipa Namba ya ${item.merchantName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Real USSD trigger for Android dialer
  const handleDialUssd = () => {
    let code = item.ussdPrefix;
    if (dialAmount && !isNaN(parseInt(dialAmount, 10))) {
      // If user specified amount, embed into standard provider USSD format where applicable
      if (item.provider === 'Vodacom M-Pesa') {
        code = `*150*00*1*${item.number}*${dialAmount}#`;
      }
    }
    // Encodes hash for standard tel: protocol: %23
    const encodedUssd = `tel:${code.replace(/#/g, '%23')}`;
    onCopy(code, `USSD Code: ${code}`);
    window.location.href = encodedUssd;
    setIsDialingModalOpen(false);
  };

  return (
    <div className="w-full bg-[#06271D] border border-[#24473A] hover:border-[#00B887]/60 rounded-2xl p-4 transition-all duration-200 shadow-lg relative group">
      {/* Top Details & Category */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center shrink-0">
            {getCategoryIcon(item.category)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#F4C95D] transition-colors leading-tight">
              {item.merchantName}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badge.bg}`}
              >
                {badge.label}
              </span>
              <span className="text-[11px] text-[#B7C8C1]">
                {item.category} • {item.merchantType}
              </span>
            </div>
          </div>
        </div>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            className="text-[#B7C8C1] hover:text-[#F4C95D] transition-colors p-1"
          >
            <Star
              className={`w-4 h-4 ${
                item.favorite ? 'fill-[#F4C95D] text-[#F4C95D]' : 'opacity-40'
              }`}
            />
          </button>
        )}
      </div>

      {item.branchOrNotes && (
        <p className="text-xs text-[#B7C8C1]/80 mb-3 bg-[#0B211B]/60 px-2.5 py-1 rounded-lg border border-[#24473A]/40 line-clamp-1">
          📍 {item.branchOrNotes}
        </p>
      )}

      {/* Till Number Display Bar */}
      <div className="p-3 bg-[#0B211B] rounded-xl border border-[#24473A] flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-semibold text-[#B7C8C1] uppercase tracking-wider block">
            {item.merchantType === 'Paybill' ? 'Control / Meter #' : 'Lipa Namba / Till'}
          </span>
          <span className="text-lg font-mono font-black text-[#F4C95D] tracking-wider">
            {item.number}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyNumber}
          className="px-2.5 py-1.5 rounded-lg bg-[#06271D] border border-[#24473A] hover:border-[#00B887] text-xs font-semibold text-[#B7C8C1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00B887]" />
              <span className="text-[11px] text-[#00B887]">Imenakiliwa</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Nakili</span>
            </>
          )}
        </button>
      </div>

      {/* Action Buttons: 1-Tap USSD & QR Code */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsDialingModalOpen(true)}
          className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#00B887] to-[#00926C] text-[#03120E] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#00B887]/15 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{t.dialUssd}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenQr(item)}
          className="py-2 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#F4C95D] text-xs font-semibold text-[#B7C8C1] hover:text-[#F4C95D] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#F4C95D]" />
          <span>{t.showQr}</span>
        </button>
      </div>

      {/* Quick USSD Dial Dialog */}
      {isDialingModalOpen && (
        <div className="absolute inset-0 bg-[#03120E]/95 backdrop-blur-sm rounded-2xl p-4 z-20 flex flex-col justify-between animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#24473A]">
              <span className="text-xs font-bold text-white">
                Piga USSD ya {item.merchantName}
              </span>
              <button
                type="button"
                onClick={() => setIsDialingModalOpen(false)}
                className="text-[#B7C8C1] hover:text-white text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-3">
              <label className="text-[11px] text-[#B7C8C1] block mb-1">
                Kiasi cha Kulipa (Hiari - unaweza kuingiza kwenye menu ya USSD):
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F4C95D]">
                  TZS
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={dialAmount}
                  onChange={(e) => setDialAmount(e.target.value.replace(/\D/g, ''))}
                  placeholder="Mf. 15,000"
                  className="w-full bg-[#0B211B] border border-[#24473A] rounded-lg pl-11 pr-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <p className="text-[10px] text-[#00B887] mt-1.5 font-mono">
                USSD: {item.ussdPrefix}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleDialUssd}
              className="flex-1 py-2 px-3 rounded-xl bg-[#00B887] text-[#03120E] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Piga Kwenye Simu</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDialingModalOpen(false)}
              className="py-2 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-xs text-[#B7C8C1]"
            >
              Ghairi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
