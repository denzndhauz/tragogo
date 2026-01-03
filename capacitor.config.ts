import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.tragogo.app',
    appName: 'tragogo',
    webDir: '.output/public',
    plugins: {
        StatusBar: {
            overlaysWebView: true,
            style: 'DEFAULT'
        }
    }
};

export default config;
