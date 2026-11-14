import React, { useEffect, useState } from 'react';
import { X, QrCode, Copy, Check, Download, Share2 } from 'lucide-react';
import QRCode from 'qrcode';
import { LipaMerchantItem } from '../../data/walletData';

interface QrCodeModalProps {
  merchant: LipaMerchantItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ merchant, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [qrMode, setQrMode] = useState<'number' | 'details'>('number');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<string | null>(null);

  const qrPayload = merchant
    ? qrMode === 'number'
      ? merchant.number
      : JSON.stringify({
          app: '99Pay',
          merchant: merchant.merchantName,
          provider: merchant.provider,
          type: merchant.merchantType,
          till: merchant.number,
          ussd: merchant.ussdPrefix,
        })
    : '';

  useEffect(() => {
    let active = true;
    if (!isOpen || !merchant || !qrPayload) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(qrPayload, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#03120E',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
          setQrError(null);
        }
      })
      .catch(() => {
        if (active) {
          setQrError('Imeshindikana kutengeneza picha ya QR.');
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, merchant, qrPayload]);

  if (!isOpen || !merchant) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(merchant.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    const safeName = merchant.merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    anchor.download = `99pay-qr-${safeName}-${merchant.number}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleShare = async () => {
    const text = `${merchant.merchantName} (${merchant.provider} ${merchant.merchantType}): ${merchant.number}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lipa Namba - ${merchant.merchantName}`,
          text,
        });
        return;
      } catch {
        // Fallback to copy if share dismissed
      }
    }
    handleCopy();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#06271D] border border-[#24473A] rounded-2xl shadow-2xl p-5 flex flex-col items-center text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close QR modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D] mb-2.5">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white mb-0.5">{merchant.merchantName}</h3>
        <p className="text-xs text-[#B7C8C1] mb-3">
          {merchant.provider} • {merchant.merchantType}
        </p>

        {/* QR Encoding Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0B211B] border border-[#24473A] w-full mb-3 text-[11px]">
          <button
            type="button"
            onClick={() => setQrMode('number')}
            className={`py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              qrMode === 'number'
                ? 'bg-[#00B887] text-[#03120E]'
                : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            Namba ya Till Pekee
          </button>
          <button
            type="button"
            onClick={() => setQrMode('details')}
            className={`py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              qrMode === 'details'
                ? 'bg-[#00B887] text-[#03120E]'
                : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            Taarifa Kamili (JSON)
          </button>
        </div>

        {/* Real Generated High-Contrast QR Code Card */}
        <div className="p-4 bg-white rounded-2xl shadow-lg border-2 border-[#F4C95D] mb-3.5 flex flex-col items-center justify-center">
          <div className="w-48 h-48 bg-white flex items-center justify-center relative">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR Code ya ${merchant.merchantName} (${merchant.number})`}
                className="w-48 h-48 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-500">
                {qrError || 'Inatengeneza QR Code...'}
              </span>
            )}
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

        <p className="text-xs text-[#B7C8C1] mb-3.5">
          QR halisi imetengenezwa kwa ajili ya <strong>{merchant.number}</strong>. Scan kwa kamera au App ya malipo.
        </p>

        <div className="w-full grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-2 rounded-xl bg-[#00B887] text-[#03120E] text-xs font-bold flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nakili ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Nakili</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!qrDataUrl}
            className="py-2.5 px-2 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#F4C95D] text-xs font-semibold text-[#F4C95D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Pakua</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="py-2.5 px-2 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#00B887] text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#00B887]" />
            <span>Shiriki</span>
          </button>
        </div>
      </div>
    </div>
  );
};
