'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, RefreshCw, Save, Eye, EyeOff, Check, Key } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { generateJWT, generateSecret, createTimeBasedPayload, generateKeyPair } from '@/lib/jwt';
import { JWTAlgorithm, JWTHeader, JWTPayload } from '@/lib/types';
import { TokenStorage, generateId } from '@/lib/storage';
import { useCopy } from '@/lib/hooks/use-copy';

const algorithms: JWTAlgorithm[] = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512',
  'PS256', 'PS384', 'PS512',
  'EdDSA'
];

export function JWTGenerator() {
  const [algorithm, setAlgorithm] = useState<JWTAlgorithm>('HS256');
  const [header, setHeader] = useState<string>('{\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState<string>('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState<string>('your-256-bit-secret');
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSecret, setShowSecret] = useState(false);
  const [useTimeBasedClaims, setUseTimeBasedClaims] = useState(true);
  const [tokenName, setTokenName] = useState('');

  const { copyToClipboard, isCopied } = useCopy();
  const isAsymmetric = !algorithm.startsWith('HS');

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Parse header and payload
      const headerObj: JWTHeader = { ...JSON.parse(header), alg: algorithm };
      let payloadObj: JWTPayload = JSON.parse(payload);

      // Add time-based claims if enabled
      if (useTimeBasedClaims) {
        payloadObj = createTimeBasedPayload(payloadObj);
      }

      let secretOrKey: string | CryptoKey = secret;

      // For asymmetric algorithms, we need to generate or use a key pair
      if (isAsymmetric) {
        // Check if crypto API is available for asymmetric operations
        if (typeof window !== 'undefined' && (!window.crypto || !window.crypto.subtle)) {
          throw new Error('Asymmetric key operations require Web Crypto API. Please use HMAC algorithms (HS256, HS384, HS512) on this device, or access via HTTPS on a modern browser.');
        }

        if (!secret.includes('-----BEGIN')) {
          try {
            // Generate a new key pair if no PEM key is provided
            const keyPair = await generateKeyPair({ algorithm });
            secretOrKey = keyPair.privateKey;
          } catch (keyGenError) {
            const errorMessage = keyGenError instanceof Error ? keyGenError.message : 'Unknown error';
            if (errorMessage.includes('Crypto') || errorMessage.includes('not available') || errorMessage.includes('subtle')) {
              throw new Error('Asymmetric key generation not supported on this device/browser. Please use HMAC algorithms (HS256, HS384, HS512) instead, or access via HTTPS.');
            }
            throw new Error(`Key generation failed: ${errorMessage}`);
          }
        } else {
          // Try to import PEM key
          try {
            const { importKeyFromPEM } = await import('@/lib/jwt');
            secretOrKey = await importKeyFromPEM(secret, algorithm);
          } catch (importError) {
            const errorMessage = importError instanceof Error ? importError.message : 'Invalid PEM format';
            if (errorMessage.includes('Crypto') || errorMessage.includes('subtle')) {
              throw new Error('PEM key import requires Web Crypto API. Please use HMAC algorithms (HS256, HS384, HS512) on this device.');
            }
            throw new Error(`PEM key import failed: ${errorMessage}`);
          }
        }
      }

      const token = await generateJWT(headerObj, payloadObj, secretOrKey, algorithm);
      setGeneratedToken(token);
      toast.success('JWT generated successfully!', {
        description: `Algorithm: ${algorithm}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      toast.error('JWT generation failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSecret = () => {
    const newSecret = generateSecret(32);
    setSecret(newSecret);
    toast.success('New secret generated!');
  };

  const handleCopyToken = async () => {
    if (generatedToken) {
      await copyToClipboard(generatedToken, 'jwt-token', 'JWT copied to clipboard!');
    }
  };

  const handleSaveToken = () => {
    if (generatedToken && tokenName) {
      const storage = TokenStorage.getInstance();
      storage.saveToken({
        id: generateId(),
        name: tokenName,
        token: generatedToken,
        created: new Date(),
        tags: [algorithm],
        algorithm
      });
      setTokenName('');
      toast.success('Token saved to vault!', {
        description: `Saved as "${tokenName}"`
      });
    }
  };

  const updatePayloadClaim = (key: string, value: unknown) => {
    try {
      const payloadObj = JSON.parse(payload);
      payloadObj[key] = value;
      setPayload(JSON.stringify(payloadObj, null, 2));
      toast.success(`Added ${key} claim`);
    } catch {
      toast.error('Invalid JSON in payload');
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Input Column */}
      <div className="xl:col-span-1 space-y-6">
        {/* Algorithm Selection */}
        <div className="space-y-3">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select value={algorithm} onValueChange={(value) => setAlgorithm(value as JWTAlgorithm)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map((alg) => (
                <SelectItem key={alg} value={alg}>
                  <div className="flex items-center">
                    {alg}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {alg.startsWith('HS') ? 'HMAC' : 'Asymmetric'}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <Label htmlFor="header">Header</Label>
          <Textarea
            id="header"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="JWT Header (JSON)"
            className="font-mono text-sm min-h-[120px] xl:min-h-[140px]"
          />
        </div>

        {/* Payload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="payload">Payload</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={useTimeBasedClaims}
                onCheckedChange={setUseTimeBasedClaims}
              />
              <Label className="text-sm">Auto time claims</Label>
            </div>
          </div>
          <Textarea
            id="payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="JWT Payload (JSON)"
            className="font-mono text-sm min-h-[120px] xl:min-h-[140px]"
          />
          
          {/* Quick claim buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePayloadClaim('exp', Math.floor(Date.now() / 1000) + 3600)}
            >
              +1h exp
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePayloadClaim('aud', 'api.example.com')}
            >
              +audience
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updatePayloadClaim('iss', 'https://issuer.example.com')}
            >
              +issuer
            </Button>
          </div>
        </div>

        {/* Secret/Key */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="secret">
              {isAsymmetric ? 'Private Key' : 'Secret'}
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateSecret}
                disabled={isAsymmetric}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <Input
            id="secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={isAsymmetric ? 'PEM Private Key or leave empty to generate' : 'Secret key'}
            className="font-mono text-sm"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Generating...' : 'Generate JWT'}
        </Button>
      </div>

      {/* Results Column */}
      <div className="xl:col-span-2 space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Generated Token */}
        {generatedToken && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated JWT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={generatedToken}
                  readOnly
                  className="font-mono text-sm min-h-[120px] xl:min-h-[180px] pr-12"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={handleCopyToken}
                >
                  {isCopied('jwt-token') ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Save to Vault */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Token name (optional)"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveToken}
                  disabled={!tokenName}
                  variant="outline"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save to Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placeholder when no token generated */}
        {!generatedToken && !error && (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground">
              <div className="space-y-2">
                <Key className="w-12 h-12 mx-auto opacity-50" />
                <p>Generated JWT will appear here</p>
                <p className="text-sm">Fill in the form and click "Generate JWT" to get started.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 