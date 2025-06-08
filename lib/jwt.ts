'use client';

import * as jose from 'jose';
import { 
  JWTAlgorithm, 
  JWTHeader, 
  JWTPayload, 
  KeyPair, 
  ValidationResult,
  KeyGenerationOptions,
  JWTHeaderSchema,
  JWTPayloadSchema
} from './types';

// Generate JWT Token
export async function generateJWT(
  header: JWTHeader,
  payload: JWTPayload,
  secret: string | CryptoKey,
  algorithm: JWTAlgorithm = 'HS256'
): Promise<string> {
  try {
    // Validate inputs
    const validHeader = JWTHeaderSchema.parse({ ...header, alg: algorithm });
    const validPayload = JWTPayloadSchema.parse(payload);

    let jwt: string;

    if (algorithm.startsWith('HS')) {
      // HMAC algorithms
      const secretKey = typeof secret === 'string' 
        ? new TextEncoder().encode(secret)
        : secret;
      jwt = await new jose.SignJWT(validPayload)
        .setProtectedHeader(validHeader)
        .sign(secretKey);
    } else {
      // Asymmetric algorithms
      if (typeof secret === 'string') {
        throw new Error('Asymmetric algorithms require a CryptoKey');
      }
      jwt = await new jose.SignJWT(validPayload)
        .setProtectedHeader(validHeader)
        .sign(secret);
    }

    return jwt;
  } catch (error) {
    throw new Error(`JWT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Decode JWT (without verification)
export function decodeJWT(token: string): { header: JWTHeader; payload: JWTPayload; signature: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    const signature = parts[2];

    return { header, payload, signature };
  } catch (error) {
    throw new Error(`JWT decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Verify JWT
export async function verifyJWT(
  token: string,
  secret: string | CryptoKey,
  algorithm?: JWTAlgorithm
): Promise<ValidationResult> {
  try {
    const { header } = decodeJWT(token);
    const alg = algorithm || header.alg as JWTAlgorithm;

    let result;

    if (alg.startsWith('HS')) {
      // HMAC algorithms
      const secretKey = typeof secret === 'string' 
        ? new TextEncoder().encode(secret)
        : secret;
      result = await jose.jwtVerify(token, secretKey);
    } else {
      // Asymmetric algorithms
      if (typeof secret === 'string') {
        // Try to import as PEM
        const publicKey = await jose.importSPKI(secret, alg);
        result = await jose.jwtVerify(token, publicKey);
      } else {
        result = await jose.jwtVerify(token, secret);
      }
    }

    return {
      isValid: true,
      header: result.protectedHeader as JWTHeader,
      payload: result.payload as JWTPayload,
    };
  } catch (error) {
    const decoded = decodeJWT(token);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature,
    };
  }
}

// Check if Web Crypto API is available
function checkCryptoAPIAvailability(): void {
  if (typeof window !== 'undefined') {
    if (!window.crypto) {
      throw new Error('Web Crypto API not available. Please use a modern browser with HTTPS connection.');
    }
    if (!window.crypto.subtle) {
      throw new Error('Web Crypto subtle API not available. This may be due to an insecure context (HTTP instead of HTTPS) or browser limitations.');
    }
  } else if (typeof global !== 'undefined') {
    if (!global.crypto || !global.crypto.subtle) {
      throw new Error('Crypto API not available in this server environment.');
    }
  } else {
    throw new Error('Crypto API not available in this environment.');
  }
}



// Generate Key Pair
export async function generateKeyPair(options: KeyGenerationOptions): Promise<KeyPair> {
  const { algorithm, keySize, namedCurve } = options;

  try {
    checkCryptoAPIAvailability();
    if (algorithm.startsWith('RS') || algorithm.startsWith('PS')) {
      // RSA keys
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: keySize || 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: algorithm.includes('256') ? 'SHA-256' : 
                algorithm.includes('384') ? 'SHA-384' : 'SHA-512',
        },
        true,
        ['sign', 'verify']
      ) as CryptoKeyPair;
      return keyPair;
    } else if (algorithm.startsWith('ES')) {
      // ECDSA keys
      const curve = namedCurve || 
        (algorithm === 'ES256' ? 'P-256' :
         algorithm === 'ES384' ? 'P-384' : 'P-521');
      
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: curve,
        },
        true,
        ['sign', 'verify']
      ) as CryptoKeyPair;
      return keyPair;
    } else if (algorithm === 'EdDSA') {
      // Ed25519 keys
      const keyPair = await crypto.subtle.generateKey(
        {
          name: 'Ed25519',
        },
        true,
        ['sign', 'verify']
      ) as CryptoKeyPair;
      return keyPair;
    } else {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  } catch (error) {
    throw new Error(`Key generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Generate secret key for HMAC
export function generateSecret(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Export key to PEM format
export async function exportKeyToPEM(key: CryptoKey, type: 'public' | 'private'): Promise<string> {
  try {
    if (type === 'public') {
      const exported = await crypto.subtle.exportKey('spki', key);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
      return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
    } else {
      const exported = await crypto.subtle.exportKey('pkcs8', key);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
      return `-----BEGIN PRIVATE KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;
    }
  } catch (error) {
    throw new Error(`Key export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Export key to JWK format
export async function exportKeyToJWK(key: CryptoKey): Promise<jose.JWK> {
  try {
    const jwk = await jose.exportJWK(key);
    return jwk;
  } catch (error) {
    throw new Error(`JWK export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Import key from PEM
export async function importKeyFromPEM(pem: string, algorithm: JWTAlgorithm): Promise<CryptoKey> {
  try {
    if (pem.includes('PRIVATE KEY')) {
      return await jose.importPKCS8(pem, algorithm);
    } else {
      return await jose.importSPKI(pem, algorithm);
    }
  } catch (error) {
    throw new Error(`PEM import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Import key from JWK
export async function importKeyFromJWK(jwk: jose.JWK, algorithm?: JWTAlgorithm): Promise<CryptoKey> {
  try {
    const key = await jose.importJWK(jwk, algorithm);
    if (key instanceof Uint8Array) {
      throw new Error('Expected CryptoKey but got Uint8Array');
    }
    return key;
  } catch (error) {
    throw new Error(`JWK import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility functions for time-based claims
export function createTimeBasedPayload(payload: JWTPayload): JWTPayload {
  const now = Math.floor(Date.now() / 1000);
  
  return {
    ...payload,
    iat: payload.iat || now,
    exp: payload.exp || (now + 3600), // Default 1 hour expiry
    nbf: payload.nbf || now,
  };
}

// Check if token is expired
export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

// Get token expiry information
export function getTokenExpiry(payload: JWTPayload): { 
  isExpired: boolean; 
  expiresAt?: Date; 
  timeUntilExpiry?: number;
} {
  if (!payload.exp) {
    return { isExpired: false };
  }

  const expiresAt = new Date(payload.exp * 1000);
  const timeUntilExpiry = payload.exp * 1000 - Date.now();
  
  return {
    isExpired: timeUntilExpiry <= 0,
    expiresAt,
    timeUntilExpiry: timeUntilExpiry > 0 ? timeUntilExpiry : undefined,
  };
} 