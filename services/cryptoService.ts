import { Vault } from '../types';

declare const chrome: any;

// Constants for encryption
const SALT_LEN = 16;
const IV_LEN = 12;
const ITERATIONS = 100000;
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
    false,
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
  let val: any;
  if (typeof chrome !== 'undefined' && chrome.storage) {
    const res = await chrome.storage.local.get(['device_auth_struct']);
    val = res.device_auth_struct;
  } else {
    val = localStorage.getItem('device_auth_struct');
  }

  if (!val) return null;

  // Handle potential JSON obfuscation/wrapping
  try {
    // If it's a string that looks like JSON, parse it
    if (typeof val === 'string' && val.trim().startsWith('{')) {
      val = JSON.parse(val);
    }

    // If valid object, look for likely key properties
    if (typeof val === 'object' && val !== null) {
      if (val.k) return val.k; // Found in user log: { k: '...' }

      if (val.key) return val.key;
      if (val.token) return val.token;
      if (val.secret) return val.secret;
      // Debugging
      console.log("DEBUG: Found object in storage:", val);
    }
  } catch (e) {
    // Not JSON, just use as string
  }

  // Fallback: return raw value (if it was a simple string) or toString()
  return typeof val === 'string' ? val : String(val);
}

export async function initVault(password: string): Promise<Vault> {
  const emptyVault: Vault = { accounts: [], lastUpdated: Date.now() };
  await saveVault(password, emptyVault);
  return emptyVault;
}

// For Google Auth / Biometrics where we don't have a user password,
// we generate a high-entropy internal key and SAVE IT.
export async function initVaultWithGeneratedKey(): Promise<{ vault: Vault, internalKey: string }> {
  const internalKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  // SAVE THE KEY so we can log in later!
  await storeInternalKey(internalKey);

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
      console.error("Attempted to save with cached key but cache is empty!");
      return; // Fail safe
    }
  } else {
    // New encryption session (or re-keying)
    salt = window.crypto.getRandomValues(new Uint8Array(SALT_LEN));
    key = await getKey(password, salt);
    // Cache for this session
    cachedKey = key;
    cachedSalt = salt;
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
}