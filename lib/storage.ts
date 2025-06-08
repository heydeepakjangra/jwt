'use client';

import { StoredToken, KeyInfo } from './types';

// Storage keys
const TOKENS_KEY = 'jwt-tool-tokens';
const KEYS_KEY = 'jwt-tool-keys';

// Token storage
export class TokenStorage {
  private static instance: TokenStorage;
  
  private constructor() {}
  
  static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }

  // Save token
  saveToken(token: StoredToken): void {
    try {
      const tokens = this.getAllTokens();
      const existingIndex = tokens.findIndex(t => t.id === token.id);
      
      if (existingIndex >= 0) {
        tokens[existingIndex] = token;
      } else {
        tokens.push(token);
      }
      
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  // Get all tokens
  getAllTokens(): StoredToken[] {
    try {
      const stored = localStorage.getItem(TOKENS_KEY);
      if (!stored) return [];
      
      const tokens = JSON.parse(stored);
      return tokens.map((token: unknown) => {
        const t = token as Record<string, unknown>;
        return {
          ...t,
          created: new Date(t.created as string),
          expires: t.expires ? new Date(t.expires as string) : undefined,
        } as StoredToken;
      });
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return [];
    }
  }

  // Get token by ID
  getToken(id: string): StoredToken | undefined {
    const tokens = this.getAllTokens();
    return tokens.find(token => token.id === id);
  }

  // Delete token
  deleteToken(id: string): void {
    try {
      const tokens = this.getAllTokens();
      const filtered = tokens.filter(token => token.id !== id);
      localStorage.setItem(TOKENS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete token:', error);
    }
  }

  // Get tokens by tag
  getTokensByTag(tag: string): StoredToken[] {
    const tokens = this.getAllTokens();
    return tokens.filter(token => token.tags.includes(tag));
  }

  // Get expired tokens
  getExpiredTokens(): StoredToken[] {
    const tokens = this.getAllTokens();
    const now = new Date();
    return tokens.filter(token => token.expires && token.expires < now);
  }

  // Clear all tokens
  clearAllTokens(): void {
    try {
      localStorage.removeItem(TOKENS_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
}

// Key storage
export class KeyStorage {
  private static instance: KeyStorage;
  
  private constructor() {}
  
  static getInstance(): KeyStorage {
    if (!KeyStorage.instance) {
      KeyStorage.instance = new KeyStorage();
    }
    return KeyStorage.instance;
  }

  // Save key info (metadata only, not the actual key)
  saveKeyInfo(keyInfo: KeyInfo): void {
    try {
      const keys = this.getAllKeyInfos();
      const existingIndex = keys.findIndex(k => k.id === keyInfo.id);
      
      if (existingIndex >= 0) {
        keys[existingIndex] = keyInfo;
      } else {
        keys.push(keyInfo);
      }
      
      localStorage.setItem(KEYS_KEY, JSON.stringify(keys));
    } catch (error) {
      console.error('Failed to save key info:', error);
    }
  }

  // Get all key infos
  getAllKeyInfos(): KeyInfo[] {
    try {
      const stored = localStorage.getItem(KEYS_KEY);
      if (!stored) return [];
      
      const keys = JSON.parse(stored);
      return keys.map((key: unknown) => {
        const k = key as Record<string, unknown>;
        return {
          ...k,
          created: new Date(k.created as string),
        } as KeyInfo;
      });
    } catch (error) {
      console.error('Failed to get key infos:', error);
      return [];
    }
  }

  // Get key info by ID
  getKeyInfo(id: string): KeyInfo | undefined {
    const keys = this.getAllKeyInfos();
    return keys.find(key => key.id === id);
  }

  // Delete key info
  deleteKeyInfo(id: string): void {
    try {
      const keys = this.getAllKeyInfos();
      const filtered = keys.filter(key => key.id !== id);
      localStorage.setItem(KEYS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete key info:', error);
    }
  }

  // Get keys by algorithm
  getKeysByAlgorithm(algorithm: string): KeyInfo[] {
    const keys = this.getAllKeyInfos();
    return keys.filter(key => key.algorithm === algorithm);
  }

  // Clear all key infos
  clearAllKeyInfos(): void {
    try {
      localStorage.removeItem(KEYS_KEY);
    } catch (error) {
      console.error('Failed to clear key infos:', error);
    }
  }
}

// Export/Import utilities
export function exportTokensToJSON(tokens: StoredToken[]): string {
  return JSON.stringify(tokens, null, 2);
}

export function importTokensFromJSON(jsonString: string): StoredToken[] {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid format: expected array');
    }
    
    return parsed.map((token: unknown) => {
      const t = token as Record<string, unknown>;
      return {
        ...t,
        created: new Date(t.created as string),
        expires: t.expires ? new Date(t.expires as string) : undefined,
      } as StoredToken;
    });
  } catch (error) {
    throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Utility to detect JWT in text
export function extractJWTFromText(text: string): string[] {
  const jwtRegex = /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g;
  return text.match(jwtRegex) || [];
}

// Utility to detect if string is a JWT
export function isJWT(text: string): boolean {
  const parts = text.split('.');
  if (parts.length !== 3) return false;
  
  try {
    // Try to decode the header and payload
    atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
    atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return true;
  } catch {
    return false;
  }
} 