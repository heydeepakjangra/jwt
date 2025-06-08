import { z } from 'zod';

// JWT Algorithm types
export type JWTAlgorithm = 
  | 'HS256' | 'HS384' | 'HS512'
  | 'RS256' | 'RS384' | 'RS512'
  | 'ES256' | 'ES384' | 'ES512'
  | 'PS256' | 'PS384' | 'PS512'
  | 'EdDSA';

// JWT Header
export const JWTHeaderSchema = z.object({
  alg: z.string(),
  typ: z.string().optional().default('JWT'),
  kid: z.string().optional(),
  jku: z.string().optional(),
  jwk: z.any().optional(),
  x5u: z.string().optional(),
  x5c: z.array(z.string()).optional(),
  x5t: z.string().optional(),
  'x5t#S256': z.string().optional(),
  cty: z.string().optional(),
  crit: z.array(z.string()).optional(),
});

export type JWTHeader = z.infer<typeof JWTHeaderSchema>;

// JWT Payload
export const JWTPayloadSchema = z.object({
  // Standard claims
  iss: z.string().optional(),
  sub: z.string().optional(),
  aud: z.union([z.string(), z.array(z.string())]).optional(),
  exp: z.number().optional(),
  nbf: z.number().optional(),
  iat: z.number().optional(),
  jti: z.string().optional(),
  // Custom claims (any additional properties)
}).catchall(z.any());

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

// Key types
export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export interface KeyInfo {
  id: string;
  name: string;
  algorithm: JWTAlgorithm;
  type: 'symmetric' | 'asymmetric';
  created: Date;
  keyData?: string; // For display/export
}

// Token storage
export interface StoredToken {
  id: string;
  name: string;
  token: string;
  created: Date;
  expires?: Date;
  tags: string[];
  algorithm: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  header?: JWTHeader;
  payload?: JWTPayload;
  signature?: string;
}

// Key generation options
export interface KeyGenerationOptions {
  algorithm: JWTAlgorithm;
  keySize?: number;
  namedCurve?: string;
}

// Export/Import formats
export type ExportFormat = 'PEM' | 'JWK' | 'JSON' | 'Compact';
export type ImportFormat = 'JWT' | 'JSON' | 'PEM' | 'JWK' | 'HAR'; 