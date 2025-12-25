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
    // WebAuthn RP ID must be a valid domain. Extensions use chrome-extension://[ID]
    // If the hostname is just the extension ID (usually 32 chars), it's not a valid RP ID.
    const isValidDomain = host.includes('.') && host.length < 40;

    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Gravity Wallet",
        id: isValidDomain ? host : undefined,
      },
      user: {
        id: window.crypto.getRandomValues(new Uint8Array(16)),
        name: "gravity_user_" + Math.floor(Math.random() * 10000),
        displayName: "Gravity Wallet Owner"
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },    // ES256
        { alg: -257, type: "public-key" },  // RS256
        { alg: -8, type: "public-key" },    // Ed25519
      ],
      authenticatorSelection: {
        userVerification: "required",
        residentKey: "preferred"
      },
      timeout: 120000,
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