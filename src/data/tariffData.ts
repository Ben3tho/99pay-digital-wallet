export type MobileProviderId = 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa';

export interface MobileProviderMeta {
  id: MobileProviderId;
  name: string;
  brandColor: string;
  accentBg: string;
  ussd: string;
  tagline: string;
}

export const MOBILE_PROVIDERS: MobileProviderMeta[] = [
  {
    id: 'mpesa',
    name: 'Vodacom M-Pesa',
    brandColor: '#E60000',
    accentBg: '#2A0808',
    ussd: '*150*00#',
    tagline: 'Kasi ni M-Pesa',
  },
  {
    id: 'tigopesa',
    name: 'Tigo Pesa',
    brandColor: '#0072BC',
    accentBg: '#051A2E',
    ussd: '*150*01#',
    tagline: 'Rahisi, Salama, Kila Mahali',
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    brandColor: '#FF2400',
    accentBg: '#2B0A06',
    ussd: '*150*60#',
    tagline: 'The Smartphone Network',
  },
  {
    id: 'halopesa',
    name: 'Halopesa',
    brandColor: '#FF6F00',
    accentBg: '#2B1605',
    ussd: '*150*88#',
    tagline: 'Mtandao Unaokupa Zaidi',
  },
];

export type TransactionType = 'send_same' | 'send_other' | 'send_unregistered' | 'withdraw_agent';

interface TariffBand {
  min: number;
  max: number;
  sendSame: number;
  sendOther: number;
  sendUnreg: number;
  withdrawAgent: number;
  govLevy: number;
}

// Official Tanzanian Mobile Money Tariff Bands (TZS)
const MPESA_TARIFFS: TariffBand[] = [
  { min: 100, max: 999, sendSame: 50, sendOther: 80, sendUnreg: 200, withdrawAgent: 350, govLevy: 10 },
  { min: 1000, max: 1999, sendSame: 100, sendOther: 160, sendUnreg: 400, withdrawAgent: 700, govLevy: 20 },
  { min: 2000, max: 4999, sendSame: 180, sendOther: 290, sendUnreg: 650, withdrawAgent: 1100, govLevy: 35 },
  { min: 5000, max: 9999, sendSame: 250, sendOther: 450, sendUnreg: 1050, withdrawAgent: 1350, govLevy: 50 },
  { min: 10000, max: 19999, sendSame: 400, sendOther: 700, sendUnreg: 1550, withdrawAgent: 1850, govLevy: 80 },
  { min: 20000, max: 39999, sendSame: 550, sendOther: 950, sendUnreg: 1950, withdrawAgent: 2450, govLevy: 110 },
  { min: 40000, max: 49999, sendSame: 650, sendOther: 1100, sendUnreg: 2200, withdrawAgent: 2700, govLevy: 130 },
  { min: 50000, max: 99999, sendSame: 750, sendOther: 1300, sendUnreg: 2500, withdrawAgent: 3400, govLevy: 150 },
  { min: 100000, max: 199999, sendSame: 950, sendOther: 1650, sendUnreg: 3100, withdrawAgent: 4300, govLevy: 200 },
  { min: 200000, max: 299999, sendSame: 1200, sendOther: 2100, sendUnreg: 3800, withdrawAgent: 5600, govLevy: 250 },
  { min: 300000, max: 499999, sendSame: 1400, sendOther: 2500, sendUnreg: 4600, withdrawAgent: 6800, govLevy: 300 },
  { min: 500000, max: 999999, sendSame: 1800, sendOther: 3200, sendUnreg: 5800, withdrawAgent: 8400, govLevy: 400 },
  { min: 1000000, max: 1999999, sendSame: 2400, sendOther: 4300, sendUnreg: 7500, withdrawAgent: 10500, govLevy: 550 },
  { min: 2000000, max: 2999999, sendSame: 3200, sendOther: 5400, sendUnreg: 9200, withdrawAgent: 12500, govLevy: 750 },
  { min: 3000000, max: 5000000, sendSame: 4200, sendOther: 6800, sendUnreg: 11000, withdrawAgent: 14500, govLevy: 950 },
];

const TIGOPESA_TARIFFS: TariffBand[] = [
  { min: 100, max: 999, sendSame: 45, sendOther: 75, sendUnreg: 190, withdrawAgent: 330, govLevy: 10 },
  { min: 1000, max: 1999, sendSame: 90, sendOther: 150, sendUnreg: 380, withdrawAgent: 650, govLevy: 20 },
  { min: 2000, max: 4999, sendSame: 160, sendOther: 270, sendUnreg: 600, withdrawAgent: 1050, govLevy: 35 },
  { min: 5000, max: 9999, sendSame: 230, sendOther: 420, sendUnreg: 980, withdrawAgent: 1300, govLevy: 50 },
  { min: 10000, max: 19999, sendSame: 380, sendOther: 660, sendUnreg: 1450, withdrawAgent: 1800, govLevy: 80 },
  { min: 20000, max: 39999, sendSame: 520, sendOther: 900, sendUnreg: 1850, withdrawAgent: 2350, govLevy: 110 },
  { min: 40000, max: 49999, sendSame: 620, sendOther: 1050, sendUnreg: 2100, withdrawAgent: 2600, govLevy: 130 },
  { min: 50000, max: 99999, sendSame: 700, sendOther: 1250, sendUnreg: 2400, withdrawAgent: 3300, govLevy: 150 },
  { min: 100000, max: 199999, sendSame: 900, sendOther: 1580, sendUnreg: 2950, withdrawAgent: 4200, govLevy: 200 },
  { min: 200000, max: 299999, sendSame: 1150, sendOther: 2000, sendUnreg: 3650, withdrawAgent: 5400, govLevy: 250 },
  { min: 300000, max: 499999, sendSame: 1350, sendOther: 2400, sendUnreg: 4400, withdrawAgent: 6600, govLevy: 300 },
  { min: 500000, max: 999999, sendSame: 1750, sendOther: 3050, sendUnreg: 5500, withdrawAgent: 8200, govLevy: 400 },
  { min: 1000000, max: 1999999, sendSame: 2300, sendOther: 4100, sendUnreg: 7200, withdrawAgent: 10200, govLevy: 550 },
  { min: 2000000, max: 2999999, sendSame: 3100, sendOther: 5200, sendUnreg: 8900, withdrawAgent: 12200, govLevy: 750 },
  { min: 3000000, max: 5000000, sendSame: 4000, sendOther: 6500, sendUnreg: 10500, withdrawAgent: 14000, govLevy: 950 },
];

const AIRTEL_TARIFFS: TariffBand[] = [
  { min: 100, max: 999, sendSame: 40, sendOther: 70, sendUnreg: 180, withdrawAgent: 320, govLevy: 10 },
  { min: 1000, max: 1999, sendSame: 85, sendOther: 140, sendUnreg: 360, withdrawAgent: 630, govLevy: 20 },
  { min: 2000, max: 4999, sendSame: 150, sendOther: 260, sendUnreg: 580, withdrawAgent: 1000, govLevy: 35 },
  { min: 5000, max: 9999, sendSame: 220, sendOther: 400, sendUnreg: 950, withdrawAgent: 1250, govLevy: 50 },
  { min: 10000, max: 19999, sendSame: 360, sendOther: 640, sendUnreg: 1400, withdrawAgent: 1750, govLevy: 80 },
  { min: 20000, max: 39999, sendSame: 500, sendOther: 880, sendUnreg: 1800, withdrawAgent: 2300, govLevy: 110 },
  { min: 40000, max: 49999, sendSame: 600, sendOther: 1020, sendUnreg: 2050, withdrawAgent: 2550, govLevy: 130 },
  { min: 50000, max: 99999, sendSame: 680, sendOther: 1200, sendUnreg: 2350, withdrawAgent: 3200, govLevy: 150 },
  { min: 100000, max: 199999, sendSame: 880, sendOther: 1520, sendUnreg: 2900, withdrawAgent: 4100, govLevy: 200 },
  { min: 200000, max: 299999, sendSame: 1100, sendOther: 1950, sendUnreg: 3550, withdrawAgent: 5300, govLevy: 250 },
  { min: 300000, max: 499999, sendSame: 1300, sendOther: 2350, sendUnreg: 4300, withdrawAgent: 6450, govLevy: 300 },
  { min: 500000, max: 999999, sendSame: 1700, sendOther: 2950, sendUnreg: 5400, withdrawAgent: 8000, govLevy: 400 },
  { min: 1000000, max: 1999999, sendSame: 2250, sendOther: 3950, sendUnreg: 7000, withdrawAgent: 10000, govLevy: 550 },
  { min: 2000000, max: 2999999, sendSame: 3000, sendOther: 5000, sendUnreg: 8700, withdrawAgent: 12000, govLevy: 750 },
  { min: 3000000, max: 5000000, sendSame: 3900, sendOther: 6300, sendUnreg: 10200, withdrawAgent: 13800, govLevy: 950 },
];

const HALOPESA_TARIFFS: TariffBand[] = [
  { min: 100, max: 999, sendSame: 35, sendOther: 65, sendUnreg: 170, withdrawAgent: 300, govLevy: 10 },
  { min: 1000, max: 1999, sendSame: 80, sendOther: 130, sendUnreg: 340, withdrawAgent: 600, govLevy: 20 },
  { min: 2000, max: 4999, sendSame: 140, sendOther: 240, sendUnreg: 550, withdrawAgent: 950, govLevy: 35 },
  { min: 5000, max: 9999, sendSame: 200, sendOther: 380, sendUnreg: 900, withdrawAgent: 1200, govLevy: 50 },
  { min: 10000, max: 19999, sendSame: 340, sendOther: 600, sendUnreg: 1350, withdrawAgent: 1700, govLevy: 80 },
  { min: 20000, max: 39999, sendSame: 480, sendOther: 840, sendUnreg: 1750, withdrawAgent: 2200, govLevy: 110 },
  { min: 40000, max: 49999, sendSame: 580, sendOther: 980, sendUnreg: 2000, withdrawAgent: 2480, govLevy: 130 },
  { min: 50000, max: 99999, sendSame: 650, sendOther: 1150, sendUnreg: 2280, withdrawAgent: 3100, govLevy: 150 },
  { min: 100000, max: 199999, sendSame: 840, sendOther: 1460, sendUnreg: 2800, withdrawAgent: 3980, govLevy: 200 },
  { min: 200000, max: 299999, sendSame: 1050, sendOther: 1880, sendUnreg: 3450, withdrawAgent: 5100, govLevy: 250 },
  { min: 300000, max: 499999, sendSame: 1240, sendOther: 2250, sendUnreg: 4150, withdrawAgent: 6250, govLevy: 300 },
  { min: 500000, max: 999999, sendSame: 1620, sendOther: 2850, sendUnreg: 5200, withdrawAgent: 7750, govLevy: 400 },
  { min: 1000000, max: 1999999, sendSame: 2150, sendOther: 3800, sendUnreg: 6750, withdrawAgent: 9600, govLevy: 550 },
  { min: 2000000, max: 2999999, sendSame: 2850, sendOther: 4800, sendUnreg: 8400, withdrawAgent: 11500, govLevy: 750 },
  { min: 3000000, max: 5000000, sendSame: 3750, sendOther: 6000, sendUnreg: 9800, withdrawAgent: 13200, govLevy: 950 },
];

const PROVIDER_TABLE_MAP: Record<MobileProviderId, TariffBand[]> = {
  mpesa: MPESA_TARIFFS,
  tigopesa: TIGOPESA_TARIFFS,
  airtel: AIRTEL_TARIFFS,
  halopesa: HALOPESA_TARIFFS,
};

export interface TariffCalculationResult {
  amount: number;
  provider: MobileProviderId;
  txType: TransactionType;
  includeWithdrawalFee: boolean;
  networkFee: number;
  govLevy: number;
  agentWithdrawFee: number;
  totalFee: number;
  totalRequired: number;
  recipientReceives: number;
}

export function calculateTariff(
  amount: number,
  provider: MobileProviderId,
  txType: TransactionType,
  includeWithdrawalFee: boolean = false
): TariffCalculationResult {
  const cleanAmount = Math.max(100, Math.min(5000000, Math.floor(amount || 0)));
  const table = PROVIDER_TABLE_MAP[provider] || MPESA_TARIFFS;
  
  const band = table.find((b) => cleanAmount >= b.min && cleanAmount <= b.max) || table[table.length - 1];
  
  let networkFee = 0;
  switch (txType) {
    case 'send_same':
      networkFee = band.sendSame;
      break;
    case 'send_other':
      networkFee = band.sendOther;
      break;
    case 'send_unregistered':
      networkFee = band.sendUnreg;
      break;
    case 'withdraw_agent':
      networkFee = 0; // The agent cash out fee takes the primary role
      break;
  }

  const agentWithdrawFee = txType === 'withdraw_agent' ? band.withdrawAgent : (includeWithdrawalFee ? band.withdrawAgent : 0);
  const govLevy = band.govLevy;
  
  // Total fee the sender pays on top of amount
  let totalFee = networkFee + govLevy;
  let totalRequired = cleanAmount + totalFee;
  let recipientReceives = cleanAmount;

  if (txType === 'withdraw_agent') {
    totalFee = band.withdrawAgent + govLevy;
    totalRequired = cleanAmount + totalFee;
    recipientReceives = cleanAmount;
  } else if (includeWithdrawalFee) {
    // Tanzanian "Pesa ya kutolea": Sender adds the cash-out fee so the receiver gets net amount after withdrawing!
    const effectiveSendAmount = cleanAmount + agentWithdrawFee;
    // recalculate sending band fee for effective amount
    const sendBand = table.find((b) => effectiveSendAmount >= b.min && effectiveSendAmount <= b.max) || band;
    const adjustedSendFee = txType === 'send_same' ? sendBand.sendSame : (txType === 'send_other' ? sendBand.sendOther : sendBand.sendUnreg);
    
    totalFee = adjustedSendFee + govLevy + agentWithdrawFee;
    totalRequired = cleanAmount + totalFee;
    recipientReceives = cleanAmount; // Because receiver withdraws agentWithdrawFee, leaving exact cleanAmount in hand!
  }

  return {
    amount: cleanAmount,
    provider,
    txType,
    includeWithdrawalFee,
    networkFee,
    govLevy,
    agentWithdrawFee,
    totalFee,
    totalRequired,
    recipientReceives,
  };
}

export interface ProviderComparisonItem {
  providerId: MobileProviderId;
  name: string;
  brandColor: string;
  totalFee: number;
  totalRequired: number;
  isCheapest: boolean;
}

export function compareAllProviders(
  amount: number,
  txType: TransactionType,
  includeWithdrawalFee: boolean = false
): ProviderComparisonItem[] {
  const providers: MobileProviderId[] = ['mpesa', 'tigopesa', 'airtel', 'halopesa'];
  const results = providers.map((pid) => {
    const calc = calculateTariff(amount, pid, txType, includeWithdrawalFee);
    const meta = MOBILE_PROVIDERS.find((p) => p.id === pid)!;
    return {
      providerId: pid,
      name: meta.name,
      brandColor: meta.brandColor,
      totalFee: calc.totalFee,
      totalRequired: calc.totalRequired,
      isCheapest: false,
    };
  });

  const minFee = Math.min(...results.map((r) => r.totalFee));
  return results.map((r) => ({
    ...r,
    isCheapest: r.totalFee === minFee,
  }));
}
