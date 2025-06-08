'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Key, Download, Copy, RefreshCw, Trash2, Check } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  generateKeyPair, 
  generateSecret, 
  exportKeyToPEM
} from '@/lib/jwt';
import { JWTAlgorithm, KeyInfo } from '@/lib/types';
import { KeyStorage, generateId } from '@/lib/storage';
import { useCopy } from '@/lib/hooks/use-copy';

const algorithms: JWTAlgorithm[] = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512',
  'PS256', 'PS384', 'PS512',
  'EdDSA'
];

export function KeyManager() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<JWTAlgorithm>('HS256');
  const [generatedKeys, setGeneratedKeys] = useState<{
    publicKey?: string;
    privateKey?: string;
    secret?: string;
  }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [savedKeys, setSavedKeys] = useState<KeyInfo[]>([]);

  const { copyToClipboard, isCopied } = useCopy();
  const isAsymmetric = !selectedAlgorithm.startsWith('HS');

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    setGeneratedKeys({});

    try {
      if (isAsymmetric) {
        // Generate asymmetric key pair
        const keyPair = await generateKeyPair({ algorithm: selectedAlgorithm });
        const publicKeyPEM = await exportKeyToPEM(keyPair.publicKey, 'public');
        const privateKeyPEM = await exportKeyToPEM(keyPair.privateKey, 'private');
        
        setGeneratedKeys({
          publicKey: publicKeyPEM,
          privateKey: privateKeyPEM
        });
        toast.success('Key pair generated successfully!', {
          description: `Algorithm: ${selectedAlgorithm}`
        });
      } else {
        // Generate symmetric secret
        const secret = generateSecret(32);
        setGeneratedKeys({ secret });
        toast.success('Secret key generated successfully!', {
          description: `Algorithm: ${selectedAlgorithm}`
        });
      }
    } catch (err) {
      console.error('Key generation failed:', err);
      toast.error('Key generation failed', {
        description: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyKey = async (key: string, keyType: string) => {
    await copyToClipboard(key, keyType, `${keyType} copied to clipboard!`);
  };

  const handleDownloadKey = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveKey = () => {
    if (!keyName || (!generatedKeys.secret && !generatedKeys.publicKey)) return;

    const storage = KeyStorage.getInstance();
    const keyInfo: KeyInfo = {
      id: generateId(),
      name: keyName,
      algorithm: selectedAlgorithm,
      type: isAsymmetric ? 'asymmetric' : 'symmetric',
      created: new Date(),
      keyData: generatedKeys.secret || generatedKeys.publicKey
    };

    storage.saveKeyInfo(keyInfo);
    setSavedKeys(storage.getAllKeyInfos());
    setKeyName('');
    toast.success('Key saved successfully!', {
      description: `Saved as "${keyName}"`
    });
  };

  const handleDeleteKey = (id: string) => {
    const storage = KeyStorage.getInstance();
    storage.deleteKeyInfo(id);
    setSavedKeys(storage.getAllKeyInfos());
  };

  // Load saved keys on component mount
  useEffect(() => {
    const storage = KeyStorage.getInstance();
    setSavedKeys(storage.getAllKeyInfos());
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Generate New Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Algorithm Selection */}
          <div className="space-y-3">
            <Label>Algorithm</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {selectedAlgorithm}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {algorithms.map((alg) => (
                  <DropdownMenuItem key={alg} onClick={() => setSelectedAlgorithm(alg)}>
                    {alg}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {alg.startsWith('HS') ? 'HMAC' : 'Asymmetric'}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            onClick={handleGenerateKey}
            disabled={isGenerating}
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : `Generate ${isAsymmetric ? 'Key Pair' : 'Secret'}`}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Keys Display */}
      {(generatedKeys.secret || generatedKeys.publicKey) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated {isAsymmetric ? 'Key Pair' : 'Secret'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {generatedKeys.secret && (
                          <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Secret Key</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyKey(generatedKeys.secret!, 'secret')}
                    >
                      {isCopied('secret') ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedKeys.secret}
                  readOnly
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
            )}

            {generatedKeys.publicKey && (
                          <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Public Key</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyKey(generatedKeys.publicKey!, 'public-key')}
                    >
                      {isCopied('public-key') ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadKey(generatedKeys.publicKey!, `${selectedAlgorithm}_public.pem`)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedKeys.publicKey}
                  readOnly
                  className="font-mono text-sm min-h-[120px]"
                />
              </div>
            )}

            {generatedKeys.privateKey && (
                          <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Private Key</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyKey(generatedKeys.privateKey!, 'private-key')}
                    >
                      {isCopied('private-key') ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownloadKey(generatedKeys.privateKey!, `${selectedAlgorithm}_private.pem`)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={generatedKeys.privateKey}
                  readOnly
                  className="font-mono text-sm min-h-[120px]"
                />
                <div className="text-sm text-red-600 dark:text-red-400">
                  ⚠️ Keep your private key secure and never share it publicly.
                </div>
              </div>
            )}

            {/* Save to Storage */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Input
                placeholder="Key name (optional)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleSaveKey}
                disabled={!keyName}
                variant="outline"
              >
                Save Key Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Keys */}
      {savedKeys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedKeys.map((keyInfo) => (
                <div key={keyInfo.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="space-y-1">
                    <div className="font-medium">{keyInfo.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Badge variant="outline">{keyInfo.algorithm}</Badge>
                      <Badge variant="secondary">{keyInfo.type}</Badge>
                      <span>Created: {keyInfo.created.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {keyInfo.keyData && (
                                        <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyKey(keyInfo.keyData!, `saved-key-${keyInfo.id}`)}
                  >
                    {isCopied(`saved-key-${keyInfo.id}`) ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteKey(keyInfo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 