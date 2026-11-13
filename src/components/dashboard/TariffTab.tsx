import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Check,
  Copy,
  Smartphone,
  Scale,
  Send,
  Zap,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';
import {
  MOBILE_PROVIDERS,
  MobileProviderId,
  TransactionType,
  calculateTariff,
  compareAllProviders,
} from '../../data/tariffData';
import { TRANSLATIONS, Language } from '../../i18n/translations';

interface TariffTabProps {
  lang: Language;
}

export const TariffTab: React.FC<TariffTabProps> = ({ lang }) => {
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

  const activeProviderMeta = MOBILE_PROVIDERS.find((p) => p.id === selectedProvider);

  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 200000, 500000];

  const handleCopySummary = () => {
    const provName = activeProviderMeta?.name || 'Mobile Money';
    const txLabel =
      txType === 'send_same'
        ? t.sendSameNetwork
        : txType === 'send_other'
        ? t.sendOtherNetwork
        : txType === 'send_unregistered'
        ? t.sendUnregistered
        : t.withdrawAgent;

    const summaryText =
      `*99Pay Digital Wallet — Mchanganuo wa Makato*\n` +
      `Mtandao: ${provName}\n` +
      `Muamala: ${txLabel}\n` +
      `Kiasi: TZS ${calculation.amount.toLocaleString()}\n` +
      `Ada ya Mtandao: TZS ${calculation.networkFee.toLocaleString()}\n` +
      `Tozo ya Serikali: TZS ${calculation.govLevy.toLocaleString()}\n` +
      (includeWithdrawalFee && txType !== 'withdraw_agent'
        ? `Ada ya Kutoa Wakala: TZS ${calculation.agentWithdrawFee.toLocaleString()}\n`
        : '') +
      `-----------------------------------\n` +
      `Jumla Inayotakiwa Kutumwa: TZS ${calculation.totalRequired.toLocaleString()}\n` +
      (includeWithdrawalFee && txType !== 'withdraw_agent'
        ? `Mpokeaji atatoa: TZS ${calculation.amount.toLocaleString()} bila kupungua!`
        : '');

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  return (
    <div className="w-full flex flex-col space-y-4 pb-4">
      {/* Tab Header Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06271D] to-[#0B211B] border border-[#24473A] shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D] shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {lang === 'sw' ? 'Kikokotoo cha Makato' : 'Tariff Calculator'}
            </h2>
            <p className="text-xs text-[#B7C8C1]">
              {lang === 'sw'
                ? 'Hesabu makato rasmi & Pesa ya Kutolea'
                : 'Calculate real tariffs & Cashout fee'}
            </p>
          </div>
        </div>

        {/* Official TCRA/TRA Tariff 2026 Tag */}
        <span className="px-2 py-0.5 rounded-lg bg-[#00B887]/15 border border-[#00B887]/40 text-[10px] font-bold text-[#00B887]">
          2026 Rates
        </span>
      </div>

      {/* 1. Mobile Provider Switcher Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#0B211B] border border-[#24473A]">
        {MOBILE_PROVIDERS.map((prov) => {
          const isSelected = selectedProvider === prov.id;
          return (
            <button
              key={prov.id}
              type="button"
              onClick={() => setSelectedProvider(prov.id)}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'bg-[#06271D] text-white border border-[#00B887] shadow-sm'
                  : 'text-[#B7C8C1] hover:text-white'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full mb-0.5"
                style={{ backgroundColor: prov.brandColor }}
              />
              <span className="text-[11px] font-bold truncate max-w-full">
                {prov.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#B7C8C1]/75 block truncate">
                {prov.id === 'mpesa'
                  ? 'M-Pesa'
                  : prov.id === 'tigopesa'
                  ? 'Tigo'
                  : prov.id === 'airtel'
                  ? 'Airtel'
                  : 'Halo'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Amount Input Card */}
      <div className="p-4 rounded-2xl bg-[#06271D] border border-[#24473A] space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#B7C8C1]">
            {lang === 'sw' ? 'Kiasi Unachotaka Kutuma / Kutoa' : 'Transfer or Cashout Amount'}
          </label>
          <span className="text-xs font-bold text-[#F4C95D]">TZS</span>
        </div>

        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={amountInput}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '');
              setAmountInput(raw);
            }}
            placeholder="0"
            className="w-full pl-4 pr-16 py-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-xl font-black text-white focus:outline-none focus:border-[#00B887] transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#B7C8C1]">
            Shilingi
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmountInput(q.toString())}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                numericAmount === q
                  ? 'bg-[#00B887] text-[#03120E]'
                  : 'bg-[#0B211B] text-[#B7C8C1] border border-[#24473A] hover:text-white'
              }`}
            >
              {(q / 1000).toLocaleString()}k
            </button>
          ))}
        </div>
      </div>

      {/* 3. Transaction Type Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#B7C8C1] block px-1">
          {lang === 'sw' ? 'Aina ya Muamala' : 'Transaction Type'}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTxType('send_same')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
              txType === 'send_same'
                ? 'bg-[#00B887]/15 border-[#00B887] text-white'
                : 'bg-[#06271D] border-[#24473A] text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5 shrink-0 text-[#00B887]" />
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                {lang === 'sw' ? 'Mtandao Huu Huu' : 'Same Network'}
              </span>
              <span className="text-[10px] text-[#B7C8C1] block truncate">
                {activeProviderMeta?.name.split(' ')[0]} kwenda {activeProviderMeta?.name.split(' ')[0]}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTxType('send_other')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
              txType === 'send_other'
                ? 'bg-[#00B887]/15 border-[#00B887] text-white'
                : 'bg-[#06271D] border-[#24473A] text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                {lang === 'sw' ? 'Mitandao Mingine' : 'Other Networks'}
              </span>
              <span className="text-[10px] text-[#B7C8C1] block truncate">TIPS / Benki & Mitandao</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTxType('withdraw_agent')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
              txType === 'withdraw_agent'
                ? 'bg-[#00B887]/15 border-[#00B887] text-white'
                : 'bg-[#06271D] border-[#24473A] text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0 text-[#F4C95D]" />
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                {lang === 'sw' ? 'Kutoa kwa Wakala' : 'Withdraw Agent'}
              </span>
              <span className="text-[10px] text-[#B7C8C1] block truncate">Wakala Cashout Fee</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTxType('send_unregistered')}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
              txType === 'send_unregistered'
                ? 'bg-[#00B887]/15 border-[#00B887] text-white'
                : 'bg-[#06271D] border-[#24473A] text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate">
                {lang === 'sw' ? 'Asiyesajiliwa' : 'Unregistered'}
              </span>
              <span className="text-[10px] text-[#B7C8C1] block truncate">Voucher / Secret Code</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Special Tanzania "Pesa ya Kutolea" Feature Toggle */}
      {txType !== 'withdraw_agent' && (
        <div
          onClick={() => setIncludeWithdrawalFee(!includeWithdrawalFee)}
          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            includeWithdrawalFee
              ? 'bg-[#00B887]/10 border-[#00B887]/50 shadow-sm'
              : 'bg-[#06271D] border-[#24473A]'
          }`}
        >
          <div className="flex items-center gap-2.5 pr-2">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                includeWithdrawalFee
                  ? 'bg-[#00B887] text-[#03120E]'
                  : 'bg-[#0B211B] border border-[#24473A]'
              }`}
            >
              {includeWithdrawalFee && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {lang === 'sw' ? 'Jumuisha "Pesa ya Kutolea"' : 'Include Cashout Fee'}
              </span>
              <span className="text-[10px] text-[#B7C8C1] block">
                {lang === 'sw'
                  ? 'Mpokeaji atoe kiasi halisi bila kupungua kwa ada ya wakala'
                  : 'Ensure recipient withdraws exact amount without deduction'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#F4C95D] shrink-0">
            {includeWithdrawalFee
              ? `+TZS ${calculation.agentWithdrawFee.toLocaleString()}`
              : 'Imezimwa'}
          </span>
        </div>
      )}

      {/* 5. Breakdown Result Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#06271D] to-[#0B211B] border border-[#24473A] shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-[#24473A] pb-2">
          <span className="text-xs text-[#B7C8C1] font-medium">
            {lang === 'sw' ? 'Mchanganuo wa Makato' : 'Fee Breakdown'}
          </span>
          <span className="text-xs font-bold text-white">{activeProviderMeta?.name}</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[#B7C8C1]">
            <span>{lang === 'sw' ? 'Kiasi Msingi' : 'Principal Amount'}:</span>
            <span className="font-semibold text-white">
              TZS {calculation.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#B7C8C1]">
            <span>{lang === 'sw' ? 'Ada ya Mtandao' : 'Network Fee'}:</span>
            <span className="font-semibold text-white">
              TZS {calculation.networkFee.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-[#B7C8C1]">
            <span className="flex items-center gap-1">
              <span>{lang === 'sw' ? 'Tozo ya Serikali (TRA)' : 'Govt Levy'}</span>
              <span className="text-[9px] text-[#00B887]">TRA 2026</span>
            </span>
            <span className="font-semibold text-white">
              TZS {calculation.govLevy.toLocaleString()}
            </span>
          </div>

          {includeWithdrawalFee && txType !== 'withdraw_agent' && (
            <div className="flex justify-between items-center text-[#00B887] font-medium">
              <span>{lang === 'sw' ? 'Ada ya Kutoa Wakala' : 'Agent Cashout Fee'}:</span>
              <span className="font-semibold">
                +TZS {calculation.agentWithdrawFee.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Total Debited Banner */}
        <div className="pt-2 border-t border-[#24473A] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#B7C8C1] block uppercase font-bold tracking-wider">
              {lang === 'sw' ? 'Jumla Inayohitajika' : 'Total Required'}
            </span>
            <span className="text-xl font-black text-[#F4C95D]">
              TZS {calculation.totalRequired.toLocaleString()}
            </span>
          </div>

          {/* Quick USSD Launcher */}
          {activeProviderMeta?.ussd && (
            <a
              href={`tel:${encodeURIComponent(activeProviderMeta.ussd)}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00B887] hover:bg-[#00B887]/90 text-[#03120E] font-bold text-xs shadow-md transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{activeProviderMeta.ussd}</span>
            </a>
          )}
        </div>
      </div>

      {/* 6. Comparison Across All Tanzanian Networks */}
      <div className="p-3.5 rounded-2xl bg-[#06271D] border border-[#24473A] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#B7C8C1] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#F4C95D]" />
            {lang === 'sw' ? 'Ulinganisho wa Mitandao Yote' : 'All Networks Comparison'}
          </span>
          <span className="text-[10px] text-[#00B887] font-semibold">Tanzania Rates</span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          {comparison.map((item) => {
            const isCurrent = item.providerId === selectedProvider;
            return (
              <div
                key={item.providerId}
                onClick={() => setSelectedProvider(item.providerId)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-[#0B211B] border-[#00B887]'
                    : 'bg-[#03120E]/50 border-[#24473A] hover:border-[#B7C8C1]/40'
                }`}
              >
                {item.isCheapest && (
                  <span className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded-full bg-[#00B887] text-[#03120E] text-[9px] font-black uppercase tracking-wider">
                    {lang === 'sw' ? 'Nafuu Zaidi' : 'Lowest'}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.brandColor }}
                  />
                  <span className="text-[11px] font-bold text-white truncate">{item.name}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] text-[#B7C8C1]">
                    {lang === 'sw' ? 'Jumla:' : 'Total:'}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      item.isCheapest ? 'text-[#00B887]' : 'text-[#F4C95D]'
                    }`}
                  >
                    TZS {item.totalRequired.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copy / Share Button */}
      <button
        type="button"
        onClick={handleCopySummary}
        className="w-full py-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] hover:border-[#00B887] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-98"
      >
        {copiedSummary ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#00B887]" />
            <span className="text-[#00B887]">
              {lang === 'sw' ? 'Mchanganuo Umenakiliwa!' : 'Summary Copied!'}
            </span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 text-[#F4C95D]" />
            <span>{lang === 'sw' ? 'Nakili Mchanganuo wa Makato' : 'Copy Fee Breakdown'}</span>
          </>
        )}
      </button>
    </div>
  );
};
