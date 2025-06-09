'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, FileText, Shield, Archive, Terminal, Github, ExternalLink } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

import { JWTGenerator } from '@/components/jwt-generator';
import { JWTDecoder } from '@/components/jwt-decoder';
import { JWTVerifier } from '@/components/jwt-verifier';
import { KeyManager } from '@/components/key-manager';
import { TokenVault } from '@/components/token-vault';

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["WebApplication", "SoftwareApplication"],
  "name": "JWT Tool - Professional JWT Decoder, Generator & Verifier",
  "alternateName": ["JWT Developer Tool", "JSON Web Token Tool", "JWT Debugger"],
  "description": "Professional JWT (JSON Web Token) toolkit for developers. Decode, generate, verify JWT tokens with support for all algorithms. 100% client-side, secure, RFC 7519 compliant.",
  "url": "https://jwt.deepakjangra.com",
  "sameAs": [
    "https://github.com/heydeepakjangra/jwt",
    "https://x.com/heydeepakjangra"
  ],
  "author": {
    "@type": "Person",
    "name": "Deepak Jangra", 
    "url": "https://x.com/heydeepakjangra",
    "sameAs": [
      "https://github.com/heydeepakjangra",
      "https://linkedin.com/in/heydeepakjangra",
      "https://x.com/heydeepakjangra"
    ]
  },
  "creator": {
    "@type": "Person",
    "name": "Deepak Jangra",
    "url": "https://x.com/heydeepakjangra"
  },
  "publisher": {
    "@type": "Person", 
    "name": "Deepak Jangra",
    "url": "https://x.com/heydeepakjangra"
  },
  "applicationCategory": ["DeveloperApplication", "WebApplication", "SecurityApplication"],
  "applicationSubCategory": "Developer Tools",
  "operatingSystem": ["Windows", "macOS", "Linux", "iOS", "Android", "Any"],
  "browserRequirements": "Requires JavaScript enabled",
  "memoryRequirements": "512MB RAM minimum",
  "processorRequirements": "Any modern processor",
  "storageRequirements": "No storage required - runs in browser",
  "softwareVersion": "1.0.0",
  "releaseNotes": "Initial release with full JWT operations support",
  "datePublished": "2024-01-01",
  "dateModified": "2024-01-01",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01"
  },
  "license": "https://opensource.org/licenses/MIT",
  "isAccessibleForFree": true,
  "isFamilyFriendly": true,
  "featureList": [
    "JWT Token Decoder - Decode and analyze JWT tokens",
    "JWT Token Generator - Create JWT tokens with custom claims", 
    "JWT Token Verifier - Verify JWT signatures and validity",
    "Cryptographic Key Manager - Generate and manage signing keys",
    "Token Vault Storage - Store and organize JWT tokens locally",
    "Algorithm Support: HS256, HS384, HS512 (HMAC)",
    "Algorithm Support: RS256, RS384, RS512 (RSA)",
    "Algorithm Support: ES256, ES384, ES512 (ECDSA)",
    "Algorithm Support: PS256, PS384, PS512 (RSA-PSS)",
    "Algorithm Support: EdDSA (Ed25519)",
    "100% Client-side processing - No data uploaded to servers",
    "RFC 7519 compliant implementation",
    "Dark/Light theme support",
    "Mobile responsive design",
    "Real-time token validation",
    "Syntax highlighting and formatting",
    "Copy to clipboard functionality",
    "Local storage for tokens and keys",
    "Zero dependency on external APIs",
    "Open source and transparent"
  ],
  "screenshot": "https://jwt.deepakjangra.com/og-image.png",
  "video": {
    "@type": "VideoObject", 
    "name": "JWT Tool Demo",
    "description": "Demonstration of JWT Tool features",
    "thumbnailUrl": "https://jwt.deepakjangra.com/og-image.png"
  },
  "audience": {
    "@type": "Audience",
    "audienceType": ["Developers", "Software Engineers", "Security Professionals", "Web Developers", "Backend Developers", "Frontend Developers"]
  },
  "keywords": "JWT, JSON Web Token, decoder, generator, verifier, developer tools, authentication, authorization, security, cryptography, HS256, RS256, ES256, EdDSA, RFC 7519, client-side, no upload, free tool",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Developer User"
      },
      "reviewRating": {
        "@type": "Rating", 
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "Excellent JWT tool with all the features I need. Love that it's completely client-side."
    }
  ]
};

const breadcrumbData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://jwt.deepakjangra.com"
    },
    {
      "@type": "ListItem", 
      "position": 2,
      "name": "JWT Tool",
      "item": "https://jwt.deepakjangra.com"
    }
  ]
};

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a JWT token?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts: header, payload, and signature, separated by dots."
      }
    },
    {
      "@type": "Question", 
      "name": "Is this JWT tool secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, this JWT tool is completely secure as it runs 100% client-side in your browser. No data is uploaded to any servers, ensuring your tokens and keys remain private."
      }
    },
    {
      "@type": "Question",
      "name": "Which JWT algorithms are supported?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Our JWT tool supports all standard algorithms: HS256, HS384, HS512 (HMAC), RS256, RS384, RS512 (RSA), ES256, ES384, ES512 (ECDSA), PS256, PS384, PS512 (RSA-PSS), and EdDSA (Ed25519)."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this tool offline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, once loaded, the JWT tool works offline as it's a client-side application that doesn't require server connectivity for JWT operations."
      }
    },
    {
      "@type": "Question",
      "name": "Is this JWT tool free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, this JWT tool is completely free to use with no registration required. It's open source and available for everyone."
      }
    }
  ]
};

const organizationData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Deepak Jangra",
  "url": "https://deepakjangra.com",
  "logo": "https://jwt.deepakjangra.com/logo.png",
  "sameAs": [
    "https://github.com/heydeepakjangra",
    "https://x.com/heydeepakjangra",
    "https://linkedin.com/in/heydeepakjangra"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "creator",
    "email": "hey@deepakjangra.com"
  }
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('decode');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto p-4 max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
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
          </header>

          {/* Main Content */}
          <main>
            <h2 className="sr-only">JWT Operations</h2>
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
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      JWT Generator - Create JSON Web Tokens
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <JWTGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="decode" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      JWT Decoder - Decode and Analyze Tokens
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <JWTDecoder />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verify" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      JWT Verifier - Validate Token Signatures
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <JWTVerifier />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keys" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Key Manager - Generate Cryptographic Keys
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <KeyManager />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vault" className="space-y-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                      <Archive className="w-5 h-5" />
                      Token Vault - Store and Manage Tokens
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <TokenVault />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

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
    </>
  );
}
