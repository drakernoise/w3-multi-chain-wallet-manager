
/**
 * BiometricService
 * Handles WebAuthn registration and authentication for basic biometric support.
 * Note: Chrome extensions have some limitations with WebAuthn depending on the context.
 */
class BiometricService {
    private rpId: string;
    private rpName: string;

    constructor() {
        this.rpId = window.location.hostname || 'gravity-wallet';
        this.rpName = 'Gravity Wallet';
    }

    /**
     * Check if the device / browser supports biometrics (Platform Authenticator)
     */
    public async isSupported(): Promise<boolean> {
        if (!window.PublicKeyCredential) return false;

        try {
            return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch (e) {
            return false;
        }
    }

    /**
     * Registers a new biometric credential
     * @param username The display name for the credential
     * @returns The credential ID if successful
     */
    public async register(username: string): Promise<string | null> {
        const isAvailable = await this.isSupported();
        if (!isAvailable) throw new Error('Biometrics not available on this device');

        // Generating a random challenge
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        // Generating a random user ID
        const userId = new Uint8Array(16);
        window.crypto.getRandomValues(userId);

        const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
            challenge,
            rp: {
                name: this.rpName,
                id: this.rpId === 'localhost' ? undefined : this.rpId,
            },
            user: {
                id: userId,
                name: username,
                displayName: username,
            },
            pubKeyCredParams: [
                { alg: -7, type: 'public-key' }, // ES256
                { alg: -257, type: 'public-key' }, // RS256
            ],
            authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'required',
                residentKey: 'preferred',
                requireResidentKey: false,
            },
            timeout: 60000,
            attestation: 'none',
        };

        try {
            const credential = (await navigator.credentials.create({
                publicKey: publicKeyCredentialCreationOptions,
            })) as PublicKeyCredential;

            if (!credential) return null;

            // In a real production app, we would send the public key to a server.
            // For an extension, we can store the credential ID to verify later.
            return btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
        } catch (err: any) {
            console.error('Biometric registration failed:', err);
            throw err;
        }
    }

    /**
     * Authenticates using biometrics
     * @param credentialIdB64 The base64 stored credential ID
     */
    public async authenticate(credentialIdB64: string): Promise<boolean> {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credentialId = new Uint8Array(
            atob(credentialIdB64)
                .split('')
                .map((c) => c.charCodeAt(0))
        );

        const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
            challenge,
            allowCredentials: [
                {
                    id: credentialId,
                    type: 'public-key',
                    transports: ['internal'],
                },
            ],
            userVerification: 'required',
            timeout: 60000,
        };

        try {
            const assertion = (await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions,
            })) as PublicKeyCredential;

            return !!assertion;
        } catch (err: any) {
            console.error('Biometric authentication failed:', err);
            return false;
        }
    }
}

export const biometricService = new BiometricService();
