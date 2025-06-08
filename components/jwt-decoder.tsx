'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle2, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { decodeJWT } from '@/lib/jwt';
import { JWTHeader, JWTPayload } from '@/lib/types';
import { useCopy } from '@/lib/hooks/use-copy';

export function JWTDecoder() {
  const [token, setToken] = useState<string>('');
  const [decodedHeader, setDecodedHeader] = useState<JWTHeader | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<JWTPayload | null>(null);
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const { copyToClipboard, isCopied } = useCopy();

  const handleDecode = () => {
    setError('');
    setDecodedHeader(null);
    setDecodedPayload(null);
    setSignature('');
    setIsValid(false);

    if (!token.trim()) {
      setError('Please enter a JWT token');
      toast.error('Please enter a JWT token');
      return;
    }

    try {
      const decoded = decodeJWT(token);
      setDecodedHeader(decoded.header);
      setDecodedPayload(decoded.payload);
      setSignature(decoded.signature);
      setIsValid(true);
      toast.success('JWT decoded successfully!', {
        description: `Algorithm: ${decoded.header.alg}`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decode token';
      setError(errorMessage);
      toast.error('JWT decoding failed', {
        description: errorMessage
      });
    }
  };

  const handleCopy = async (text: string, key: string, description?: string) => {
    await copyToClipboard(text, key, description || 'Copied to clipboard!');
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const renderClaimValue = (key: string, value: unknown) => {
    // Handle time-based claims
    if (['exp', 'iat', 'nbf'].includes(key) && typeof value === 'number') {
      return (
        <div className="space-y-1">
          <div className="font-mono text-sm">{value}</div>
                      <div className="text-xs text-muted-foreground">
            {formatTimestamp(value)}
          </div>
        </div>
      );
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <Badge key={index} variant="outline" className="mr-1">
              {String(item)}
            </Badge>
          ))}
        </div>
      );
    }

    // Handle objects
    if (typeof value === 'object' && value !== null) {
      return (
                        <pre className="text-xs font-mono bg-muted/50 p-2 rounded">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span className="font-mono text-sm">{String(value)}</span>;
  };

  const standardClaims = {
    iss: 'Issuer',
    sub: 'Subject',
    aud: 'Audience',
    exp: 'Expiration Time',
    nbf: 'Not Before',
    iat: 'Issued At',
    jti: 'JWT ID',
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Input Column */}
      <div className="xl:col-span-1 space-y-6">
        {/* Token Input */}
        <div className="space-y-3">
          <Label htmlFor="token">JWT Token</Label>
          <Textarea
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="font-mono text-sm min-h-[200px] xl:min-h-[300px]"
          />
          <Button onClick={handleDecode} className="w-full">
            Decode JWT
          </Button>
        </div>
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

      {/* Decoded Content */}
      {isValid && decodedHeader && decodedPayload && (
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Valid JWT Structure</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decoded Parts */}
          <Tabs defaultValue="header" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="header">Header</TabsTrigger>
              <TabsTrigger value="payload">Payload</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
            </TabsList>

            <TabsContent value="header" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Header</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(JSON.stringify(decodedHeader, null, 2), 'header', 'Header copied to clipboard!')}
                  >
                    {isCopied('header') ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {Object.entries(decodedHeader).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-muted/30 rounded space-y-1 sm:space-y-0">
                        <div className="font-medium">{key}</div>
                        <div className="text-left sm:text-right flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm">{String(value)}</span>
                          {key === 'alg' && (
                            <Badge variant="outline" className="text-xs">
                              {value.toString().startsWith('HS') ? 'HMAC' : 'Asymmetric'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Label>Raw JSON</Label>
                    <pre className="mt-2 text-xs font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded overflow-x-auto">
                      {JSON.stringify(decodedHeader, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payload" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Payload</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(JSON.stringify(decodedPayload, null, 2), 'payload', 'Payload copied to clipboard!')}
                  >
                    {isCopied('payload') ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Standard Claims */}
                  <div>
                    <h4 className="font-medium mb-3">Standard Claims</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(decodedPayload)
                        .filter(([key]) => key in standardClaims)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-800 rounded">
                            <div>
                              <div className="font-medium">{key}</div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {standardClaims[key as keyof typeof standardClaims]}
                              </div>
                            </div>
                            <div className="text-right">
                              {renderClaimValue(key, value)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Custom Claims */}
                  {Object.entries(decodedPayload).filter(([key]) => !(key in standardClaims)).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Custom Claims</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(decodedPayload)
                          .filter(([key]) => !(key in standardClaims))
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-800 rounded">
                              <div className="font-medium">{key}</div>
                              <div className="text-right">
                                {renderClaimValue(key, value)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Label>Raw JSON</Label>
                    <pre className="mt-2 text-xs font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded overflow-x-auto">
                      {JSON.stringify(decodedPayload, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signature" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Signature</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(signature, 'signature', 'Signature copied to clipboard!')}
                  >
                    {isCopied('signature') ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded">
                      <Label className="text-sm font-medium">Base64URL Encoded</Label>
                      <div className="mt-2 font-mono text-sm break-all">
                        {signature}
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        The signature is used to verify that the sender of the JWT is who it says it is 
                        and to ensure that the message wasn&apos;t changed along the way.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      </div>
    </div>
  );
} 