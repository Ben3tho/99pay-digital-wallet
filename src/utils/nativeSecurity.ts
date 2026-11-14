interface NineNinePaySecurityPlugin {
  setFlagSecure?: (opts: { enabled: boolean }) => Promise<{ enabled: boolean }>;
}

export async function syncNativeFlagSecure(enabled: boolean): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const cap = (window as {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      Plugins?: { NineNinePaySecurity?: NineNinePaySecurityPlugin };
    };
  }).Capacitor;

  if (!cap?.isNativePlatform?.() || !cap.Plugins?.NineNinePaySecurity?.setFlagSecure) {
    return false;
  }

  try {
    const res = await cap.Plugins.NineNinePaySecurity.setFlagSecure({ enabled });
    return Boolean(res?.enabled);
  } catch {
    return false;
  }
}
