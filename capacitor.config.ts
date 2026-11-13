import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nineninepay.wallet',
  appName: '99Pay',
  webDir: 'dist',
  backgroundColor: '#03120E',
  android: {
    allowMixedContent: false,
    backgroundColor: '#03120E',
  },
};

export default config;
