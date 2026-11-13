import { CardBrand } from '../utils/cardDetection';

export type { CardBrand };

export type BankInstitution =
  | 'CRDB Bank'
  | 'NMB Bank'
  | 'Stanbic'
  | 'NBC'
  | 'Standard Chartered'
  | 'Equity Bank'
  | 'Absa Bank'
  | 'DTB Tanzania'
  | 'Exim Bank'
  | 'KCB Bank'
  | 'Other Bank';

export interface BankCardItem {
  id: string;
  bankName: BankInstitution;
  customBankName?: string;
  cardType: CardBrand;
  tier: string;
  cardholderName: string;
  maskedNumber: string;
  fullNumber?: string;
  expiryDate: string;
  colorScheme: 'emerald' | 'gold' | 'darkEmerald' | 'navy' | 'crimson' | 'slate';
  isDefault?: boolean;
}

export interface MobileMoneyItem {
  id: string;
  provider: 'Vodacom M-Pesa' | 'Airtel Money' | 'Tigo Pesa' | 'Halopesa';
  accountHolder: string;
  phoneNumber: string;
  ussdCode: string;
  brandColor: string;
  isPrimary?: boolean;
}

export interface IdentityDocItem {
  id: string;
  docType: 'NIDA National ID' | "Driver's License" | "Voter's ID";
  fullName: string;
  documentNumber: string;
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string;
  classification?: string;
}

export interface InsuranceDocItem {
  id: string;
  provider: 'NHIF' | 'Jubilee Insurance' | 'Strategis Insurance' | 'AAR';
  schemeName: string;
  membershipNumber: string;
  beneficiaryName: string;
  status: 'Active' | 'Under Review';
}

export interface LipaMerchantItem {
  id: string;
  merchantName: string;
  merchantType: 'Till' | 'Paybill' | 'Masterpass' | 'Government';
  number: string;
  provider: 'Vodacom M-Pesa' | 'Tigo Pesa' | 'Airtel Money' | 'Selcom' | 'GePG';
  category: 'Mafuta' | 'Supermarket' | 'Dawa & Afya' | 'Kodi & LUKU' | 'Mgahawa' | 'Nyingine';
  branchOrNotes?: string;
  ussdPrefix: string;
  favorite?: boolean;
}

export interface PensionLoyaltyItem {
  id: string;
  categoryType: 'NSSF' | 'PSSSF' | 'Fuel Loyalty' | 'University ID';
  title: string;
  membershipNumber: string;
  holderName: string;
  organization: string;
  ussdCheckCode?: string;
  expiryOrStatus: string;
  accentColor: string;
}

export const INITIAL_BANK_CARDS: BankCardItem[] = [];

export const INITIAL_MOBILE_MONEY: MobileMoneyItem[] = [];

export const INITIAL_IDENTITIES: IdentityDocItem[] = [];

export const INITIAL_INSURANCE: InsuranceDocItem[] = [];

export const INITIAL_LIPA_MERCHANTS: LipaMerchantItem[] = [
  {
    id: 'lipa-1',
    merchantName: 'Puma Energy Victoria Station',
    merchantType: 'Till',
    number: '5239108',
    provider: 'Vodacom M-Pesa',
    category: 'Mafuta',
    branchOrNotes: 'Kituo cha Victoria / Bagamoyo Rd',
    ussdPrefix: '*150*00*1*5239108#',
    favorite: true,
  },
  {
    id: 'lipa-2',
    merchantName: 'TotalEnergies Mwenge Service',
    merchantType: 'Till',
    number: '889201',
    provider: 'Tigo Pesa',
    category: 'Mafuta',
    branchOrNotes: 'Mwenge ITV Roundabout',
    ussdPrefix: '*150*01*4*889201#',
    favorite: true,
  },
  {
    id: 'lipa-3',
    merchantName: 'Shoppers Supermarket Mikocheni',
    merchantType: 'Masterpass',
    number: '710492',
    provider: 'Selcom',
    category: 'Supermarket',
    branchOrNotes: 'Mikocheni Plaza Counter 3',
    ussdPrefix: '*150*00*1*710492#',
    favorite: false,
  },
  {
    id: 'lipa-4',
    merchantName: 'Kairuki Hospital Pharmacy',
    merchantType: 'Till',
    number: '639410',
    provider: 'Vodacom M-Pesa',
    category: 'Dawa & Afya',
    branchOrNotes: 'Hospitali Kuu Mikocheni',
    ussdPrefix: '*150*00*1*639410#',
    favorite: false,
  },
  {
    id: 'lipa-5',
    merchantName: 'LUKU Umeme (TANESCO Token)',
    merchantType: 'Paybill',
    number: '14298102914',
    provider: 'GePG',
    category: 'Kodi & LUKU',
    branchOrNotes: 'Mita ya Nyumbani (Meter # 14298102914)',
    ussdPrefix: '*150*00*4*2*14298102914#',
    favorite: true,
  },
];

export const INITIAL_PENSION_LOYALTY: PensionLoyaltyItem[] = [
  {
    id: 'pen-1',
    categoryType: 'NSSF',
    title: 'NSSF Member Social Security',
    membershipNumber: 'NSSF-92048190',
    holderName: 'JOSEPH BENEDICTO MLAY',
    organization: 'National Social Security Fund Tanzania',
    ussdCheckCode: '*152*00#',
    expiryOrStatus: 'Michango Inakusanywa (Active)',
    accentColor: '#008751',
  },
  {
    id: 'pen-2',
    categoryType: 'Fuel Loyalty',
    title: 'TotalEnergies Club Card',
    membershipNumber: 'TOTAL-TZ-992014',
    holderName: 'JOSEPH B. MLAY',
    organization: 'TotalEnergies Marketing Tanzania',
    expiryOrStatus: 'Points: 1,420 Pts (Tier Gold)',
    accentColor: '#ED0000',
  },
  {
    id: 'pen-3',
    categoryType: 'University ID',
    title: 'UDSM Smart Card ID',
    membershipNumber: '2016-04-09821',
    holderName: 'JOSEPH BENEDICTO MLAY',
    organization: 'University of Dar es Salaam',
    expiryOrStatus: 'Alumni / Smart Identity',
    accentColor: '#1E3A8A',
  },
];

export interface TransactionItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'payment' | 'transfer' | 'topup' | 'cashout';
  amount: number;
  currency: 'TZS';
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  date: string;
  time: string;
  provider: 'CRDB Bank' | 'NMB Bank' | 'Vodacom M-Pesa' | 'Tigo Pesa' | 'Airtel Money';
  reference: string;
}

export const INITIAL_RECENT_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'tx-1',
    title: 'Puma Energy Victoria',
    subtitle: 'Lipa kwa Simu • Till #5239108',
    category: 'payment',
    amount: 65000,
    currency: 'TZS',
    type: 'debit',
    status: 'completed',
    date: 'Leo',
    time: '14:25',
    provider: 'Vodacom M-Pesa',
    reference: '0834190821M',
  },
  {
    id: 'tx-2',
    title: 'Amani M. Swai',
    subtitle: 'Uhamisho wa Fedha (TIPS / P2P)',
    category: 'transfer',
    amount: 150000,
    currency: 'TZS',
    type: 'debit',
    status: 'completed',
    date: 'Leo',
    time: '10:12',
    provider: 'CRDB Bank',
    reference: 'CRDB-TX-99201',
  },
  {
    id: 'tx-3',
    title: 'Mshahara / Malipo ya Kazi',
    subtitle: 'Direct Deposit • EFT Inward',
    category: 'topup',
    amount: 1850000,
    currency: 'TZS',
    type: 'credit',
    status: 'completed',
    date: 'Jana',
    time: '08:45',
    provider: 'NMB Bank',
    reference: 'NMB-IN-48190',
  },
  {
    id: 'tx-4',
    title: 'LUKU Umeme (TANESCO)',
    subtitle: 'Malipo ya Bili • Mita #14298102914',
    category: 'payment',
    amount: 30000,
    currency: 'TZS',
    type: 'debit',
    status: 'completed',
    date: '04 Nov',
    time: '19:30',
    provider: 'Tigo Pesa',
    reference: 'TIGO-LK-20419',
  },
  {
    id: 'tx-5',
    title: 'Shoppers Mikocheni',
    subtitle: 'Supermarket POS Card Tap',
    category: 'payment',
    amount: 48500,
    currency: 'TZS',
    type: 'debit',
    status: 'pending',
    date: '03 Nov',
    time: '17:15',
    provider: 'CRDB Bank',
    reference: 'POS-091482',
  },
  {
    id: 'tx-6',
    title: 'DAWASA Maji Bill',
    subtitle: 'Control #991042811402',
    category: 'payment',
    amount: 24000,
    currency: 'TZS',
    type: 'debit',
    status: 'failed',
    date: '02 Nov',
    time: '11:04',
    provider: 'Airtel Money',
    reference: 'AIR-FL-77210',
  },
];

