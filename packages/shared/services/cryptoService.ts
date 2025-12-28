import { Vault, Account } from '../types';
import { storageService } from './storageService';

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
async function storeInternalKey(key: string) {
  await storageService.setItem('device_auth_struct', key);
}

export async function getInternalKey(): Promise<string | null> {
  let val = await storageService.getItem('device_auth_struct');
  if (!val) return null;

  try {
    if (typeof val === 'string' && val.trim().startsWith('{')) {
      const parsed = JSON.parse(val);
      if (parsed.k) return parsed.k;
      if (parsed.key) return parsed.key;
    }
  } catch (e) { }

  return typeof val === 'string' ? val : String(val);
}

// Check if a PIN-protected key exists
export async function hasPinProtectedKey(): Promise<boolean> {
  const res = await storageService.getItem('device_pin_data');
  return !!res;
}

export async function saveInternalKeyWithPin(keyStr: string, pin: string): Promise<void> {
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const pinKey = await getKey(pin, salt);

  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encData = new TextEncoder().encode(keyStr);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    pinKey,
    encData
  );

  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);

  const base64 = btoa(String.fromCharCode(...bundle));

  await storageService.setItem('device_pin_data', base64);
  await storageService.removeItem('device_auth_struct');
}

export async function loadInternalKeyWithPin(pin: string): Promise<string | null> {
  const base64 = await storageService.getItem('device_pin_data');
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
    return null;
  }
}

export async function initVault(password: string): Promise<Vault> {
  const emptyVault: Vault = { accounts: [], lastUpdated: Date.now() };
  await saveVault(password, emptyVault);
  return emptyVault;
}

export async function initVaultWithGeneratedKey(pin?: string): Promise<{ vault: Vault, internalKey: string }> {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  if (pin) {
    await saveInternalKeyWithPin(internalKey, pin);
  } else {
    throw new Error("Security Violation: Cannot initialize vault without a PIN or password protection.");
  }

  const emptyVault: Vault = { accounts: [], lastUpdated: Date.now() };

  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;

  await saveVault(internalKey, emptyVault);
  return { vault: emptyVault, internalKey };
}

export async function enablePasswordless(accounts: Account[]): Promise<void> {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  await storeInternalKey(internalKey);

  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
  const key = await getKey(internalKey, salt);
  cachedKey = key;
  cachedSalt = salt;

  const vault: Vault = { accounts, lastUpdated: Date.now() };
  await saveVault(internalKey, vault);
}

export async function saveVault(password: string, vault: Vault): Promise<void> {
  let salt: Uint8Array;
  let key: CryptoKey;

  if (password === 'cached') {
    if (cachedKey && cachedSalt) {
      key = cachedKey;
      salt = cachedSalt;
    } else {
      throw new Error("Attempted to save with cached key but cache is empty!");
    }
  } else {
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
    key = await getKey(password, salt);
    cachedKey = key;
    cachedSalt = salt;
    await persistSession();
  }

  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encodedData = enc.encode(JSON.stringify(vault));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encodedData
  );

  const bundle = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  bundle.set(salt, 0);
  bundle.set(iv, SALT_LEN);
  bundle.set(new Uint8Array(encrypted), SALT_LEN + IV_LEN);

  const base64 = btoa(String.fromCharCode(...bundle));
  await storageService.setItem('vaultData', base64);
}

export async function getVault(): Promise<string | null> {
  return await storageService.getItem('vaultData');
}

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

    cachedKey = key;
    cachedSalt = salt;
    await persistSession();

    return JSON.parse(dec.decode(decrypted));
  } catch (e) {
    return null;
  }
}

export async function unlockVault(password: string): Promise<Vault | null> {
  const base64 = await storageService.getItem('vaultData');
  if (!base64) return null;

  let vault = await tryDecrypt(password, base64);
  if (vault) return vault;

  try {
    if (/^[A-Za-z0-9+/=]+$/.test(password)) {
      const decoded = atob(password);
      vault = await tryDecrypt(decoded, base64);
      if (vault) return vault;
    }
  } catch (e) { }

  return null;
}

export function clearCryptoCache() {
  cachedKey = null;
  cachedSalt = null;
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
    chrome.storage.session.remove('crypto_session');
  }
}

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

export async function tryRestoreSession(): Promise<boolean> {
  if (cachedKey) return true;

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.session) {
    return new Promise((resolve) => {
      chrome.storage.session.get(['crypto_session'], async (res: any) => {
        if (res.crypto_session) {
          try {
            const { key, salt } = res.crypto_session;
            const importedKey = await window.crypto.subtle.importKey(
              'raw',
              new Uint8Array(key),
              ALGO,
              true,
              ['encrypt', 'decrypt']
            );

            cachedKey = importedKey;
            cachedSalt = new Uint8Array(salt);
            resolve(true);
          } catch (e) {
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

// E2EE Utilities
export async function generateEncryptionKeys(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey', 'deriveBits']
  );
}

export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const format = key.type === 'public' ? 'spki' : 'pkcs8';
  const exported = await window.crypto.subtle.exportKey(format, key);
  const buffer = new Uint8Array(exported);
  return btoa(String.fromCharCode(...buffer));
}

export async function importKeyFromBase64(base64: string, type: 'public' | 'private'): Promise<CryptoKey> {
  const binary = atob(base64);
  const buffer = Uint8Array.from(binary, c => c.charCodeAt(0));
  const format = type === 'public' ? 'spki' : 'pkcs8';

  return window.crypto.subtle.importKey(
    format,
    buffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    type === 'public' ? [] : ['deriveKey', 'deriveBits']
  );
}

export async function deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: 'ECDH', public: publicKey },
    privateKey,
    256
  );

  const keyMaterial = await window.crypto.subtle.digest('SHA-256', sharedBits);
  return window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(text: string, sharedKey: CryptoKey): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = enc.encode(text);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    sharedKey,
    encoded
  );

  const bundle = new Uint8Array(iv.length + encrypted.byteLength);
  bundle.set(iv, 0);
  bundle.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...bundle));
}

export async function decryptMessage(base64Bundle: string, sharedKey: CryptoKey): Promise<string> {
  try {
    const binary = atob(base64Bundle);
    const bundle = Uint8Array.from(binary, c => c.charCodeAt(0));

    const iv = bundle.slice(0, 12);
    const ciphertext = bundle.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      sharedKey,
      ciphertext
    );

    return dec.decode(decrypted);
  } catch (e) {
    return "[Encrypted Message - Cannot Decrypt]";
  }
}