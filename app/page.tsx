'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, FileText, Shield, Archive, Terminal, Github, ExternalLink } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

import { JWTGenerator } from '@/components/jwt-generator';
import { JWTDecoder } from '@/components/jwt-decoder';
import { JWTVerifier } from '@/components/jwt-verifier';
import { KeyManager } from '@/components/key-manager';
import { TokenVault } from '@/components/token-vault';

export default function Home() {
  const [activeTab, setActiveTab] = useState('decode');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Terminal className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  JWT Developer Tool
                </h1>
                <p className="text-sm text-muted-foreground font-mono">
                  jwt.deepakjangra.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/heydeepakjangra/jwt" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Source
                </a>
              </Button>
              <ModeToggle />
            </div>
          </div>
          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="outline" className="font-mono bg-background">
                <Terminal className="w-3 h-3 mr-1" />
                Client-Side Only
              </Badge>
              <Badge variant="outline" className="font-mono bg-background">
                <Shield className="w-3 h-3 mr-1" />
                Zero Data Upload
              </Badge>
              <Badge variant="outline" className="font-mono bg-background">
                <Key className="w-3 h-3 mr-1" />
                Crypto API
              </Badge>
              <span className="text-muted-foreground">
                Professional JWT operations for developers
              </span>
            </div>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4 sm:mb-6 h-auto">
            <TabsTrigger value="decode" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Decode</span>
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <FileText className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Generate</span>
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Shield className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Verify</span>
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Key className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Keys</span>
            </TabsTrigger>
            <TabsTrigger value="vault" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3">
              <Archive className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Vault</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  JWT Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JWTGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decode" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  JWT Decoder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JWTDecoder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  JWT Verifier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JWTVerifier />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keys" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Key Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <KeyManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vault" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Token Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TokenVault />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 border-t bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <p className="text-muted-foreground">
                  All operations performed client-side. Zero data transmission.
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono">
                    RFC 7519 Compliant
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    WebCrypto API
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Created by</span>
                <a 
                  href="https://x.com/heydeepakjangra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-mono text-sm"
                >
                  @heydeepakjangra
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
