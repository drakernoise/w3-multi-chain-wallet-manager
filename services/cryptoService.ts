import { Vault } from '../types';

declare const chrome: any;

// Constants for encryption
const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 600000; // Increased to OWASP standard
const ALGO = 'AES-GCM';
const HASH = 'SHA-256';

// Convert string to buffer
const enc = new TextEncoder();
const dec = new TextDecoder();

let cachedKey: CryptoKey | null = null;
let cachedSalt: Uint8Array | null = null;

// Derived key from password string
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encPassword = enc.encode(password);
  return getKeyFromBytes(encPassword, salt);
}

// Derived key from password bytes (skips UTF-8 encoding)
async function getKeyFromBytes(passwordBytes: Uint8Array, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    passwordBytes as unknown as BufferSource,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: HASH,
    },
    keyMaterial,
    { name: ALGO, length: 256 },
    true, // Extractable (needed for session persistence)
    ['encrypt', 'decrypt']
  );
}

// Persist the internal key for Passwordless auth (Google/Bio)
// WARNING: In a production extension, this key should be wrapped or stored more securely.
// Since this is a demo/mock environment without a backend, we store it in local storage 
// but it essentially acts as a "device token".
async function storeInternalKey(key: string) {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.set({ 'device_auth_struct': key });
  } else {
    localStorage.setItem('device_auth_struct', key);
  }
}

export async function getInternalKey(): Promise<string | null> {
  // Legacy or Raw key (unsafe)
  let val: any;
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['device_auth_struct']);
    val = res.device_auth_struct;
  } else {
    val = localStorage.getItem('device_auth_struct');
  }

  if (!val) return null;

  try {
    if (typeof val === 'string' && val.trim().startsWith('{')) {
      val = JSON.parse(val);
    }
    if (typeof val === 'object' && val !== null) {
      if (val.k) return val.k;
      if (val.key) return val.key;
    }
  } catch (e) { }

  return typeof val === 'string' ? val : String(val);
}

// Check if a PIN-protected key exists
export async function hasPinProtectedKey(): Promise<boolean> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['device_pin_data']);
    return !!res.device_pin_data;
  }
  return !!localStorage.getItem('device_pin_data');
}

export async function saveInternalKeyWithPin(keyStr: string, pin: string): Promise<void> {
  // Use high iterations for PIN because entropy is low
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const pinKey = await getKey(pin, salt);

  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encData = new TextEncoder().encode(keyStr);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    pinKey,
    encData
  );

  // Pack: salt + iv + ciphertext
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);

  const base64 = btoa(String.fromCharCode(...bundle));

  if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.set({ 'device_pin_data': base64 });
    // Clear unsafe legacy key if exists
    await chrome.storage.local.remove('device_auth_struct');
  } else {
    localStorage.setItem('device_pin_data', base64);
    localStorage.removeItem('device_auth_struct');
  }
}

export async function loadInternalKeyWithPin(pin: string): Promise<string | null> {
  let base64: string | undefined | null;
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['device_pin_data']);
    base64 = res.device_pin_data;
  } else {
    base64 = localStorage.getItem('device_pin_data');
  }

  if (!base64) return null;

  try {
    const bundle = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);

    const key = await getKey(pin, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (e) {
    console.error("PIN Decryption failed", e);
    return null; // Wrong PIN
  }
}

export async function initVault(password: string): Promise<Vault> {
  const emptyVault: Vault = { accounts: [], lastUpdated: Date.now() };
  await saveVault(password, emptyVault);
  return emptyVault;
}

// For Google Auth / Biometrics where we don't have a user password,
// we generate a high-entropy internal key and SAVE IT.
export async function initVaultWithGeneratedKey(pin?: string): Promise<{ vault: Vault, internalKey: string }> {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // SAVE THE KEY
  if (pin) {
    await saveInternalKeyWithPin(internalKey, pin);
  } else {
    await storeInternalKey(internalKey); // Legacy/Insecure fallback
  }

  const emptyVault: Vault = { accounts: [], lastUpdated: Date.now() };

  // Explicitly cache key logic here to ensure first save works
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;

  await saveVault(internalKey, emptyVault);

  return { vault: emptyVault, internalKey };
}

export async function saveVault(password: string, vault: Vault): Promise<void> {
  let salt: Uint8Array;
  let key: CryptoKey;

  // Check if using cached session
  if (password === 'cached') {
    if (cachedKey && cachedSalt) {
      key = cachedKey;
      salt = cachedSalt;
    } else {
      throw new Error("Attempted to save with cached key but cache is empty!");
    }
  } else {
    // New encryption session (or re-keying)
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
    key = await getKey(password, salt);
    // Cache for this session
    cachedKey = key;
    cachedSalt = salt;
    // Persist to session storage
    await persistSession();
  }

  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));

  const encodedData = enc.encode(JSON.stringify(vault));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encodedData
  );

  // Pack: salt + iv + ciphertext
  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);

  // Store as base64
  const base64 = btoa(String.fromCharCode(...bundle));

  if (typeof chrome !== 'undefined' && chrome.storage) {
    await chrome.storage.local.set({ vaultData: base64 });
  } else {
    localStorage.setItem('vaultData', base64);
  }
}

export async function getVault(): Promise<string | null> {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['vaultData']);
    return res.vaultData || null;
  } else {
    return localStorage.getItem('vaultData');
  }
}

// Helper for trying decryption with a specific password string
async function tryDecrypt(password: string, base64Vault: string): Promise<Vault | null> {
  try {
    const bundle = Uint8Array.from(atob(base64Vault), c => c.charCodeAt(0));

    const salt = bundle.slice(0, SALT_LEN);
    const iv = bundle.slice(SALT_LEN, SALT_LEN + IV_LEN);
    const ciphertext = bundle.slice(SALT_LEN + IV_LEN);

    const key = await getKey(password, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: ALGO, iv },
      key,
      ciphertext
    );

    // Cache successful login
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();

    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    return null;
  }
}

export async function unlockVault(password: string): Promise<Vault | null> {
  let base64: string | null = null;

  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['vaultData']);
    base64 = res.vaultData;
  } else {
    base64 = localStorage.getItem('vaultData');
  }

  if (!base64) return null;

  // 1. Try raw password
  let vault = await tryDecrypt(password, base64);
  if (vault) return vault;

  console.warn("Standard decryption failed, trying Base64 decode fallback...");

  // 2. Try decoding Base64 password (legacy format support)
  try {
    // Only if it looks like base64
    if (/^[A-Za-z0-9+/=]+$/.test(password)) {
      const decoded = atob(password);
      vault = await tryDecrypt(decoded, base64);
      if (vault) {
        console.log("Success with Base64 decoded password");
        return vault;
      }
    }
  } catch (e) {
    // Ignore invalid base64
  }

  console.error("All decryption attempts failed.");
  return null;
}

// Utility to clear cache on lock
export function clearCryptoCache() {
  cachedKey = null;
  cachedSalt = null;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
    chrome.storage.session.remove('crypto_session');
  }
}

// Persist session key to memory (not disk)
async function persistSession() {
  if (!cachedKey || !cachedSalt) return;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
    const exported = await window.crypto.subtle.exportKey('raw', cachedKey);
    const saltArr = Array.from(cachedSalt);
    const keyArr = Array.from(new Uint8Array(exported));
    chrome.storage.session.set({
      crypto_session: { key: keyArr, salt: saltArr }
    });
  }
}

// Restore session from memory
export async function tryRestoreSession(): Promise<boolean> {
  if (cachedKey) return true; // Already loaded

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
    return new Promise((resolve) => {
      chrome.storage.session.get(['crypto_session'], async (res: any) => {
        if (res.crypto_session) {
          try {
            const { key, salt } = res.crypto_session;
            // Import the raw AES-GCM key directly (it was derived, but exported as raw)
            // Actually, deriveKey returns an AES-GCM key.
            const importedKey = await window.crypto.subtle.importKey(
              'raw',
              new Uint8Array(key),
              ALGO, // 'AES-GCM'
              true,
              ['encrypt', 'decrypt']
            );

            cachedKey = importedKey;
            cachedSalt = new Uint8Array(salt);
            resolve(true);
          } catch (e) {
            console.warn("Session restore failed", e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    });
  }
  return false;
}