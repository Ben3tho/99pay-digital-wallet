import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  PhoneCall,
  Copy,
  Check,
  GraduationCap,
  Fuel,
  Trash2,
  Pencil,
} from 'lucide-react';
import { PensionLoyaltyItem } from '../../data/walletData';
import { Language } from '../../i18n/translations';
import { launchUssdDialer } from '../../utils/ussd';

interface PensionLoyaltyCardProps {
  item: PensionLoyaltyItem;
  lang: Language;
  onCopy: (text: string, label: string) => void;
  onEdit?: (item: PensionLoyaltyItem) => void;
  onDelete?: (id: string) => void;
}

export const PensionLoyaltyCard: React.FC<PensionLoyaltyCardProps> = ({
  item,
  lang,
  onCopy,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const getIcon = (type: PensionLoyaltyItem['categoryType']) => {
    switch (type) {
      case 'NSSF':
      case 'PSSSF':
        return <ShieldCheck className="w-4 h-4 text-[#00B887]" />;
      case 'Fuel Loyalty':
        return <Fuel className="w-4 h-4 text-orange-400" />;
      case 'University ID':
        return <GraduationCap className="w-4 h-4 text-blue-400" />;
      default:
        return <Award className="w-4 h-4 text-[#F4C95D]" />;
    }
  };

  const handleCopy = () => {
    onCopy(item.membershipNumber, `${item.title} Namba`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDialUssd = () => {
    if (item.ussdCheckCode) {
      const launched = launchUssdDialer(item.ussdCheckCode);
      onCopy(launched || item.ussdCheckCode, `USSD Code: ${launched || item.ussdCheckCode}`);
    }
  };

  return (
    <div className="w-full bg-[#06271D] border border-[#24473A] hover:border-[#00B887]/60 rounded-2xl p-4 transition-all duration-200 shadow-lg relative group">
      {/* Top Banner */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${item.accentColor}1A`,
              borderColor: `${item.accentColor}4D`,
            }}
          >
            {getIcon(item.categoryType)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#F4C95D] transition-colors leading-tight">
              {item.title}
            </h4>
            <span className="text-[11px] text-[#B7C8C1] block mt-0.5">
              {item.organization}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0B211B] border border-[#24473A] text-[#00B887]">
            {item.categoryType}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(item)}
              aria-label="Edit pension or loyalty card"
              className="p-1.5 rounded-lg bg-[#0B211B] border border-[#24473A] hover:border-[#00B887] text-[#B7C8C1] hover:text-[#00B887] transition-colors cursor-pointer"
              title={lang === 'sw' ? 'Hariri kadi' : 'Edit card'}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              aria-label="Delete pension or loyalty card"
              className="p-1.5 rounded-lg bg-[#0B211B] border border-[#24473A] hover:border-rose-500/60 text-[#B7C8C1] hover:text-rose-400 transition-colors cursor-pointer"
              title={lang === 'sw' ? 'Futa kadi' : 'Delete card'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Member details */}
      <div className="p-3 bg-[#0B211B] rounded-xl border border-[#24473A] space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#B7C8C1] uppercase tracking-wider">
            Namba ya Mwanachama
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] text-[#00B887] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#00B887]" />
                <span>Imenakiliwa</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Nakili</span>
              </>
            )}
          </button>
        </div>
        <p className="text-base font-mono font-black text-[#F4C95D] tracking-wider">
          {item.membershipNumber}
        </p>

        <div className="pt-2 border-t border-[#24473A]/60 flex items-center justify-between text-xs text-[#B7C8C1]">
          <span>Mwenye Kadi:</span>
          <span className="font-semibold text-white">{item.holderName}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#B7C8C1]">
          <span>Hali / Alama:</span>
          <span className="font-semibold text-[#00B887]">{item.expiryOrStatus}</span>
        </div>
      </div>

      {/* Action: If USSD check exists (e.g. *152*00# for NSSF) */}
      {item.ussdCheckCode && (
        <button
          type="button"
          onClick={handleDialUssd}
          className="w-full py-2 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#00B887] text-xs font-semibold text-[#B7C8C1] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#00B887]" />
          <span>Angalia Michango ({item.ussdCheckCode})</span>
        </button>
      )}
    </div>
  );
};
