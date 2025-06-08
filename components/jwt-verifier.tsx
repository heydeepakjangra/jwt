'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { verifyJWT } from '@/lib/jwt';
import { ValidationResult } from '@/lib/types';

export function JWTVerifier() {
  const [token, setToken] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    setResult(null);

    if (!token.trim()) {
      const error = 'Please enter a JWT token';
      setResult({
        isValid: false,
        error
      });
      toast.error(error);
      setIsLoading(false);
      return;
    }

    if (!secret.trim()) {
      const error = 'Please enter a secret or key';
      setResult({
        isValid: false,
        error
      });
      toast.error(error);
      setIsLoading(false);
      return;
    }

    try {
      const validationResult = await verifyJWT(token, secret);
      setResult(validationResult);
      if (validationResult.isValid) {
        toast.success('JWT signature verified!', {
          description: `Algorithm: ${validationResult.header?.alg}`
        });
      } else {
        toast.error('JWT verification failed', {
          description: validationResult.error || 'Invalid signature'
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Verification failed';
      setResult({
        isValid: false,
        error: errorMessage
      });
      toast.error('JWT verification failed', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAsymmetric = result?.header?.alg && !result.header.alg.startsWith('HS');

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Input Column */}
      <div className="xl:col-span-1 space-y-6">
        {/* Token Input */}
        <div className="space-y-3">
          <Label htmlFor="verify-token">JWT Token</Label>
          <Textarea
            id="verify-token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="font-mono text-sm min-h-[120px] xl:min-h-[180px]"
          />
        </div>

        {/* Secret/Key Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="verify-secret">
              {isAsymmetric ? 'Public Key' : 'Secret'}
            </Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSecret(!showSecret)}
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
          <Input
            id="verify-secret"
            type={showSecret ? 'text' : 'password'}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={isAsymmetric ? 'PEM Public Key' : 'Secret key'}
            className="font-mono text-sm"
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          <Shield className="w-4 h-4 mr-2" />
          {isLoading ? 'Verifying...' : 'Verify JWT'}
        </Button>
      </div>

      {/* Results Column */}
      <div className="xl:col-span-2 space-y-6">

      {/* Verification Result */}
      {result && (
        <Card className={result.isValid 
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
        }>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isValid ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">Valid Signature</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-red-600 dark:text-red-400">Invalid Signature</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result.isValid ? (
              <div className="space-y-4">
                <p className="text-green-600 dark:text-green-400">
                  The JWT signature is valid and the token has not been tampered with.
                </p>
                
                {result.header && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Token Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Algorithm:</span>
                        <Badge variant="outline" className="ml-2">
                          {result.header.alg}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-2 font-mono">{result.header.typ}</span>
                      </div>
                    </div>
                  </div>
                )}

                {result.payload?.exp && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Expiry Status</h4>
                    <div className="text-sm">
                      {Date.now() >= result.payload.exp * 1000 ? (
                        <span className="text-red-600 dark:text-red-400">
                          ⚠️ Token expired on {new Date(result.payload.exp * 1000).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-green-600 dark:text-green-400">
                          ✅ Token expires on {new Date(result.payload.exp * 1000).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 dark:text-red-400">
                  {result.error || 'The JWT signature is invalid or the token has been tampered with.'}
                </p>
                
                {result.header && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Decoded Information</h4>
                    <p className="text-sm text-muted-foreground">
                      The token structure is valid but the signature verification failed.
                    </p>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Algorithm:</span>
                      <Badge variant="outline" className="ml-2">
                        {result.header.alg}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Common Issues</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Wrong secret key or public key</li>
                    <li>Algorithm mismatch</li>
                    <li>Token has been modified</li>
                    <li>Key format issues (ensure proper PEM format for asymmetric keys)</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
} 