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

    const host = window.location.hostname || "";
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Gravity Wallet",
        id: (host === "localhost" || !host) ? undefined : host,
      },
      user: {
        id: new Uint8Array(16),
        name: "wallet_owner",
        displayName: "Gravity Wallet Owner"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },    // ES256
        { alg: -257, type: "public-key" },  // RS256
        { alg: -35, type: "public-key" },   // ES384
        { alg: -36, type: "public-key" },   // ES512
        { alg: -37, type: "public-key" },   // PS256
        { alg: -38, type: "public-key" },   // PS384
        { alg: -39, type: "public-key" },   // PS512
        { alg: -8, type: "public-key" },    // Ed25519
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required",
        residentKey: "preferred",
        requireResidentKey: false
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