export type CardBrand =
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Discover'
  | 'UnionPay'
  | 'Verve'
  | 'Diners Club'
  | 'JCB'
  | 'Card';

export interface CardBrandMeta {
  brand: CardBrand;
  shortLabel: string;
  minLength: number;
  maxLength: number;
  cvvLength: number;
  gaps: number[];
  accentHex: string;
}

export const CARD_BRAND_LIST: CardBrand[] = [
  'Visa',
  'Mastercard',
  'American Express',
  'Discover',
  'UnionPay',
  'Verve',
  'Diners Club',
  'JCB',
];

const BRAND_META_MAP: Record<CardBrand, CardBrandMeta> = {
  Visa: {
    brand: 'Visa',
    shortLabel: 'VISA',
    minLength: 13,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#1A1F71',
  },
  Mastercard: {
    brand: 'Mastercard',
    shortLabel: 'MASTERCARD',
    minLength: 16,
    maxLength: 16,
    cvvLength: 3,
    gaps: [4, 8, 12],
    accentHex: '#EB001B',
  },
  'American Express': {
    brand: 'American Express',
    shortLabel: 'AMEX',
    minLength: 15,
    maxLength: 15,
    cvvLength: 4,
    gaps: [4, 10],
    accentHex: '#006FCF',
  },
  Discover: {
    brand: 'Discover',
    shortLabel: 'DISCOVER',
    minLength: 16,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#FF6000',
  },
  UnionPay: {
    brand: 'UnionPay',
    shortLabel: 'UNIONPAY',
    minLength: 16,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#00447C',
  },
  Verve: {
    brand: 'Verve',
    shortLabel: 'VERVE',
    minLength: 16,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#EE312A',
  },
  'Diners Club': {
    brand: 'Diners Club',
    shortLabel: 'DINERS',
    minLength: 14,
    maxLength: 16,
    cvvLength: 3,
    gaps: [4, 10],
    accentHex: '#004B87',
  },
  JCB: {
    brand: 'JCB',
    shortLabel: 'JCB',
    minLength: 16,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#0B7B3E',
  },
  Card: {
    brand: 'Card',
    shortLabel: 'CARD',
    minLength: 12,
    maxLength: 19,
    cvvLength: 3,
    gaps: [4, 8, 12, 16],
    accentHex: '#00B887',
  },
};

export function getCardBrandMeta(brand: CardBrand): CardBrandMeta {
  return BRAND_META_MAP[brand] || BRAND_META_MAP.Card;
}

/**
 * Detects card brand from raw or formatted card number using BIN/IIN prefix rules.
 * Ordered carefully so more specific prefixes (e.g. Verve 650002-650027, 506099-506198)
 * are checked before broader ranges (e.g. Discover 65).
 */
export function detectCardBrand(input: string): CardBrand {
  const digits = input.replace(/\D/g, '');
  if (!digits) return 'Card';

  // 1. Verve (African debit/credit network): 506099-506198, 650002-650027, 507865-507964
  if (digits.length >= 6) {
    const first6 = parseInt(digits.slice(0, 6), 10);
    if (
      (first6 >= 506099 && first6 <= 506198) ||
      (first6 >= 650002 && first6 <= 650027) ||
      (first6 >= 507865 && first6 <= 507964)
    ) {
      return 'Verve';
    }
  } else if (/^(50609|5061|5078|5079|6500)/.test(digits)) {
    return 'Verve';
  }

  // 2. American Express: 34, 37
  if (/^3[47]/.test(digits)) {
    return 'American Express';
  }

  // 3. Diners Club: 300-305, 3095, 36, 38, 39
  if (/^(30[0-5]|3095|36|38|39)/.test(digits)) {
    return 'Diners Club';
  }

  // 4. JCB: 3528-3589 (also match 35 prefix while user is typing)
  if (/^(352[89]|35[3-8][0-9]|35$)/.test(digits) || /^35/.test(digits)) {
    return 'JCB';
  }

  // 5. Visa: starts with 4
  if (/^4/.test(digits)) {
    return 'Visa';
  }

  // 6. Mastercard: 51-55 or 2221-2720 (also match 222-272 while typing)
  if (/^5[1-5]/.test(digits)) {
    return 'Mastercard';
  }
  if (digits.length >= 4) {
    const first4 = parseInt(digits.slice(0, 4), 10);
    if (first4 >= 2221 && first4 <= 2720) {
      return 'Mastercard';
    }
  } else if (/^(222[1-9]|22[3-9]|2[3-6]|27[01]|2720?)/.test(digits)) {
    return 'Mastercard';
  }

  // 7. UnionPay: 62 or 81
  if (/^(62|81)/.test(digits)) {
    return 'UnionPay';
  }

  // 8. Discover: 6011, 644-649, 65
  if (/^(6011|64[4-9]|65)/.test(digits)) {
    return 'Discover';
  }

  return 'Card';
}

/**
 * Formats digits cleanly according to card brand conventions
 * (4-6-5 for Amex, 4-6-4 for 14-digit Diners, 4-4-4-4(-4) for all others).
 */
export function formatCardNumber(input: string, explicitBrand?: CardBrand): string {
  const digits = input.replace(/\D/g, '');
  const brand = explicitBrand && explicitBrand !== 'Card' ? explicitBrand : detectCardBrand(digits);
  const meta = getCardBrandMeta(brand);
  const clipped = digits.slice(0, meta.maxLength);

  if (brand === 'American Express') {
    const p1 = clipped.slice(0, 4);
    const p2 = clipped.slice(4, 10);
    const p3 = clipped.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }

  if (brand === 'Diners Club' && clipped.length <= 14) {
    const p1 = clipped.slice(0, 4);
    const p2 = clipped.slice(4, 10);
    const p3 = clipped.slice(10, 14);
    return [p1, p2, p3].filter(Boolean).join(' ');
  }

  return clipped.match(/.{1,4}/g)?.join(' ') || clipped;
}

/**
 * Masks the middle digits cleanly while keeping first 4 and last 4 visible.
 */
export function maskCardNumber(input: string, explicitBrand?: CardBrand): string {
  const digits = input.replace(/\D/g, '');
  const brand = explicitBrand && explicitBrand !== 'Card' ? explicitBrand : detectCardBrand(digits);

  if (digits.length < 8) {
    return formatCardNumber(digits, brand);
  }

  if (brand === 'American Express') {
    return `${digits.slice(0, 4)} •••••• •${digits.slice(-4)}`;
  }

  const extraCount = digits.length > 16 ? ` ${'•'.repeat(digits.length - 16)}` : '';
  return `${digits.slice(0, 4)} •••• •••• ${digits.slice(-4)}${extraCount}`;
}

/**
 * Standard Luhn (mod 10) checksum validation.
 */
export function luhnCheck(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  if (digits.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
