import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gravity.wallet',
  appName: 'Gravity Wallet',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    App: {
      deepLinkingEnabled: true,
      deepLinkingCustomScheme: 'gravitywallet'
    }
  }
};

export default config;
