import { Capacitor, registerPlugin } from '@capacitor/core';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

interface GravityQrScannerPlugin {
  scan(): Promise<{
    rawValue?: string;
    displayValue?: string;
  }>;
}

const GravityQrScanner = registerPlugin<GravityQrScannerPlugin>('GravityQrScanner');

export const scanGravityQrCode = async () => {
  if (Capacitor.isNativePlatform()) {
    let permissions = await BarcodeScanner.checkPermissions();
    if (permissions.camera !== 'granted') {
      permissions = await BarcodeScanner.requestPermissions();
    }
    if (permissions.camera !== 'granted') {
      throw new Error('Camera permission is required to scan the QR code.');
    }
  }

  if (Capacitor.getPlatform() === 'android') {
    const result = await GravityQrScanner.scan();
    return result.displayValue || result.rawValue || '';
  }

  const result = await BarcodeScanner.scan({
    formats: [BarcodeFormat.QrCode]
  });
  return result.barcodes[0]?.displayValue || result.barcodes[0]?.rawValue || '';
};
