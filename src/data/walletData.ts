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

export interface UserProfile {
  fullName: string;
  phoneNumber?: string;
  email?: string;
}

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
  provider:
    | 'CRDB Bank'
    | 'NMB Bank'
    | 'Vodacom M-Pesa'
    | 'Tigo Pesa'
    | 'Airtel Money'
    | 'Halopesa'
    | 'Other';
  reference: string;
}

export const INITIAL_USER_PROFILE: UserProfile = {
  fullName: '',
  phoneNumber: '',
  email: '',
};

export const INITIAL_BANK_CARDS: BankCardItem[] = [];

export const INITIAL_MOBILE_MONEY: MobileMoneyItem[] = [];

export const INITIAL_IDENTITIES: IdentityDocItem[] = [];

export const INITIAL_INSURANCE: InsuranceDocItem[] = [];

export const INITIAL_LIPA_MERCHANTS: LipaMerchantItem[] = [];

export const INITIAL_PENSION_LOYALTY: PensionLoyaltyItem[] = [];

export const INITIAL_RECENT_TRANSACTIONS: TransactionItem[] = [];
