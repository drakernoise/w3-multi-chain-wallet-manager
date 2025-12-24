// Mock service for Google Identity API
export const authenticateWithGoogle = async (): Promise<{ id: string, email: string } | null> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        id: 'google_user_123',
        email: 'user@example.com'
      });
    }, 1000);
  });
};

// Check if platform authenticator (TouchID/FaceID/Windows Hello) is available
export const isBiometricsAvailable = async (): Promise<boolean> => {
  if (!window.PublicKeyCredential) return false;

  try {
    // Check if the device has a platform authenticator (e.g. TouchID)
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch (e) {
    console.warn("Biometric check failed or not supported in this context", e);
    // Fallback for dev environments where this API might throw
    return false;
  }
};

// Register a new credential (Setup Phase)
export const registerBiometrics = async (): Promise<boolean> => {
  try {
    // In a real app, the challenge comes from the backend to prevent replay attacks.
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Gravity Wallet",
        // Removing ID allows it to default to the extension origin correctly
      },
      user: {
        id: new Uint8Array(16),
        name: "wallet_owner",
        displayName: "Gravity Wallet Owner"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },  // ES256 (Most common for mobile/modern)
        { alg: -257, type: "public-key" } // RS256 (Common for Windows Hello)
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      },
      timeout: 60000,
      attestation: "none"
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions
    });

    return !!credential;
  } catch (error) {
    console.error("Biometric registration failed:", error);
    return false;
  }
};

// Authenticate with existing credential (Unlock Phase)
export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      timeout: 60000,
      userVerification: "required"
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions
    });

    return !!assertion;
  } catch (error) {
    console.error("Biometric auth failed:", error);
    return false;
  }
};