import { BankCardItem, IdentityDocItem } from '../data/walletData';

export interface ExpiryAlertItem {
  id: string;
  sourceType: 'bank' | 'id';
  title: string;
  expiryText: string;
  daysRemaining: number;
  status: 'expired' | 'expiring_soon';
}

export function parseExpiryDate(raw?: string): Date | null {
  if (!raw) return null;
  const clean = raw.trim();
  if (!clean) return null;

  // MM/YY (standard payment card expiry)
  const mmYyMatch = /^(\d{1,2})\/(\d{2})$/.exec(clean);
  if (mmYyMatch) {
    const month = parseInt(mmYyMatch[1], 10);
    const year = 2000 + parseInt(mmYyMatch[2], 10);
    if (month >= 1 && month <= 12) {
      // Last day of that expiry month
      return new Date(year, month, 0, 23, 59, 59);
    }
  }

  // MM/YYYY
  const mmYyyyMatch = /^(\d{1,2})\/(\d{4})$/.exec(clean);
  if (mmYyyyMatch) {
    const month = parseInt(mmYyyyMatch[1], 10);
    const year = parseInt(mmYyyyMatch[2], 10);
    if (month >= 1 && month <= 12) {
      return new Date(year, month, 0, 23, 59, 59);
    }
  }

  // YYYY-MM-DD
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month - 1, day, 23, 59, 59);
  }

  // DD/MM/YYYY
  const dmyMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(clean);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month - 1, day, 23, 59, 59);
  }

  const parsed = new Date(clean);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getExpiryStatus(
  raw?: string,
  thresholdDays: number = 45
): { status: 'valid' | 'expiring_soon' | 'expired'; daysRemaining: number } | null {
  const date = parseExpiryDate(raw);
  if (!date) return null;
  const diffMs = date.getTime() - Date.now();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (daysRemaining < 0) {
    return { status: 'expired', daysRemaining };
  }
  if (daysRemaining <= thresholdDays) {
    return { status: 'expiring_soon', daysRemaining };
  }
  return { status: 'valid', daysRemaining };
}

export function collectVaultExpiryAlerts(
  bankCards: BankCardItem[],
  identities: IdentityDocItem[],
  thresholdDays: number = 45
): ExpiryAlertItem[] {
  const alerts: ExpiryAlertItem[] = [];

  for (const card of bankCards) {
    const res = getExpiryStatus(card.expiryDate, thresholdDays);
    if (res && (res.status === 'expired' || res.status === 'expiring_soon')) {
      const bankLabel =
        card.bankName === 'Other Bank' && card.customBankName
          ? card.customBankName
          : card.bankName;
      alerts.push({
        id: card.id,
        sourceType: 'bank',
        title: `${bankLabel} (${card.cardType})`,
        expiryText: card.expiryDate,
        daysRemaining: res.daysRemaining,
        status: res.status,
      });
    }
  }

  for (const doc of identities) {
    const res = getExpiryStatus(doc.expiryDate, thresholdDays);
    if (res && (res.status === 'expired' || res.status === 'expiring_soon') && doc.expiryDate) {
      alerts.push({
        id: doc.id,
        sourceType: 'id',
        title: doc.docType,
        expiryText: doc.expiryDate,
        daysRemaining: res.daysRemaining,
        status: res.status,
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
