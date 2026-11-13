import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  ShieldCheck,
  HeartPulse,
  AlertCircle,
  Plus,
  CheckCircle2,
  ScanLine,
} from 'lucide-react';
import {
  BankCardItem,
  BankInstitution,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
} from '../../data/walletData';
import {
  CardBrand,
  CARD_BRAND_LIST,
  detectCardBrand,
  formatCardNumber,
  maskCardNumber,
  luhnCheck,
  getCardBrandMeta,
} from '../../utils/cardDetection';
import { CardBrandLogo } from './CardBrandLogo';
import { Language } from '../../i18n/translations';

export type AddModalTab = 'bank' | 'momo' | 'id' | 'insurance';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBankCard: (card: BankCardItem) => void;
  onAddMobileMoney: (wallet: MobileMoneyItem) => void;
  onAddIdentity: (doc: IdentityDocItem) => void;
  onAddInsurance: (ins: InsuranceDocItem) => void;
  lang?: Language;
  initialTab?: AddModalTab;
}

export const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onAddBankCard,
  onAddMobileMoney,
  onAddIdentity,
  onAddInsurance,
  lang = 'sw',
  initialTab = 'bank',
}) => {
  const [activeTab, setActiveTab] = useState<AddModalTab>(initialTab);

  // Sync tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
    }
  }, [isOpen, initialTab]);

  // Bank Form States
  const [bankName, setBankName] = useState<BankInstitution>('CRDB Bank');
  const [customBankName, setCustomBankName] = useState('');
  const [cardType, setCardType] = useState<CardBrand>('Card');
  const [isManualBrandOverride, setIsManualBrandOverride] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');

  // Mobile Money Form States
  const [momoProvider, setMomoProvider] = useState<
    'Vodacom M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Halopesa'
  >('Vodacom M-Pesa');
  const [momoName, setMomoName] = useState('');
  const [momoPhone, setMomoPhone] = useState('');

  // ID Form States
  const [idType, setIdType] = useState<'NIDA National ID' | "Driver's License" | "Voter's ID">(
    'NIDA National ID'
  );
  const [idNumber, setIdNumber] = useState('');
  const [idFullName, setIdFullName] = useState('');

  // Insurance Form States
  const [insProvider, setInsProvider] = useState<
    'NHIF' | 'Jubilee Insurance' | 'Strategis Insurance' | 'AAR'
  >('NHIF');
  const [insNumber, setInsNumber] = useState('');
  const [insMember, setInsMember] = useState('');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const digitsOnly = cardNumber.replace(/\D/g, '');
  const detectedBrand = detectCardBrand(digitsOnly);
  const activeBrand: CardBrand = isManualBrandOverride ? cardType : detectedBrand;
  const brandMeta = getCardBrandMeta(activeBrand);
  const isLuhnValid = digitsOnly.length >= 12 ? luhnCheck(digitsOnly) : null;

  // Live BIN detection + formatting as user types
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const autoBrand = detectCardBrand(rawDigits);
    const effectiveBrand = isManualBrandOverride && rawDigits.length > 0 ? cardType : autoBrand;

    if (!isManualBrandOverride) {
      setCardType(autoBrand);
    }
    if (rawDigits.length === 0) {
      setIsManualBrandOverride(false);
      setCardType('Card');
    }

    const formatted = formatCardNumber(rawDigits, effectiveBrand);
    setCardNumber(formatted);
    if (error) setError(null);
  };

  const handleManualBrandSelect = (brand: CardBrand) => {
    setCardType(brand);
    setIsManualBrandOverride(true);
    if (digitsOnly.length > 0) {
      setCardNumber(formatCardNumber(digitsOnly, brand));
    }
  };

  // Real-time Expiry Formatter (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
    if (error) setError(null);
  };

  const resetBankForm = () => {
    setCardholderName('');
    setCardNumber('');
    setExpiry('');
    setCustomBankName('');
    setCardType('Card');
    setIsManualBrandOverride(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'bank') {
      const cleanName = cardholderName.trim();
      if (!cleanName) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza jina la mwenye kadi (Cardholder Name).'
            : 'Please enter the cardholder name.'
        );
        return;
      }

      if (bankName === 'Other Bank' && !customBankName.trim()) {
        setError(
          lang === 'sw'
            ? 'Tafadhali andika jina la benki yako.'
            : 'Please enter your bank name.'
        );
        return;
      }

      const minReqDigits = activeBrand === 'Diners Club' ? 14 : activeBrand === 'American Express' ? 15 : 12;
      if (digitsOnly.length < minReqDigits) {
        setError(
          lang === 'sw'
            ? `Namba ya kadi ya ${activeBrand === 'Card' ? 'benki' : activeBrand} lazima iwe na angalau tarakimu ${minReqDigits}.`
            : `${activeBrand === 'Card' ? 'Card' : activeBrand} number must be at least ${minReqDigits} digits.`
        );
        return;
      }

      let cleanExpiry = expiry.trim();
      if (!cleanExpiry) {
        cleanExpiry = '12/29';
      } else {
        const expDigits = cleanExpiry.replace(/\D/g, '');
        if (expDigits.length >= 2) {
          const month = parseInt(expDigits.slice(0, 2), 10);
          if (month < 1 || month > 12) {
            setError(
              lang === 'sw'
                ? 'Mwezi wa kuisha (MM) lazima uwe kati ya 01 na 12.'
                : 'Expiry month (MM) must be between 01 and 12.'
            );
            return;
          }
        }
        if (!cleanExpiry.includes('/')) {
          cleanExpiry =
            expDigits.length === 4 ? `${expDigits.slice(0, 2)}/${expDigits.slice(2)}` : `${expDigits}/29`;
        }
      }

      const finalBrand: CardBrand =
        isManualBrandOverride ? cardType : detectCardBrand(digitsOnly);
      const masked = maskCardNumber(digitsOnly, finalBrand);
      const formattedFull = formatCardNumber(digitsOnly, finalBrand);

      const schemeMap: Record<BankInstitution, BankCardItem['colorScheme']> = {
        'CRDB Bank': 'emerald',
        'NMB Bank': 'gold',
        Stanbic: 'navy',
        NBC: 'crimson',
        'Standard Chartered': 'darkEmerald',
        'Equity Bank': 'gold',
        'Absa Bank': 'crimson',
        'DTB Tanzania': 'navy',
        'Exim Bank': 'darkEmerald',
        'KCB Bank': 'emerald',
        'Other Bank': 'slate',
      };

      const tierLabel =
        bankName === 'CRDB Bank'
          ? `TemboCard ${finalBrand}`
          : bankName === 'NMB Bank'
          ? `NMB ${finalBrand}`
          : finalBrand === 'American Express'
          ? 'Platinum Charge Card'
          : `${finalBrand} Debit / Credit`;

      onAddBankCard({
        id: `card-${Date.now()}`,
        bankName,
        customBankName: bankName === 'Other Bank' ? customBankName.trim() : undefined,
        cardType: finalBrand,
        tier: tierLabel,
        cardholderName: cleanName.toUpperCase(),
        maskedNumber: masked,
        fullNumber: formattedFull,
        expiryDate: cleanExpiry,
        colorScheme: schemeMap[bankName] || 'darkEmerald',
        isDefault: true,
      });

      resetBankForm();
      onClose();
    } else if (activeTab === 'momo') {
      const cleanName = momoName.trim();
      const cleanPhone = momoPhone.trim();
      if (!cleanName) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza jina la mwenye namba.'
            : 'Please enter the registered account name.'
        );
        return;
      }
      if (cleanPhone.replace(/\D/g, '').length < 9) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza namba kamili ya simu (mf. 0744 123 456).'
            : 'Please enter a valid phone number (e.g. 0744 123 456).'
        );
        return;
      }

      const ussdMap: Record<string, string> = {
        'Vodacom M-Pesa': '*150*00#',
        'Tigo Pesa': '*150*01#',
        'Airtel Money': '*150*60#',
        Halopesa: '*150*88#',
      };

      const colorMap: Record<string, string> = {
        'Vodacom M-Pesa': '#E60000',
        'Tigo Pesa': '#0072BC',
        'Airtel Money': '#FF0000',
        Halopesa: '#FF6F00',
      };

      onAddMobileMoney({
        id: `momo-${Date.now()}`,
        provider: momoProvider,
        accountHolder: cleanName,
        phoneNumber: cleanPhone.startsWith('+')
          ? cleanPhone
          : `+255 ${cleanPhone.replace(/^0/, '')}`,
        ussdCode: ussdMap[momoProvider] || '*150#',
        brandColor: colorMap[momoProvider] || '#00B887',
        isPrimary: true,
      });

      setMomoName('');
      setMomoPhone('');
      onClose();
    } else if (activeTab === 'id') {
      const cleanName = idFullName.trim();
      const cleanNumber = idNumber.trim();
      if (!cleanName || !cleanNumber) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza jina kamili na namba ya kitambulisho.'
            : 'Please enter full name and ID number.'
        );
        return;
      }

      onAddIdentity({
        id: `id-${Date.now()}`,
        docType: idType,
        fullName: cleanName.toUpperCase(),
        documentNumber: cleanNumber,
        issueDate: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
        issuingAuthority:
          idType === 'NIDA National ID'
            ? 'NIDA Tanzania'
            : idType === "Driver's License"
            ? 'TRA / LATRA'
            : 'NEC Tanzania',
      });

      setIdFullName('');
      setIdNumber('');
      onClose();
    } else if (activeTab === 'insurance') {
      const cleanNumber = insNumber.trim();
      const cleanMember = insMember.trim();
      if (!cleanNumber || !cleanMember) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza namba ya kadi ya bima na jina la mwanachama.'
            : 'Please enter membership number and member name.'
        );
        return;
      }

      onAddInsurance({
        id: `ins-${Date.now()}`,
        provider: insProvider,
        schemeName: lang === 'sw' ? 'Bima ya Afya (Personal Cover)' : 'Health Insurance Cover',
        membershipNumber: cleanNumber,
        beneficiaryName: cleanMember.toUpperCase(),
        status: 'Active',
      });

      setInsNumber('');
      setInsMember('');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#06271D] border border-[#24473A] shadow-2xl p-5 text-white overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#24473A]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00B887]/20 border border-[#00B887]/40 flex items-center justify-center text-[#F4C95D]">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">
                {lang === 'sw' ? 'Ongeza Kadi au Hati' : 'Add Card or Document'}
              </h3>
              <p className="text-[10px] text-[#B7C8C1]">
                {lang === 'sw'
                  ? 'Utambuzi wa moja kwa moja wa Visa, Mastercard n.k.'
                  : 'Auto-detects Visa, Mastercard, Amex & more'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-[#B7C8C1] hover:text-white bg-[#0B211B] border border-[#24473A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#0B211B] rounded-xl my-3 border border-[#24473A]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('bank');
              setError(null);
            }}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'bank' ? 'bg-[#00B887] text-[#03120E] shadow-sm' : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Benki' : 'Bank'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('momo');
              setError(null);
            }}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'momo' ? 'bg-[#00B887] text-[#03120E] shadow-sm' : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Pochi' : 'MoMo'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('id');
              setError(null);
            }}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'id' ? 'bg-[#00B887] text-[#03120E] shadow-sm' : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ID/NIDA</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('insurance');
              setError(null);
            }}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'insurance'
                ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>NHIF</span>
          </button>
        </div>

        {/* Security Rule Callout */}
        <div className="p-2.5 rounded-xl bg-[#0B211B] border border-[#24473A] mb-3 text-[11px] text-[#B7C8C1] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00B887] shrink-0" />
          <span>
            {lang === 'sw'
              ? '99Pay haihifadhi PIN ya ATM wala CVV. Kadi inahifadhiwa kwenye kifaa chako.'
              : '99Pay never stores ATM PINs or CVV numbers. Cards stay encrypted locally.'}
          </span>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto space-y-3 flex-1 pr-0.5">
          {activeTab === 'bank' && (
            <>
              {/* Live Card Brand Detection Preview Bar */}
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0B211B] to-[#03120E] border border-[#24473A] flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <ScanLine className="w-3.5 h-3.5 text-[#00B887]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7C8C1]">
                      {isManualBrandOverride
                        ? lang === 'sw'
                          ? 'Mtandao Umechaguliwa'
                          : 'Selected Network'
                        : lang === 'sw'
                        ? 'Utambuzi wa Kadi (Auto)'
                        : 'Auto-Detected Network'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-extrabold text-white">
                      {activeBrand === 'Card'
                        ? lang === 'sw'
                          ? 'Ingiza namba kutambua...'
                          : 'Type number to detect...'
                        : activeBrand}
                    </span>
                    {isLuhnValid !== null && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          isLuhnValid
                            ? 'bg-[#00B887]/15 border-[#00B887]/40 text-[#00B887]'
                            : 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        {isLuhnValid
                          ? lang === 'sw'
                            ? 'Namba Sahihi'
                            : 'Valid Checksum'
                          : lang === 'sw'
                          ? 'Namba ya Majaribio'
                          : 'Test / Custom'}
                      </span>
                    )}
                  </div>
                </div>

                <CardBrandLogo brand={activeBrand} size="md" />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Benki Yako (Bank)' : 'Issuing Bank'}
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value as BankInstitution)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                >
                  <option value="CRDB Bank">CRDB Bank (TemboCard / Tanzanite)</option>
                  <option value="NMB Bank">NMB Bank</option>
                  <option value="Stanbic">Stanbic Bank</option>
                  <option value="NBC">NBC Bank</option>
                  <option value="Standard Chartered">Standard Chartered</option>
                  <option value="Equity Bank">Equity Bank Tanzania</option>
                  <option value="Absa Bank">Absa Bank Tanzania</option>
                  <option value="DTB Tanzania">DTB Tanzania</option>
                  <option value="Exim Bank">Exim Bank Tanzania</option>
                  <option value="KCB Bank">KCB Bank Tanzania</option>
                  <option value="Other Bank">
                    {lang === 'sw' ? 'Benki Nyingine (Andika Jina)' : 'Other Bank (Custom)'}
                  </option>
                </select>
              </div>

              {bankName === 'Other Bank' && (
                <div>
                  <label className="text-xs text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Jina la Benki' : 'Custom Bank Name'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'sw' ? 'Mf. Azania Bank / PBZ' : 'e.g. Azania Bank / PBZ'}
                    value={customBankName}
                    onChange={(e) => {
                      setCustomBankName(e.target.value);
                      if (error) setError(null);
                    }}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Jina Kamili la Mwenye Kadi' : 'Cardholder Full Name'}
                </label>
                <input
                  type="text"
                  placeholder="Mf. JOSEPH B. MLAY"
                  value={cardholderName}
                  onChange={(e) => {
                    setCardholderName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-3">
                  <label className="text-xs text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Namba ya Kadi' : 'Card Number'}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={23}
                    placeholder={
                      activeBrand === 'American Express'
                        ? '3782 822463 10005'
                        : '4192 0000 0000 1234'
                    }
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-[#B7C8C1] block mb-1">MM/YY</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="08/29"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                  />
                </div>
              </div>

              {/* Manual Brand Override Strip (if user wants to override auto-detection) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] text-[#B7C8C1]">
                    {lang === 'sw'
                      ? 'Mtandao wa Kadi (Hujitambua ukianza kuandika)'
                      : 'Card Network (Auto-detected from BIN)'}
                  </label>
                  {isManualBrandOverride && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsManualBrandOverride(false);
                        setCardType(detectedBrand);
                      }}
                      className="text-[10px] text-[#00B887] font-bold hover:underline cursor-pointer"
                    >
                      {lang === 'sw' ? 'Tumia Auto' : 'Use Auto'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {CARD_BRAND_LIST.map((b) => {
                    const isSelected = activeBrand === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => handleManualBrandSelect(b)}
                        className={`p-1 rounded-xl border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#00B887]/20 border-[#00B887] ring-1 ring-[#00B887]'
                            : 'bg-[#0B211B] border-[#24473A] opacity-75 hover:opacity-100'
                        }`}
                        title={b}
                      >
                        <CardBrandLogo brand={b} size="sm" />
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-[#B7C8C1]/60 block mt-0.5">
                  BIN range: {brandMeta.minLength === brandMeta.maxLength ? `${brandMeta.minLength}` : `${brandMeta.minLength}-${brandMeta.maxLength}`}{' '}
                  {lang === 'sw' ? 'tarakimu' : 'digits'}
                </span>
              </div>
            </>
          )}

          {activeTab === 'momo' && (
            <>
              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Mtandao wa Simu' : 'Mobile Operator'}
                </label>
                <select
                  value={momoProvider}
                  onChange={(e) => setMomoProvider(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                >
                  <option value="Vodacom M-Pesa">Vodacom M-Pesa (*150*00#)</option>
                  <option value="Tigo Pesa">Tigo Pesa (*150*01#)</option>
                  <option value="Airtel Money">Airtel Money (*150*60#)</option>
                  <option value="Halopesa">Halopesa (*150*88#)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Jina la Usajili wa Namba' : 'Registered Account Name'}
                </label>
                <input
                  type="text"
                  placeholder="Mf. Joseph Benedicto Mlay"
                  value={momoName}
                  onChange={(e) => {
                    setMomoName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Namba ya Simu' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  placeholder="Mf. 0744 123 456"
                  value={momoPhone}
                  onChange={(e) => {
                    setMomoPhone(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                />
              </div>
            </>
          )}

          {activeTab === 'id' && (
            <>
              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Aina ya Kitambulisho' : 'Document Type'}
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                >
                  <option value="NIDA National ID">Kitambulisho cha NIDA</option>
                  <option value="Driver's License">Leseni ya Udereva</option>
                  <option value="Voter's ID">Kadi ya Mpiga Kura</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Jina Kamili (Kama lilivyo kwenye Hati)' : 'Full Legal Name'}
                </label>
                <input
                  type="text"
                  placeholder="Mf. JOSEPH BENEDICTO MLAY"
                  value={idFullName}
                  onChange={(e) => {
                    setIdFullName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Namba ya Kitambulisho (NIN au Leseni)' : 'Document / NIN Number'}
                </label>
                <input
                  type="text"
                  placeholder="Mf. 19920815-14102-00001-26"
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                />
              </div>
            </>
          )}

          {activeTab === 'insurance' && (
            <>
              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Kampuni ya Bima' : 'Insurance Provider'}
                </label>
                <select
                  value={insProvider}
                  onChange={(e) => setInsProvider(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                >
                  <option value="NHIF">NHIF (Bima ya Afya ya Taifa)</option>
                  <option value="Jubilee Insurance">Jubilee Insurance</option>
                  <option value="Strategis Insurance">Strategis Insurance</option>
                  <option value="AAR">AAR Healthcare</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Jina Kamili la Mwanachama' : 'Beneficiary Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'sw' ? 'Jina la mwenye kadi' : 'Cardholder name'}
                  value={insMember}
                  onChange={(e) => {
                    setInsMember(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Namba ya Uanachama (Membership #)' : 'Membership Number'}
                </label>
                <input
                  type="text"
                  placeholder="Mf. 10-2948194-0"
                  value={insNumber}
                  onChange={(e) => {
                    setInsNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-[#FF6B6B] bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F8D978] via-[#F4C95D] to-[#E6A92D] text-[#03120E] font-bold text-sm tracking-tight active:scale-[0.99] transition-transform cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>
                {lang === 'sw' ? 'Hifadhi kwenye 99Pay Vault' : 'Save to 99Pay Vault'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
