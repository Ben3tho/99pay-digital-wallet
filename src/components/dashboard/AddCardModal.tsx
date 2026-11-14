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
  Award,
} from 'lucide-react';
import {
  BankCardItem,
  BankInstitution,
  MobileMoneyItem,
  IdentityDocItem,
  InsuranceDocItem,
  PensionLoyaltyItem,
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
import { isEncryptedEnvelope } from '../../utils/vaultSecurity';

export type AddModalTab = 'bank' | 'momo' | 'id' | 'insurance' | 'pension';

export type EditingCardItem =
  | { type: 'bank'; item: BankCardItem }
  | { type: 'momo'; item: MobileMoneyItem }
  | { type: 'id'; item: IdentityDocItem }
  | { type: 'insurance'; item: InsuranceDocItem }
  | { type: 'pension'; item: PensionLoyaltyItem };

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBankCard: (card: BankCardItem) => void;
  onAddMobileMoney: (wallet: MobileMoneyItem) => void;
  onAddIdentity: (doc: IdentityDocItem) => void;
  onAddInsurance: (ins: InsuranceDocItem) => void;
  onAddPension: (pen: PensionLoyaltyItem) => void;
  onUpdateBankCard?: (card: BankCardItem) => void;
  onUpdateMobileMoney?: (wallet: MobileMoneyItem) => void;
  onUpdateIdentity?: (doc: IdentityDocItem) => void;
  onUpdateInsurance?: (ins: InsuranceDocItem) => void;
  onUpdatePension?: (pen: PensionLoyaltyItem) => void;
  editingItem?: EditingCardItem | null;
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
  onAddPension,
  onUpdateBankCard,
  onUpdateMobileMoney,
  onUpdateIdentity,
  onUpdateInsurance,
  onUpdatePension,
  editingItem = null,
  lang = 'sw',
  initialTab = 'bank',
}) => {
  const [activeTab, setActiveTab] = useState<AddModalTab>(initialTab);

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
  const [idExpiryDate, setIdExpiryDate] = useState('');

  // Insurance Form States
  const [insProvider, setInsProvider] = useState<
    'NHIF' | 'Jubilee Insurance' | 'Strategis Insurance' | 'AAR'
  >('NHIF');
  const [insNumber, setInsNumber] = useState('');
  const [insMember, setInsMember] = useState('');

  // Pension / Loyalty Form States
  const [penType, setPenType] = useState<PensionLoyaltyItem['categoryType']>('NSSF');
  const [penTitle, setPenTitle] = useState('');
  const [penNumber, setPenNumber] = useState('');
  const [penHolder, setPenHolder] = useState('');
  const [penOrg, setPenOrg] = useState('');
  const [penStatus, setPenStatus] = useState('');

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (!editingItem) {
      setActiveTab(initialTab);
      setBankName('CRDB Bank');
      setCustomBankName('');
      setCardType('Card');
      setIsManualBrandOverride(false);
      setCardholderName('');
      setCardNumber('');
      setExpiry('');
      setMomoProvider('Vodacom M-Pesa');
      setMomoName('');
      setMomoPhone('');
      setIdType('NIDA National ID');
      setIdNumber('');
      setIdFullName('');
      setIdExpiryDate('');
      setInsProvider('NHIF');
      setInsNumber('');
      setInsMember('');
      setPenType('NSSF');
      setPenTitle('');
      setPenNumber('');
      setPenHolder('');
      setPenOrg('');
      setPenStatus('');
      return;
    }

    setActiveTab(editingItem.type);
    if (editingItem.type === 'bank') {
      const c = editingItem.item;
      setBankName(c.bankName);
      setCustomBankName(c.customBankName || '');
      setCardType(c.cardType);
      setIsManualBrandOverride(true);
      setCardholderName(c.cardholderName);
      const rawFull = c.fullNumber && !isEncryptedEnvelope(c.fullNumber) ? c.fullNumber : '';
      setCardNumber(rawFull);
      setExpiry(c.expiryDate);
    } else if (editingItem.type === 'momo') {
      const m = editingItem.item;
      setMomoProvider(m.provider);
      setMomoName(m.accountHolder);
      setMomoPhone(m.phoneNumber);
    } else if (editingItem.type === 'id') {
      const d = editingItem.item;
      setIdType(d.docType);
      setIdFullName(d.fullName);
      const rawDoc = !isEncryptedEnvelope(d.documentNumber) ? d.documentNumber : '';
      setIdNumber(rawDoc);
      setIdExpiryDate(d.expiryDate || '');
    } else if (editingItem.type === 'insurance') {
      const ins = editingItem.item;
      setInsProvider(ins.provider);
      setInsMember(ins.beneficiaryName);
      setInsNumber(ins.membershipNumber);
    } else if (editingItem.type === 'pension') {
      const p = editingItem.item;
      setPenType(p.categoryType);
      setPenTitle(p.title);
      setPenNumber(p.membershipNumber);
      setPenHolder(p.holderName);
      setPenOrg(p.organization);
      setPenStatus(p.expiryOrStatus || '');
    }
  }, [isOpen, initialTab, editingItem]);

  if (!isOpen) return null;

  const digitsOnly = cardNumber.replace(/\D/g, '');
  const detectedBrand = detectCardBrand(digitsOnly);
  const activeBrand: CardBrand = isManualBrandOverride ? cardType : detectedBrand;
  const brandMeta = getCardBrandMeta(activeBrand);
  const isLuhnValid = digitsOnly.length >= 12 ? luhnCheck(digitsOnly) : null;

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

      const isEditingExistingBank = editingItem?.type === 'bank';
      const minReqDigits = activeBrand === 'Diners Club' ? 14 : activeBrand === 'American Express' ? 15 : 12;
      if (digitsOnly.length > 0 && digitsOnly.length < minReqDigits) {
        setError(
          lang === 'sw'
            ? `Namba ya kadi ya ${activeBrand === 'Card' ? 'benki' : activeBrand} lazima iwe na angalau tarakimu ${minReqDigits}.`
            : `${activeBrand === 'Card' ? 'Card' : activeBrand} number must be at least ${minReqDigits} digits.`
        );
        return;
      }
      if (!isEditingExistingBank && digitsOnly.length < minReqDigits) {
        setError(
          lang === 'sw'
            ? `Namba ya kadi ya ${activeBrand === 'Card' ? 'benki' : activeBrand} lazima iwe na angalau tarakimu ${minReqDigits}.`
            : `${activeBrand === 'Card' ? 'Card' : activeBrand} number must be at least ${minReqDigits} digits.`
        );
        return;
      }

      let cleanExpiry = expiry.trim();
      if (!cleanExpiry) {
        cleanExpiry = isEditingExistingBank ? editingItem.item.expiryDate : '12/29';
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
      const masked =
        digitsOnly.length >= minReqDigits
          ? maskCardNumber(digitsOnly, finalBrand)
          : isEditingExistingBank
          ? editingItem.item.maskedNumber
          : '';
      const formattedFull =
        digitsOnly.length >= minReqDigits
          ? formatCardNumber(digitsOnly, finalBrand)
          : isEditingExistingBank
          ? editingItem.item.fullNumber
          : undefined;

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

      const cardPayload: BankCardItem = {
        id: isEditingExistingBank ? editingItem.item.id : `card-${Date.now()}`,
        bankName,
        customBankName: bankName === 'Other Bank' ? customBankName.trim() : undefined,
        cardType: finalBrand,
        tier: tierLabel,
        cardholderName: cleanName.toUpperCase(),
        maskedNumber: masked,
        fullNumber: formattedFull,
        expiryDate: cleanExpiry,
        colorScheme: schemeMap[bankName] || 'darkEmerald',
        isDefault: isEditingExistingBank ? editingItem.item.isDefault : true,
      };

      if (isEditingExistingBank && onUpdateBankCard) {
        onUpdateBankCard(cardPayload);
      } else {
        onAddBankCard(cardPayload);
      }

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
            ? 'Tafadhali ingiza namba kamili ya simu (mf. 07XX XXX XXX).'
            : 'Please enter a valid phone number (e.g. 07XX XXX XXX).'
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

      const isEditingMomo = editingItem?.type === 'momo';
      const momoPayload: MobileMoneyItem = {
        id: isEditingMomo ? editingItem.item.id : `momo-${Date.now()}`,
        provider: momoProvider,
        accountHolder: cleanName,
        phoneNumber: cleanPhone.startsWith('+')
          ? cleanPhone
          : `+255 ${cleanPhone.replace(/^0/, '')}`,
        ussdCode: ussdMap[momoProvider] || '*150#',
        brandColor: colorMap[momoProvider] || '#00B887',
        isPrimary: isEditingMomo ? editingItem.item.isPrimary : true,
      };

      if (isEditingMomo && onUpdateMobileMoney) {
        onUpdateMobileMoney(momoPayload);
      } else {
        onAddMobileMoney(momoPayload);
      }

      setMomoName('');
      setMomoPhone('');
      onClose();
    } else if (activeTab === 'id') {
      const cleanName = idFullName.trim();
      const cleanNumber = idNumber.trim();
      const isEditingId = editingItem?.type === 'id';
      if (!cleanName || (!cleanNumber && !isEditingId)) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza jina kamili na namba ya kitambulisho.'
            : 'Please enter full name and ID number.'
        );
        return;
      }

      const idPayload: IdentityDocItem = {
        id: isEditingId ? editingItem.item.id : `id-${Date.now()}`,
        docType: idType,
        fullName: cleanName.toUpperCase(),
        documentNumber: cleanNumber || (isEditingId ? editingItem.item.documentNumber : ''),
        issueDate: isEditingId
          ? editingItem.item.issueDate
          : new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
        expiryDate: idExpiryDate.trim() || undefined,
        issuingAuthority:
          idType === 'NIDA National ID'
            ? 'NIDA Tanzania'
            : idType === "Driver's License"
            ? 'TRA / LATRA'
            : 'NEC Tanzania',
      };

      if (isEditingId && onUpdateIdentity) {
        onUpdateIdentity(idPayload);
      } else {
        onAddIdentity(idPayload);
      }

      setIdFullName('');
      setIdNumber('');
      setIdExpiryDate('');
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

      const isEditingIns = editingItem?.type === 'insurance';
      const insPayload: InsuranceDocItem = {
        id: isEditingIns ? editingItem.item.id : `ins-${Date.now()}`,
        provider: insProvider,
        schemeName: lang === 'sw' ? 'Bima ya Afya (Personal Cover)' : 'Health Insurance Cover',
        membershipNumber: cleanNumber,
        beneficiaryName: cleanMember.toUpperCase(),
        status: 'Active',
      };

      if (isEditingIns && onUpdateInsurance) {
        onUpdateInsurance(insPayload);
      } else {
        onAddInsurance(insPayload);
      }

      setInsNumber('');
      setInsMember('');
      onClose();
    } else if (activeTab === 'pension') {
      const cleanNumber = penNumber.trim();
      const cleanHolder = penHolder.trim();
      if (!cleanNumber || !cleanHolder) {
        setError(
          lang === 'sw'
            ? 'Tafadhali ingiza namba ya uanachama na jina la mwenye kadi.'
            : 'Please enter membership number and cardholder name.'
        );
        return;
      }

      const defaultTitle =
        penType === 'NSSF'
          ? 'NSSF Social Security'
          : penType === 'PSSSF'
          ? 'PSSSF Pension Fund'
          : penType === 'Fuel Loyalty'
          ? 'Fuel Loyalty Card'
          : 'Student / Institution ID';

      const accent =
        penType === 'NSSF'
          ? '#008751'
          : penType === 'PSSSF'
          ? '#0284C7'
          : penType === 'Fuel Loyalty'
          ? '#EA580C'
          : '#1E3A8A';

      const isEditingPen = editingItem?.type === 'pension';
      const penPayload: PensionLoyaltyItem = {
        id: isEditingPen ? editingItem.item.id : `pen-${Date.now()}`,
        categoryType: penType,
        title: penTitle.trim() || defaultTitle,
        membershipNumber: cleanNumber,
        holderName: cleanHolder.toUpperCase(),
        organization: penOrg.trim() || penType,
        ussdCheckCode: penType === 'NSSF' ? '*152*00#' : undefined,
        expiryOrStatus: penStatus.trim() || (lang === 'sw' ? 'Inatumika (Active)' : 'Active'),
        accentColor: accent,
      };

      if (isEditingPen && onUpdatePension) {
        onUpdatePension(penPayload);
      } else {
        onAddPension(penPayload);
      }

      setPenTitle('');
      setPenNumber('');
      setPenHolder('');
      setPenOrg('');
      setPenStatus('');
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
                {editingItem
                  ? lang === 'sw'
                    ? 'Hariri Taarifa za Vault'
                    : 'Edit Vault Item'
                  : lang === 'sw'
                  ? 'Ongeza Kadi au Hati'
                  : 'Add Card or Document'}
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

        {/* Category Tabs (hidden while editing existing item) */}
        {!editingItem && (
        <div className="flex items-center gap-1 p-1 bg-[#0B211B] rounded-xl my-3 border border-[#24473A] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveTab('bank');
              setError(null);
            }}
            className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
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
            className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
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
            className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
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
            className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeTab === 'insurance'
                ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>NHIF</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('pension');
              setError(null);
            }}
            className={`py-2 px-2.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
              activeTab === 'pension'
                ? 'bg-[#00B887] text-[#03120E] shadow-sm'
                : 'text-[#B7C8C1] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'sw' ? 'Mifuko' : 'Pension'}</span>
          </button>
        </div>
        )}

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
                          ? 'Kagua Namba'
                          : 'Check Digits'}
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
                  placeholder={lang === 'sw' ? 'Andika jina kwenye kadi' : 'Name printed on card'}
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
                    placeholder={lang === 'sw' ? 'Namba ya kadi' : 'Card number'}
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
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                  />
                </div>
              </div>

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
                  BIN range:{' '}
                  {brandMeta.minLength === brandMeta.maxLength
                    ? `${brandMeta.minLength}`
                    : `${brandMeta.minLength}-${brandMeta.maxLength}`}{' '}
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
                  placeholder={lang === 'sw' ? 'Andika jina lililosajiliwa' : 'Registered account name'}
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
                  placeholder="07XX XXX XXX"
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
                  placeholder={lang === 'sw' ? 'Jina kamili kwenye hati' : 'Full name on document'}
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
                  placeholder={
                    editingItem?.type === 'id' && isEncryptedEnvelope(editingItem.item.documentNumber)
                      ? lang === 'sw'
                        ? 'Imefungwa kwa PIN — weka mpya kubadilisha'
                        : 'PIN locked — enter new to replace'
                      : 'YYYYMMDD-XXXXX-XXXXX-XX'
                  }
                  value={idNumber}
                  onChange={(e) => {
                    setIdNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Tarehe ya Kuisha (Hiari: YYYY-MM-DD)' : 'Expiry Date (Optional: YYYY-MM-DD)'}
                </label>
                <input
                  type="text"
                  placeholder="2028-12-31 au 12/28"
                  value={idExpiryDate}
                  onChange={(e) => setIdExpiryDate(e.target.value)}
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
                  placeholder={lang === 'sw' ? 'Namba ya kadi ya bima' : 'Membership number'}
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

          {activeTab === 'pension' && (
            <>
              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Aina ya Mfuko / Klabu' : 'Membership Category'}
                </label>
                <select
                  value={penType}
                  onChange={(e) => setPenType(e.target.value as PensionLoyaltyItem['categoryType'])}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                >
                  <option value="NSSF">NSSF (Hifadhi ya Jamii)</option>
                  <option value="PSSSF">PSSSF (Mfuko wa Pensheni)</option>
                  <option value="Fuel Loyalty">Fuel Loyalty / Rewards Card</option>
                  <option value="University ID">Student / Institution ID</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Jina la Mwanachama' : 'Member Full Name'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'sw' ? 'Jina kamili' : 'Full name'}
                  value={penHolder}
                  onChange={(e) => {
                    setPenHolder(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Namba ya Uanachama' : 'Membership / Registration #'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'sw' ? 'Namba ya mwanachama' : 'Membership number'}
                  value={penNumber}
                  onChange={(e) => {
                    setPenNumber(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-sm font-mono focus:outline-none focus:border-[#00B887]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Kichwa (Hiari)' : 'Card Title (Opt.)'}
                  </label>
                  <input
                    type="text"
                    placeholder={penType}
                    value={penTitle}
                    onChange={(e) => setPenTitle(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-xs focus:outline-none focus:border-[#00B887]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#B7C8C1] block mb-1">
                    {lang === 'sw' ? 'Taasisi (Hiari)' : 'Organization (Opt.)'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'sw' ? 'Jina la taasisi' : 'Organization'}
                    value={penOrg}
                    onChange={(e) => setPenOrg(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-xs focus:outline-none focus:border-[#00B887]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#B7C8C1] block mb-1">
                  {lang === 'sw' ? 'Hali / Alama (Hiari)' : 'Status / Expiry (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'sw' ? 'Mf. Inatumika (Active)' : 'e.g. Active'}
                  value={penStatus}
                  onChange={(e) => setPenStatus(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-[#0B211B] border border-[#24473A] text-white text-xs focus:outline-none focus:border-[#00B887]"
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
                {editingItem
                  ? lang === 'sw'
                    ? 'Hifadhi Mabadiliko'
                    : 'Save Changes'
                  : lang === 'sw'
                  ? 'Hifadhi kwenye 99Pay Vault'
                  : 'Save to 99Pay Vault'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
