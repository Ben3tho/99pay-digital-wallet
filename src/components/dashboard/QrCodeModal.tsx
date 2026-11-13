import React from 'react';
import { X, QrCode, Copy, Check, Download, Share2 } from 'lucide-react';
import { LipaMerchantItem } from '../../data/walletData';

interface QrCodeModalProps {
  merchant: LipaMerchantItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ merchant, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !merchant) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(merchant.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-[#06271D] border border-[#24473A] rounded-2xl shadow-2xl p-5 flex flex-col items-center text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D] mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white mb-0.5">{merchant.merchantName}</h3>
        <p className="text-xs text-[#B7C8C1] mb-4">
          {merchant.provider} • {merchant.merchantType}
        </p>

        {/* High-Contrast QR Code Card */}
        <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-[#F4C95D] mb-4 flex flex-col items-center justify-center">
          {/* Simulated precise QR Matrix Pattern */}
          <div className="w-48 h-48 bg-white flex flex-col items-center justify-center relative p-2">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-black fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner position squares */}
              <rect x="5" y="5" width="28" height="28" fill="black" rx="3" />
              <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="13" width="12" height="12" fill="black" rx="1" />

              <rect x="67" y="5" width="28" height="28" fill="black" rx="3" />
              <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
              <rect x="75" y="13" width="12" height="12" fill="black" rx="1" />

              <rect x="5" y="67" width="28" height="28" fill="black" rx="3" />
              <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
              <rect x="13" y="75" width="12" height="12" fill="black" rx="1" />

              {/* Data blocks */}
              <rect x="38" y="8" width="6" height="6" />
              <rect x="48" y="12" width="6" height="6" />
              <rect x="56" y="8" width="6" height="6" />
              <rect x="38" y="24" width="6" height="6" />
              <rect x="48" y="20" width="6" height="6" />

              <rect x="8" y="38" width="6" height="6" />
              <rect x="20" y="42" width="6" height="6" />
              <rect x="12" y="52" width="6" height="6" />

              <rect x="38" y="38" width="10" height="10" />
              <rect x="52" y="42" width="8" height="8" />
              <rect x="42" y="54" width="12" height="6" />

              <rect x="68" y="38" width="8" height="8" />
              <rect x="80" y="46" width="12" height="6" />
              <rect x="72" y="56" width="6" height="8" />

              <rect x="40" y="72" width="6" height="6" />
              <rect x="52" y="78" width="8" height="6" />
              <rect x="64" y="70" width="6" height="10" />
              <rect x="76" y="80" width="12" height="6" />

              {/* Center Brand Badge */}
              <circle cx="50" cy="50" r="10" fill="white" stroke="#06271D" strokeWidth="2" />
              <text
                x="50"
                y="54"
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill="#00B887"
              >
                99
              </text>
            </svg>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block">
              Lipa Namba
            </span>
            <span className="text-xl font-black font-mono tracking-widest text-[#03120E]">
              {merchant.number}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#B7C8C1] mb-4">
          Scan kwa kutumia App yoyote ya Benki au Pochi ya Simu (M-Pesa, Tigo Pesa, Selcom, NMB/CRDB).
        </p>

        <div className="w-full flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#00B887] text-[#03120E] text-xs font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Imenakiliwa!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Nakili Namba</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-[#0B211B] border border-[#24473A] text-xs font-semibold text-[#B7C8C1] hover:text-white transition-colors cursor-pointer"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
