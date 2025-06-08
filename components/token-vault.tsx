'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Archive, 
  Copy, 
  Trash2, 
  Download, 
  Upload, 
  Search, 
  Clock,
  AlertTriangle,
  Check 
} from 'lucide-react';
import { toast } from 'sonner';
import { StoredToken } from '@/lib/types';
import { TokenStorage, exportTokensToJSON, importTokensFromJSON, generateId } from '@/lib/storage';
import { decodeJWT } from '@/lib/jwt';
import { useCopy } from '@/lib/hooks/use-copy';

export function TokenVault() {
  const [tokens, setTokens] = useState<StoredToken[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [newTokenData, setNewTokenData] = useState({ name: '', token: '', tags: '' });
  const [showAddToken, setShowAddToken] = useState(false);

  const { copyToClipboard, isCopied } = useCopy();
  const storage = TokenStorage.getInstance();

  const loadTokens = useCallback(() => {
    setTokens(storage.getAllTokens());
  }, [storage]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  const handleAddToken = () => {
    if (!newTokenData.name || !newTokenData.token) return;

    try {
      // Validate JWT structure
      decodeJWT(newTokenData.token);
      
      const decoded = decodeJWT(newTokenData.token);
      const expiry = decoded.payload.exp ? new Date(decoded.payload.exp * 1000) : undefined;
      
      const token: StoredToken = {
        id: generateId(),
        name: newTokenData.name,
        token: newTokenData.token,
        created: new Date(),
        expires: expiry,
        tags: newTokenData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        algorithm: decoded.header.alg || 'Unknown'
      };

      storage.saveToken(token);
      loadTokens();
      setNewTokenData({ name: '', token: '', tags: '' });
      setShowAddToken(false);
      toast.success('Token added to vault!', {
        description: `Saved as "${newTokenData.name}"`
      });
    } catch (err) {
      toast.error('Invalid JWT token', {
        description: err instanceof Error ? err.message : 'Token format is invalid'
      });
      console.error('Invalid JWT:', err);
    }
  };

  const handleDeleteToken = (id: string) => {
    storage.deleteToken(id);
    loadTokens();
    toast.success('Token deleted from vault');
  };

  const handleCopyToken = async (token: string, tokenId: string) => {
    await copyToClipboard(token, `token-${tokenId}`, 'Token copied to clipboard!');
  };

  const handleExportTokens = () => {
    const exportData = exportTokensToJSON(tokens);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jwt-tokens-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTokens = importTokensFromJSON(e.target?.result as string);
        importedTokens.forEach(token => {
          token.id = generateId(); // Generate new IDs to avoid conflicts
          storage.saveToken(token);
        });
        loadTokens();
        toast.success('Tokens imported successfully!', {
          description: `Imported ${importedTokens.length} tokens`
        });
      } catch (err) {
        console.error('Import failed:', err);
        toast.error('Import failed', {
          description: err instanceof Error ? err.message : 'Invalid file format'
        });
      }
    };
    reader.readAsText(file);
  };

  const getTokenStatus = (token: StoredToken) => {
    if (!token.expires) return { status: 'no-expiry', message: 'No expiry' };
    
    const now = new Date();
    if (token.expires < now) {
      return { status: 'expired', message: 'Expired' };
    }
    
    const timeUntilExpiry = token.expires.getTime() - now.getTime();
    if (timeUntilExpiry < 300000) { // 5 minutes
      return { status: 'expiring', message: 'Expiring soon' };
    }
    
    return { status: 'valid', message: 'Valid' };
  };

  const filteredTokens = tokens.filter(token => {
    const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.algorithm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || token.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(tokens.flatMap(token => token.tags)));

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Token Vault ({tokens.length} tokens)
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddToken(!showAddToken)}
              >
                Add Token
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportTokens}
                disabled={tokens.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <label>
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTokens}
                  className="hidden"
                />
              </label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Search tokens</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name or algorithm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48 space-y-2">
              <Label htmlFor="tag-filter">Filter by tag</Label>
              <select
                id="tag-filter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-input bg-background rounded-md"
              >
                <option value="">All tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Token Form */}
          {showAddToken && (
            <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <h4 className="font-medium">Add New Token</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token-name">Token Name</Label>
                  <Input
                    id="token-name"
                    value={newTokenData.name}
                    onChange={(e) => setNewTokenData({ ...newTokenData, name: e.target.value })}
                    placeholder="My JWT Token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-tags">Tags (comma-separated)</Label>
                  <Input
                    id="token-tags"
                    value={newTokenData.tags}
                    onChange={(e) => setNewTokenData({ ...newTokenData, tags: e.target.value })}
                    placeholder="development, api, auth"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-value">JWT Token</Label>
                <Textarea
                  id="token-value"
                  value={newTokenData.token}
                  onChange={(e) => setNewTokenData({ ...newTokenData, token: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="font-mono text-sm min-h-[80px]"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddToken} disabled={!newTokenData.name || !newTokenData.token}>
                  Add Token
                </Button>
                <Button variant="outline" onClick={() => setShowAddToken(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token List */}
      <div className="space-y-4">
        {filteredTokens.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500 dark:text-slate-400">
              {tokens.length === 0 ? (
                <div className="space-y-2">
                  <Archive className="w-12 h-12 mx-auto opacity-50" />
                  <p>No tokens stored yet.</p>
                  <p className="text-sm">Add your first JWT token to get started.</p>
                </div>
              ) : (
                <p>No tokens match your search criteria.</p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTokens.map((token) => {
            const status = getTokenStatus(token);
            return (
              <Card key={token.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{token.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Badge variant="outline">{token.algorithm}</Badge>
                        <Badge 
                          variant={
                            status.status === 'expired' ? 'destructive' :
                            status.status === 'expiring' ? 'secondary' : 'default'
                          }
                        >
                          {status.status === 'expired' && <AlertTriangle className="w-3 h-3 mr-1" />}
                          {status.status === 'expiring' && <Clock className="w-3 h-3 mr-1" />}
                          {status.message}
                        </Badge>
                        <span>Created: {token.created.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyToken(token.token, token.id)}
                      >
                        {isCopied(`token-${token.id}`) ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteToken(token.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tags */}
                  {token.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {token.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Token Preview */}
                  <div className="space-y-2">
                    <Label>Token</Label>
                    <Textarea
                      value={token.token}
                      readOnly
                      className="font-mono text-xs min-h-[60px] resize-none"
                    />
                  </div>

                  {/* Expiry Details */}
                  {token.expires && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expires: {token.expires.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
} 