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
  Plus,
  Trash2,
  Pencil,
} from 'lucide-react';
import { TransactionItem } from '../../data/walletData';
import { Language } from '../../i18n/translations';

interface RecentTransactionsProps {
  transactions: TransactionItem[];
  lang: Language;
  onAddTransaction: (tx: TransactionItem) => void;
  onUpdateTransaction?: (tx: TransactionItem) => void;
  onDeleteTransaction: (id: string) => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  lang,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [editingTx, setEditingTx] = useState<TransactionItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [copiedRef, setCopiedRef] = useState(false);

  // Add real transaction modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txTitle, setTxTitle] = useState('');
  const [txSubtitle, setTxSubtitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState<TransactionItem['category']>('payment');
  const [txType, setTxType] = useState<TransactionItem['type']>('debit');
  const [txStatus, setTxStatus] = useState<TransactionItem['status']>('completed');
  const [txProvider, setTxProvider] = useState<TransactionItem['provider']>('Vodacom M-Pesa');
  const [txRef, setTxRef] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const openCreateModal = () => {
    setEditingTx(null);
    setTxTitle('');
    setTxSubtitle('');
    setTxAmount('');
    setTxCategory('payment');
    setTxType('debit');
    setTxStatus('completed');
    setTxProvider('Vodacom M-Pesa');
    setTxRef('');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (tx: TransactionItem) => {
    setEditingTx(tx);
    setTxTitle(tx.title);
    setTxSubtitle(tx.subtitle);
    setTxAmount(String(tx.amount));
    setTxCategory(tx.category);
    setTxType(tx.type);
    setTxStatus(tx.status);
    setTxProvider(tx.provider);
    setTxRef(tx.reference);
    setFormError(null);
    setSelectedTx(null);
    setIsAddModalOpen(true);
  };

  const handleCreateOrUpdateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = txTitle.trim();
    const numericAmount = parseInt(txAmount.replace(/\D/g, ''), 10);

    if (!cleanTitle) {
      setFormError(
        lang === 'sw' ? 'Tafadhali weka jina la mpokeaji au huduma.' : 'Please enter recipient or title.'
      );
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setFormError(
        lang === 'sw' ? 'Tafadhali ingiza kiasi halali (TZS).' : 'Please enter a valid TZS amount.'
      );
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const savedItem: TransactionItem = {
      id: editingTx ? editingTx.id : `tx-${Date.now()}`,
      title: cleanTitle,
      subtitle: txSubtitle.trim() || `${txProvider} • ${txCategory}`,
      category: txCategory,
      amount: numericAmount,
      currency: 'TZS',
      type: txType,
      status: txStatus,
      date: editingTx ? editingTx.date : dateStr,
      time: editingTx ? editingTx.time : timeStr,
      provider: txProvider,
      reference: txRef.trim() || (editingTx ? editingTx.reference : `99P-${Date.now().toString().slice(-6)}`),
    };

    if (editingTx && onUpdateTransaction) {
      onUpdateTransaction(savedItem);
    } else {
      onAddTransaction(savedItem);
    }
    setEditingTx(null);
    setTxTitle('');
    setTxSubtitle('');
    setTxAmount('');
    setTxRef('');
    setFormError(null);
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (category: TransactionItem['category'], title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('fuel') || lower.includes('mafuta') || lower.includes('petrol')) {
      return Fuel;
    }
    if (lower.includes('luku') || lower.includes('umeme') || lower.includes('tanesco')) {
      return Zap;
    }
    if (lower.includes('shop') || lower.includes('supermarket') || lower.includes('duka')) {
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
      <div className="flex items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <History className="w-4 h-4 text-[#F4C95D] shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {lang === 'sw' ? 'Miamala Yako' : 'Your Transactions'}
          </h3>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#06271D] border border-[#00B887]/40 hover:border-[#00B887] text-[10px] font-bold text-[#00B887] cursor-pointer shrink-0"
        >
          <Plus className="w-3 h-3 stroke-[2.8]" />
          <span>{lang === 'sw' ? 'Rekodi Muamala' : 'Record'}</span>
        </button>
      </div>

      {/* Status Filter Row (only shown when user has transactions) */}
      {transactions.length > 0 && (
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
      )}

      {/* Transaction List / Clean Empty State */}
      <div className="rounded-2xl bg-[#06271D] border border-[#24473A] divide-y divide-[#24473A]/60 overflow-hidden shadow-lg">
        {transactions.length === 0 ? (
          <div className="p-6 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#F4C95D] mx-auto">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {lang === 'sw' ? 'Hakuna Miamala Iliyorekodiwa' : 'No Recorded Transactions Yet'}
              </h4>
              <p className="text-[11px] text-[#B7C8C1] mt-0.5">
                {lang === 'sw'
                  ? 'Rekodi risiti zako za malipo au uhamisho halisi kwa kubonyeza kitufe hapo juu.'
                  : 'Keep track of your real payments, bills, and transfers right here.'}
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00B887]/15 border border-[#00B887]/40 text-xs font-bold text-[#00B887] cursor-pointer hover:bg-[#00B887]/25"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'sw' ? 'Rekodi Muamala Mpya' : 'Record First Transaction'}</span>
            </button>
          </div>
        ) : filteredTx.length === 0 ? (
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
                    <p className="text-[10px] text-[#B7C8C1] truncate mt-0.5">{tx.subtitle}</p>
                    <div className="flex items-center gap-2 mt-1 sm:hidden">
                      {getStatusBadge(tx.status)}
                      <span className="text-[10px] text-[#B7C8C1]/70">
                        {tx.date}, {tx.time}
                      </span>
                    </div>
                  </div>
                </div>

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

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-[#24473A]">
              <h4 className="font-bold text-sm text-white">
                {editingTx
                  ? lang === 'sw'
                    ? 'Hariri Muamala'
                    : 'Edit Transaction'
                  : lang === 'sw'
                  ? 'Rekodi Muamala Mpya'
                  : 'Record Transaction'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingTx(null);
                }}
                aria-label="Close record transaction"
                className="p-1.5 rounded-lg bg-[#0B211B] border border-[#24473A] text-[#B7C8C1] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Mpokeaji / Huduma' : 'Merchant / Recipient'}
                </label>
                <input
                  type="text"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder={lang === 'sw' ? 'Mf. Malipo ya LUKU / Duka' : 'e.g. Electricity Bill'}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Kiasi (TZS)' : 'Amount (TZS)'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value.replace(/\D/g, ''))}
                    placeholder="50000"
                    className="w-full h-10 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white font-mono focus:outline-none focus:border-[#00B887]"
                  />
                </div>
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Aina' : 'Flow'}
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionItem['type'])}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                  >
                    <option value="debit">{lang === 'sw' ? 'Matumizi (-)' : 'Expense (-)'}</option>
                    <option value="credit">{lang === 'sw' ? 'Mapato (+)' : 'Income (+)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Mtandao / Benki' : 'Channel'}
                  </label>
                  <select
                    value={txProvider}
                    onChange={(e) => setTxProvider(e.target.value as TransactionItem['provider'])}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                  >
                    <option value="Vodacom M-Pesa">Vodacom M-Pesa</option>
                    <option value="Tigo Pesa">Tigo Pesa</option>
                    <option value="Airtel Money">Airtel Money</option>
                    <option value="Halopesa">Halopesa</option>
                    <option value="CRDB Bank">CRDB Bank</option>
                    <option value="NMB Bank">NMB Bank</option>
                    <option value="Other">{lang === 'sw' ? 'Nyingine' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Hali' : 'Status'}
                  </label>
                  <select
                    value={txStatus}
                    onChange={(e) => setTxStatus(e.target.value as TransactionItem['status'])}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                  >
                    <option value="completed">{lang === 'sw' ? 'Imekamilika' : 'Completed'}</option>
                    <option value="pending">{lang === 'sw' ? 'Inashughulikiwa' : 'Pending'}</option>
                    <option value="failed">{lang === 'sw' ? 'Imeshindikana' : 'Failed'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Kategoria' : 'Category'}
                  </label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value as TransactionItem['category'])}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                  >
                    <option value="payment">{lang === 'sw' ? 'Malipo' : 'Payment'}</option>
                    <option value="transfer">{lang === 'sw' ? 'Uhamisho' : 'Transfer'}</option>
                    <option value="topup">{lang === 'sw' ? 'Kuweka Pesa' : 'Deposit'}</option>
                    <option value="cashout">{lang === 'sw' ? 'Kutoa Pesa' : 'Cashout'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Namba ya Risiti (Hiari)' : 'Reference (Opt.)'}
                  </label>
                  <input
                    type="text"
                    value={txRef}
                    onChange={(e) => setTxRef(e.target.value)}
                    placeholder="Ref #"
                    className="w-full h-10 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white font-mono focus:outline-none focus:border-[#00B887]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Maelezo Mafupi (Hiari)' : 'Notes (Optional)'}
                </label>
                <input
                  type="text"
                  value={txSubtitle}
                  onChange={(e) => setTxSubtitle(e.target.value)}
                  placeholder={lang === 'sw' ? 'Maelezo ya risiti...' : 'Receipt note...'}
                  className="w-full h-10 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white focus:outline-none focus:border-[#00B887]"
                />
              </div>

              {formError && <p className="text-[#FF6B6B] text-[11px]">{formError}</p>}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs cursor-pointer"
              >
                {editingTx
                  ? lang === 'sw'
                    ? 'Hifadhi Mabadiliko'
                    : 'Save Changes'
                  : lang === 'sw'
                  ? 'Hifadhi Muamala'
                  : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

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

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {onUpdateTransaction && (
                  <button
                    type="button"
                    onClick={() => openEditModal(selectedTx)}
                    className="py-2.5 rounded-xl bg-[#00B887]/15 hover:bg-[#00B887]/25 border border-[#00B887]/40 text-xs font-bold text-[#00B887] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>{lang === 'sw' ? 'Hariri' : 'Edit'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onDeleteTransaction(selectedTx.id);
                    setSelectedTx(null);
                  }}
                  className={`py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-xs font-bold text-rose-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                    onUpdateTransaction ? '' : 'col-span-2'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{lang === 'sw' ? 'Futa' : 'Delete'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="w-full py-2.5 rounded-xl bg-[#0B211B] hover:bg-[#03120E] border border-[#24473A] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {lang === 'sw' ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
