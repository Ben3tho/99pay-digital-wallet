import React, { useState, useMemo } from 'react';
import {
  X,
  Calculator,
  ArrowRight,
  TrendingDown,
  Check,
  Copy,
  Smartphone,
  Info,
  Scale,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Send,
  Zap,
} from 'lucide-react';
import {
  MOBILE_PROVIDERS,
  MobileProviderId,
  TransactionType,
  calculateTariff,
  compareAllProviders,
} from '../../data/tariffData';
import { TRANSLATIONS, Language } from '../../i18n/translations';

interface TariffCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const TariffCalculatorModal: React.FC<TariffCalculatorModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  // State
  const [amountInput, setAmountInput] = useState<string>('50000');
  const [selectedProvider, setSelectedProvider] = useState<MobileProviderId>('mpesa');
  const [txType, setTxType] = useState<TransactionType>('send_same');
  const [includeWithdrawalFee, setIncludeWithdrawalFee] = useState<boolean>(true);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const numericAmount = useMemo(() => {
    const parsed = parseInt(amountInput.replace(/\D/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [amountInput]);

  const calculation = useMemo(() => {
    return calculateTariff(numericAmount, selectedProvider, txType, includeWithdrawalFee);
  }, [numericAmount, selectedProvider, txType, includeWithdrawalFee]);

  const comparison = useMemo(() => {
    return compareAllProviders(numericAmount, txType, includeWithdrawalFee);
  }, [numericAmount, txType, includeWithdrawalFee]);

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 200000, 500000, 1000000];

  const handleCopySummary = () => {
    const provName = MOBILE_PROVIDERS.find((p) => p.id === selectedProvider)?.name || 'Mobile Money';
    const txLabel =
      txType === 'send_same'
        ? t.sendSameNetwork
        : txType === 'send_other'
        ? t.sendOtherNetwork
        : txType === 'send_unregistered'
        ? t.sendUnregistered
        : t.withdrawAgent;

    const summaryText =
      `*99Pay Digital Wallet — Mchanganuo wa Muamala*\n` +
      `Mtandao: ${provName}\n` +
      `Aina ya Muamala: ${txLabel}\n` +
      `Kiasi: TZS ${calculation.amount.toLocaleString()}\n` +
      `Ada ya Mtandao: TZS ${calculation.networkFee.toLocaleString()}\n` +
      `Tozo ya Serikali: TZS ${calculation.govLevy.toLocaleString()}\n` +
      (includeWithdrawalFee && txType !== 'withdraw_agent'
        ? `Pesa ya Kutolea (Wakala): TZS ${calculation.agentWithdrawFee.toLocaleString()}\n`
        : '') +
      `*JUMLA INAYOTAKIWA: TZS ${calculation.totalRequired.toLocaleString()}*\n` +
      `(Mpokeaji atapokea: TZS ${calculation.recipientReceives.toLocaleString()})`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#06271D] border border-[#24473A] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#24473A] flex items-center justify-between bg-[#03120E]/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B887]/20 to-[#F4C95D]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {t.calculatorTitle}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#00B887]/20 text-[#00B887] border border-[#00B887]/30">
                  BoT 2026 Rates
                </span>
              </h2>
              <p className="text-xs text-[#B7C8C1]">{t.calculatorSubtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-[#24473A]">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-[#B7C8C1] mb-1.5 flex items-center justify-between">
              <span>{t.amountToSend}</span>
              <span className="text-[11px] text-[#F4C95D] font-mono">
                Min: 100 • Max: 5,000,000 TZS
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#F4C95D]">
                TZS
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={numericAmount > 0 ? numericAmount.toLocaleString() : ''}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="50,000"
                className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl pl-13 pr-4 py-3 text-white font-mono text-lg font-bold focus:outline-none focus:border-[#00B887] transition-all"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountInput(amt.toString())}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium shrink-0 transition-all cursor-pointer ${
                    numericAmount === amt
                      ? 'bg-[#00B887] text-[#03120E] font-bold shadow-sm'
                      : 'bg-[#0B211B] text-[#B7C8C1] hover:text-white border border-[#24473A]'
                  }`}
                >
                  {amt >= 1000000 ? `${amt / 1000000}M` : `${amt / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#B7C8C1] mb-2">
              {t.selectProvider}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOBILE_PROVIDERS.map((provider) => {
                const isSelected = selectedProvider === provider.id;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setSelectedProvider(provider.id)}
                    style={{
                      borderColor: isSelected ? provider.brandColor : '#24473A',
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B211B] shadow-md ring-1 ring-[#00B887]'
                        : 'bg-[#0B211B]/60 hover:bg-[#0B211B]'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: provider.brandColor }}
                    />
                    <span className="text-xs font-bold text-white text-center leading-tight">
                      {provider.name}
                    </span>
                    <span className="text-[10px] text-[#B7C8C1] font-mono">
                      {provider.ussd}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-semibold text-[#B7C8C1] mb-2">
              {t.transactionType}
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setTxType('send_same')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  txType === 'send_same'
                    ? 'bg-[#00B887]/15 border-[#00B887] text-white font-semibold'
                    : 'bg-[#0B211B] border-[#24473A] text-[#B7C8C1] hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#00B887] shrink-0" />
                <span>{t.sendSameNetwork}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxType('send_other')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  txType === 'send_other'
                    ? 'bg-[#00B887]/15 border-[#00B887] text-white font-semibold'
                    : 'bg-[#0B211B] border-[#24473A] text-[#B7C8C1] hover:text-white'
                }`}
              >
                <ArrowRight className="w-3.5 h-3.5 text-[#F4C95D] shrink-0" />
                <span>{t.sendOtherNetwork}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxType('send_unregistered')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  txType === 'send_unregistered'
                    ? 'bg-[#00B887]/15 border-[#00B887] text-white font-semibold'
                    : 'bg-[#0B211B] border-[#24473A] text-[#B7C8C1] hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{t.sendUnregistered}</span>
              </button>

              <button
                type="button"
                onClick={() => setTxType('withdraw_agent')}
                className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                  txType === 'withdraw_agent'
                    ? 'bg-[#00B887]/15 border-[#00B887] text-white font-semibold'
                    : 'bg-[#0B211B] border-[#24473A] text-[#B7C8C1] hover:text-white'
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{t.withdrawAgent}</span>
              </button>
            </div>
          </div>

          {/* "Pesa ya Kutolea" Toggle (Tanzania Unique Culture Feature) */}
          {txType !== 'withdraw_agent' && (
            <div
              onClick={() => setIncludeWithdrawalFee(!includeWithdrawalFee)}
              className="p-3 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-between cursor-pointer hover:border-[#00B887]/60 transition-all"
            >
              <div className="flex items-center gap-2.5 pr-2">
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    includeWithdrawalFee
                      ? 'bg-[#00B887] border-[#00B887] text-[#03120E]'
                      : 'border-[#24473A] bg-[#06271D]'
                  }`}
                >
                  {includeWithdrawalFee && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {t.includeWithdrawalFee}
                  </span>
                  <span className="text-[11px] text-[#B7C8C1]">
                    Inajumlisha ada ya wakala (TZS {calculation.agentWithdrawFee.toLocaleString()}) ili mpokeaji atoe pesa kamili.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Live Calculation Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#03120E] to-[#0B211B] border border-[#00B887]/40 shadow-inner space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#24473A]/60">
              <span className="text-xs font-semibold text-[#B7C8C1]">{t.breakdownTitle}</span>
              <span className="text-xs font-bold text-[#00B887]">
                {MOBILE_PROVIDERS.find((p) => p.id === selectedProvider)?.name}
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[#B7C8C1]">
                <span>{t.transferAmount}:</span>
                <span className="font-mono font-medium text-white">
                  TZS {calculation.amount.toLocaleString()}
                </span>
              </div>

              {txType !== 'withdraw_agent' && (
                <div className="flex items-center justify-between text-[#B7C8C1]">
                  <span>{t.networkFee}:</span>
                  <span className="font-mono font-medium text-[#F4C95D]">
                    TZS {calculation.networkFee.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#B7C8C1]">
                <span>{t.governmentLevy}:</span>
                <span className="font-mono font-medium text-[#B7C8C1]">
                  TZS {calculation.govLevy.toLocaleString()}
                </span>
              </div>

              {(includeWithdrawalFee || txType === 'withdraw_agent') && (
                <div className="flex items-center justify-between text-[#B7C8C1]">
                  <span>{t.agentFee}:</span>
                  <span className="font-mono font-medium text-purple-400">
                    TZS {calculation.agentWithdrawFee.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#24473A] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {t.totalRequired}
                  </span>
                  <span className="text-[10px] text-[#00B887]">
                    Mpokeaji anabakiwa na: TZS {calculation.recipientReceives.toLocaleString()}
                  </span>
                </div>
                <span className="text-lg font-black font-mono text-[#F4C95D]">
                  TZS {calculation.totalRequired.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#F4C95D]" />
                {t.comparisonTitle}
              </span>
              <span className="text-[10px] text-[#B7C8C1]">
                Kwa kiasi cha TZS {calculation.amount.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {comparison.map((item) => (
                <div
                  key={item.providerId}
                  onClick={() => setSelectedProvider(item.providerId)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                    item.isCheapest
                      ? 'bg-[#00B887]/15 border-[#00B887] ring-1 ring-[#00B887]'
                      : 'bg-[#0B211B] border-[#24473A] hover:border-[#B7C8C1]'
                  }`}
                >
                  {item.isCheapest && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#00B887] text-[#03120E] uppercase tracking-wider">
                      {t.cheapestNetwork}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-white block truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F4C95D] block mt-1">
                    TZS {item.totalFee.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#B7C8C1] font-mono">ada jumla</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#24473A] bg-[#03120E]/90 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00B887] to-[#00926C] text-[#03120E] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00B887]/20 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          >
            {copiedSummary ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Imenakiliwa Kwenye Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t.copySummary}</span>
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
