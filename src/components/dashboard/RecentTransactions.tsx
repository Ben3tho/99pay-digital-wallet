import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  History,
  Receipt,
  CreditCard,
  ShoppingBag,
  Zap,
  Fuel,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { TransactionItem } from '../../data/walletData';
import { Language } from '../../i18n/translations';

interface RecentTransactionsProps {
  transactions: TransactionItem[];
  lang: Language;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  lang,
}) => {
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getCategoryIcon = (category: TransactionItem['category'], title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('fuel') || lower.includes('puma') || lower.includes('total')) {
      return Fuel;
    }
    if (lower.includes('luku') || lower.includes('umeme')) {
      return Zap;
    }
    if (lower.includes('shoppers') || lower.includes('supermarket')) {
      return ShoppingBag;
    }
    switch (category) {
      case 'transfer':
        return ArrowUpRight;
      case 'topup':
        return ArrowDownLeft;
      case 'payment':
        return CreditCard;
      default:
        return Receipt;
    }
  };

  const getStatusBadge = (status: TransactionItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00B887]/15 text-[#00B887] border border-[#00B887]/30">
            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
            <span>{lang === 'sw' ? 'Imekamilika' : 'Completed'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>{lang === 'sw' ? 'Inashughulikiwa' : 'Pending'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>{lang === 'sw' ? 'Imeshindikana' : 'Failed'}</span>
          </span>
        );
    }
  };

  const filteredTx = transactions.filter(
    (tx) => statusFilter === 'all' || tx.status === statusFilter
  );

  return (
    <div className="w-full space-y-2.5 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#F4C95D]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {lang === 'sw' ? 'Miamala ya Hivi Karibuni' : 'Recent Transactions'}
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-[#B7C8C1]">
          {filteredTx.length} {lang === 'sw' ? 'Miamala' : 'Items'}
        </span>
      </div>

      {/* Status Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {(
          [
            { id: 'all', sw: 'Yote', en: 'All' },
            { id: 'completed', sw: 'Imekamilika', en: 'Completed' },
            { id: 'pending', sw: 'Inashughulikiwa', en: 'Pending' },
            { id: 'failed', sw: 'Imeshindikana', en: 'Failed' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-[#00B887]/20 text-[#00B887] border border-[#00B887]/50'
                : 'bg-[#06271D] text-[#B7C8C1] border border-[#24473A] hover:text-white'
            }`}
          >
            {lang === 'sw' ? tab.sw : tab.en}
          </button>
        ))}
      </div>

      {/* Clean Transaction List Layout */}
      <div className="rounded-2xl bg-[#06271D] border border-[#24473A] divide-y divide-[#24473A]/60 overflow-hidden shadow-lg">
        {filteredTx.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#B7C8C1]">
            {lang === 'sw' ? 'Hakuna miamala katika kundi hili.' : 'No transactions in this status.'}
          </div>
        ) : (
          filteredTx.map((tx) => {
            const Icon = getCategoryIcon(tx.category, tx.title);
            const isCredit = tx.type === 'credit';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                role="button"
                tabIndex={0}
                className="p-3.5 hover:bg-[#0B211B] active:bg-[#03120E] transition-colors cursor-pointer flex items-center justify-between group"
              >
                {/* Left Column: Icon + Name/Subtitle */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                      isCredit
                        ? 'bg-[#00B887]/15 border-[#00B887]/30 text-[#00B887]'
                        : 'bg-[#F4C95D]/15 border-[#F4C95D]/30 text-[#F4C95D]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate group-hover:text-[#F4C95D] transition-colors">
                        {tx.title}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#B7C8C1] truncate mt-0.5">
                      {tx.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1 sm:hidden">
                      {getStatusBadge(tx.status)}
                      <span className="text-[10px] text-[#B7C8C1]/70">
                        {tx.date}, {tx.time}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Amount + Status Badge */}
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm tracking-tight ${
                      isCredit ? 'text-[#00B887]' : 'text-white'
                    }`}
                  >
                    {isCredit ? '+' : '-'}TZS {tx.amount.toLocaleString()}
                  </span>

                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="text-[10px] text-[#B7C8C1]/80">
                      {tx.date}, {tx.time}
                    </span>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedTx(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white overflow-hidden space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#24473A]">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    selectedTx.type === 'credit'
                      ? 'bg-[#00B887]/20 border-[#00B887]/40 text-[#00B887]'
                      : 'bg-[#F4C95D]/20 border-[#F4C95D]/40 text-[#F4C95D]'
                  }`}
                >
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {selectedTx.title}
                  </h4>
                  <span className="text-[10px] text-[#B7C8C1]">{selectedTx.provider}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                aria-label="Close transaction receipt"
                className="p-2 text-[#B7C8C1] hover:text-white rounded-lg bg-[#0B211B] border border-[#24473A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Banner */}
            <div className="p-4 rounded-2xl bg-[#0B211B] border border-[#24473A] text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#B7C8C1] tracking-wider block">
                {lang === 'sw' ? 'Kiasi cha Muamala' : 'Transaction Amount'}
              </span>
              <div
                className={`text-2xl font-black font-mono tracking-tight ${
                  selectedTx.type === 'credit' ? 'text-[#00B887]' : 'text-[#F4C95D]'
                }`}
              >
                {selectedTx.type === 'credit' ? '+' : '-'}TZS {selectedTx.amount.toLocaleString()}
              </div>
              <div className="pt-1 flex justify-center">{getStatusBadge(selectedTx.status)}</div>
            </div>

            {/* Key-Value Breakdown */}
            <div className="space-y-2 text-xs divide-y divide-[#24473A]/50">
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#B7C8C1]">
                  {lang === 'sw' ? 'Aina ya Muamala' : 'Category'}
                </span>
                <span className="font-semibold text-white uppercase text-[11px]">
                  {selectedTx.category}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#B7C8C1]">
                  {lang === 'sw' ? 'Tarehe na Saa' : 'Date & Time'}
                </span>
                <span className="font-semibold text-white">
                  {selectedTx.date} • {selectedTx.time}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#B7C8C1]">
                  {lang === 'sw' ? 'Mtoa Huduma' : 'Channel'}
                </span>
                <span className="font-semibold text-white">{selectedTx.provider}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[#B7C8C1]">
                  {lang === 'sw' ? 'Kumbukumbu (Ref)' : 'Reference'}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[#F4C95D] text-[11px]">
                    {selectedTx.reference}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyRef(selectedTx.reference)}
                    className="p-1 rounded bg-[#03120E] border border-[#24473A] text-[#B7C8C1] hover:text-white cursor-pointer"
                    title="Copy reference"
                  >
                    {copiedRef ? (
                      <Check className="w-3 h-3 text-[#00B887]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-xl bg-[#0B211B] hover:bg-[#03120E] border border-[#24473A] text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {lang === 'sw' ? 'Funga' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
