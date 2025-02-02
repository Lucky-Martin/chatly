import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.chatlyapp.nanodigital',
  appName: 'chatly',
  webDir: 'dist/browser/',
  server: {
    url: 'http://192.168.0.103:4200',
    cleartext: true,
  }
};

export default config;
