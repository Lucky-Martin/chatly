import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chatlyapp.nanodigital',
  appName: 'chatly',
  webDir: 'dist/browser/',
  server: {
    url: 'http://172.20.10.11:4200/',
    cleartext: true,
  }
};

export default config;
