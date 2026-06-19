package com.gravity.wallet;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.mlkit.vision.barcode.common.Barcode;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner;
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions;
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning;

@CapacitorPlugin(name = "GravityQrScanner")
public class GravityQrScannerPlugin extends Plugin {

    @PluginMethod
    public void scan(PluginCall call) {
        GmsBarcodeScannerOptions options = new GmsBarcodeScannerOptions.Builder()
            .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
            .enableAutoZoom()
            .build();
        GmsBarcodeScanner scanner = GmsBarcodeScanning.getClient(getContext(), options);

        scanner.startScan()
            .addOnSuccessListener(barcode -> {
                String value = barcode.getRawValue();
                if (value == null || value.isEmpty()) {
                    call.reject("QR code has no value.");
                    return;
                }

                JSObject response = new JSObject();
                response.put("rawValue", value);
                response.put("displayValue", barcode.getDisplayValue());
                call.resolve(response);
            })
            .addOnCanceledListener(() -> call.reject("scan canceled."))
            .addOnFailureListener(error -> call.reject("Unable to scan QR code.", error));
    }
}
