const BIOMETRIC_CRED_KEY = '99pay_webauthn_cred_v1';

interface CapacitorSecurityPlugin {
  isBiometricAvailable?: () => Promise<{ available: boolean; reason?: string }>;
  authenticateBiometric?: (opts: { title: string; subtitle: string }) => Promise<{ verified: boolean; reason?: string }>;
}

function getNativeSecurityPlugin(): CapacitorSecurityPlugin | null {
  if (typeof window === 'undefined') return null;
  const cap = (window as { Capacitor?: { isNativePlatform?: () => boolean; Plugins?: Record<string, CapacitorSecurityPlugin> } }).Capacitor;
  if (!cap?.isNativePlatform?.()) return null;
  return cap.Plugins?.NineNinePaySecurity ?? null;
}

function toBase64Url(bytes: Uint8Array): string {
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export function getEnrolledCredentialId(): string | null {
  try {
    return window.localStorage.getItem(BIOMETRIC_CRED_KEY);
  } catch {
    return null;
  }
}

export function clearEnrolledBiometric(): void {
  try {
    window.localStorage.removeItem(BIOMETRIC_CRED_KEY);
  } catch {
    // ignore
  }
}

export async function isPlatformBiometricSupported(): Promise<boolean> {
  const native = getNativeSecurityPlugin();
  if (native?.isBiometricAvailable) {
    try {
      const res = await native.isBiometricAvailable();
      if (res.available) return true;
    } catch {
      // fall through to WebAuthn check
    }
  }
  if (
    typeof window !== 'undefined' &&
    window.PublicKeyCredential &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  ) {
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }
  return false;
}

export async function enrollDeviceBiometric(displayName: string): Promise<{ ok: boolean; error?: string }> {
  const native = getNativeSecurityPlugin();
  if (native?.isBiometricAvailable && native?.authenticateBiometric) {
    try {
      const avail = await native.isBiometricAvailable();
      if (avail.available) {
        const auth = await native.authenticateBiometric({
          title: '99Pay Biometric Shield',
          subtitle: 'Thibitisha alama ya kidole kuwezesha ufunguzi wa haraka',
        });
        if (auth.verified) {
          window.localStorage.setItem(BIOMETRIC_CRED_KEY, 'native-android-biometric');
          return { ok: true };
        }
        return { ok: false, error: auth.reason || 'Biometric verification cancelled.' };
      }
    } catch {
      // fall through to WebAuthn
    }
  }

  if (typeof window === 'undefined' || !navigator.credentials?.create || !window.PublicKeyCredential) {
    return {
      ok: false,
      error: 'Kifaa au kivinjari hiki hakiruhusu WebAuthn Biometrics. Tumia PIN yako ya Vault.',
    };
  }

  try {
    const supported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!supported) {
      return {
        ok: false,
        error: 'Kihisi cha alama ya kidole/uso (Platform Authenticator) hakijapatikana kwenye kifaa hiki.',
      };
    }

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userId = window.crypto.getRandomValues(new Uint8Array(16));

    const credential = (await navigator.credentials.create({
      publicKey: {
        challenge: toArrayBuffer(challenge),
        rp: {
          name: '99Pay Digital Wallet',
          id: window.location.hostname,
        },
        user: {
          id: toArrayBuffer(userId),
          name: displayName || '99pay-vault-owner',
          displayName: displayName || '99Pay Vault Owner',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
      },
    })) as PublicKeyCredential | null;

    if (!credential) {
      return { ok: false, error: 'Usajili wa alama ya kidole umesitishwa.' };
    }

    const credId = toBase64Url(new Uint8Array(credential.rawId));
    window.localStorage.setItem(BIOMETRIC_CRED_KEY, credId);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Biometric enrollment failed.';
    return { ok: false, error: message };
  }
}

export async function verifyDeviceBiometric(
  title: string,
  subtitle: string
): Promise<{ verified: boolean; reason?: string }> {
  const storedCredId = getEnrolledCredentialId();
  if (!storedCredId) {
    return {
      verified: false,
      reason: 'NOT_ENROLLED',
    };
  }

  const native = getNativeSecurityPlugin();
  if (native?.authenticateBiometric && storedCredId === 'native-android-biometric') {
    try {
      return await native.authenticateBiometric({ title, subtitle });
    } catch {
      return { verified: false, reason: 'NATIVE_FAILED' };
    }
  }

  if (typeof window === 'undefined' || !navigator.credentials?.get) {
    return { verified: false, reason: 'UNSUPPORTED' };
  }

  try {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const credBytes = fromBase64Url(storedCredId);

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: toArrayBuffer(challenge),
        rpId: window.location.hostname,
        allowCredentials: [
          {
            id: toArrayBuffer(credBytes),
            type: 'public-key',
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      },
    });

    if (!assertion) {
      return { verified: false, reason: 'CANCELLED' };
    }
    return { verified: true };
  } catch {
    return { verified: false, reason: 'VERIFICATION_FAILED' };
  }
}
