import React, { useState, useEffect } from 'react';
import { X, Store, Plus, AlertCircle, Check } from 'lucide-react';
import { LipaMerchantItem } from '../../data/walletData';
import { Language, TRANSLATIONS } from '../../i18n/translations';

interface AddLipaNambaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: LipaMerchantItem) => void;
  onUpdate?: (item: LipaMerchantItem) => void;
  editingMerchant?: LipaMerchantItem | null;
  lang: Language;
}

export const AddLipaNambaModal: React.FC<AddLipaNambaModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingMerchant = null,
  lang,
}) => {
  const t = TRANSLATIONS[lang];

  const [merchantName, setMerchantName] = useState('');
  const [number, setNumber] = useState('');
  const [provider, setProvider] = useState<LipaMerchantItem['provider']>('Vodacom M-Pesa');
  const [category, setCategory] = useState<LipaMerchantItem['category']>('Mafuta');
  const [merchantType, setMerchantType] = useState<LipaMerchantItem['merchantType']>('Till');
  const [branchOrNotes, setBranchOrNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingMerchant) {
        setMerchantName(editingMerchant.merchantName);
        setNumber(editingMerchant.number);
        setProvider(editingMerchant.provider);
        setCategory(editingMerchant.category);
        setMerchantType(editingMerchant.merchantType);
        setBranchOrNotes(editingMerchant.branchOrNotes || '');
      } else {
        setMerchantName('');
        setNumber('');
        setProvider('Vodacom M-Pesa');
        setCategory('Mafuta');
        setMerchantType('Till');
        setBranchOrNotes('');
      }
      setError('');
    }
  }, [isOpen, editingMerchant]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantName.trim()) {
      setError('Tafadhali ingiza jina la duka au biashara');
      return;
    }
    const cleanNumber = number.replace(/\s+/g, '');
    if (!cleanNumber || cleanNumber.length < 5) {
      setError('Namba ya Till / Lipa Namba lazima iwe na angalau tarakimu 5');
      return;
    }

    let prefix = `*150*00*1*${cleanNumber}#`;
    if (provider === 'Tigo Pesa') {
      prefix = `*150*01*4*${cleanNumber}#`;
    } else if (provider === 'Airtel Money') {
      prefix = `*150*60*5*${cleanNumber}#`;
    }

    const savedItem: LipaMerchantItem = {
      id: editingMerchant ? editingMerchant.id : `lipa-${Date.now()}`,
      merchantName: merchantName.trim(),
      merchantType,
      number: cleanNumber,
      provider,
      category,
      branchOrNotes: branchOrNotes.trim() || undefined,
      ussdPrefix: prefix,
      favorite: editingMerchant ? editingMerchant.favorite : true,
    };

    if (editingMerchant && onUpdate) {
      onUpdate(savedItem);
    } else {
      onAdd(savedItem);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#06271D] border border-[#24473A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#24473A] flex items-center justify-between bg-[#03120E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D]">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              {editingMerchant
                ? lang === 'sw'
                  ? 'Hariri Lipa Namba'
                  : 'Edit Lipa Namba'
                : t.addNewLipa}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0B211B] border border-[#24473A] flex items-center justify-center text-[#B7C8C1] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[#B7C8C1] font-semibold mb-1">
              {t.merchantName} *
            </label>
            <input
              type="text"
              required
              value={merchantName}
              onChange={(e) => {
                setMerchantName(e.target.value);
                setError('');
              }}
              placeholder={lang === 'sw' ? 'Andika jina la duka au biashara' : 'Enter shop or business name'}
              className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00B887]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-[#B7C8C1] font-semibold mb-1">
                {t.tillNumber} *
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder={lang === 'sw' ? 'Namba ya Till / Paybill' : 'Till / Paybill #'}
                className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-3.5 py-2.5 text-white font-mono text-base font-bold focus:outline-none focus:border-[#00B887]"
              />
            </div>

            <div>
              <label className="block text-[#B7C8C1] font-semibold mb-1">
                {lang === 'sw' ? 'Aina' : 'Type'}
              </label>
              <select
                value={merchantType}
                onChange={(e) => setMerchantType(e.target.value as LipaMerchantItem['merchantType'])}
                className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-2.5 py-3 text-white focus:outline-none focus:border-[#00B887]"
              >
                <option value="Till">Till</option>
                <option value="Paybill">Paybill</option>
                <option value="Masterpass">Masterpass</option>
                <option value="Government">GePG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#B7C8C1] font-semibold mb-1">
                Mtandao wa Pochi
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00B887]"
              >
                <option value="Vodacom M-Pesa">Vodacom M-Pesa</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Selcom">Selcom Masterpass</option>
                <option value="GePG">GePG Serikali</option>
              </select>
            </div>

            <div>
              <label className="block text-[#B7C8C1] font-semibold mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#00B887]"
              >
                <option value="Mafuta">Mafuta (Fuel)</option>
                <option value="Supermarket">Supermarket</option>
                <option value="Dawa & Afya">Dawa & Afya (Pharmacy)</option>
                <option value="Kodi & LUKU">Kodi & LUKU (Bills)</option>
                <option value="Mgahawa">Mgahawa (Restaurant)</option>
                <option value="Nyingine">Nyingine (Other)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#B7C8C1] font-semibold mb-1">
              Tawi au Maelezo ya Ziada (Hiari)
            </label>
            <input
              type="text"
              value={branchOrNotes}
              onChange={(e) => setBranchOrNotes(e.target.value)}
              placeholder="Mf. Tawi au maelezo mafupi"
              className="w-full bg-[#0B211B] border border-[#24473A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#00B887]"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#00B887] text-[#03120E] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
            >
              {editingMerchant ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{lang === 'sw' ? 'Hifadhi Mabadiliko' : 'Save Changes'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Hifadhi Lipa Namba</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-[#0B211B] border border-[#24473A] text-xs text-[#B7C8C1] cursor-pointer"
            >
              Ghairi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
