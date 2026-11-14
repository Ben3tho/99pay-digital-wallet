export function launchUssdDialer(ussdCode: string): string {
  const sanitized = ussdCode.replace(/[^0-9*#]/g, '');
  if (!sanitized) return '';
  const encoded = `tel:${sanitized.replace(/#/g, '%23')}`;
  if (typeof window !== 'undefined') {
    window.location.href = encoded;
  }
  return sanitized;
}
