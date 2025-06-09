import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JWT Tool - Free Online JWT Decoder, Generator & Verifier | Developer Tools",
    template: "%s | JWT Tool - Professional Developer Tools"
  },
  description: "Free online JWT (JSON Web Token) toolkit for developers. Decode, generate, verify & debug JWT tokens with support for all algorithms (HS256, RS256, ES256, EdDSA, etc.). 100% client-side, secure, RFC 7519 compliant. No data upload required.",
  keywords: [
    "JWT", "JSON Web Token", "JWT decoder", "JWT generator", "JWT verifier", 
    "JWT tool", "JWT debugger", "JWT parser", "JWT validator", "JWT analyzer",
    "developer tools", "web developer tools", "authentication tools", "token generator", 
    "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "ES256", "ES384", "ES512", 
    "PS256", "PS384", "PS512", "EdDSA", "JWT algorithms", "JWT online tool",
    "web crypto", "cryptography", "authentication", "authorization", "security",
    "base64", "JSON", "header", "payload", "signature", "claims", "bearer token",
    "oauth", "openid", "OIDC", "JWT.io alternative", "free JWT tool", "client side JWT",
    "no upload JWT", "secure JWT decoder", "RFC 7519", "Jose library"
  ],
  authors: [{ name: "Deepak Jangra", url: "https://x.com/heydeepakjangra" }],
  creator: "Deepak Jangra",
  publisher: "Deepak Jangra",
  category: "developer tools",
  classification: "Web Application",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jwt.deepakjangra.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jwt.deepakjangra.com",
    title: "JWT Tool - Free Online JWT Decoder, Generator & Verifier",
    description: "Professional JWT toolkit for developers. Decode, generate, verify JWT tokens with support for all algorithms. 100% client-side, secure, no data upload required.",
    siteName: "JWT Tool",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JWT Tool - Professional JWT Decoder, Generator & Verifier for Developers",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@heydeepakjangra",
    creator: "@heydeepakjangra",
    title: "JWT Tool - Free Online JWT Decoder, Generator & Verifier",
    description: "Professional JWT toolkit for developers. Decode, generate, verify JWT tokens with all algorithms. 100% client-side & secure. No signup required.",
    images: {
      url: "/og-image.png",
      alt: "JWT Tool Screenshot",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "JWT Tool",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "application-name": "JWT Tool",
    "msapplication-tooltip": "Professional JWT Developer Tool",
    "msapplication-starturl": "/",
    "msapplication-navbutton-color": "#000000",
    "msapplication-window": "width=1024;height=768",
    "format-detection": "telephone=no",
    "HandheldFriendly": "true",
    "MobileOptimized": "320",
    "referrer": "origin-when-cross-origin",
    "color-scheme": "light dark",
    "supported-color-schemes": "light dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="worldwide" />
        <meta name="url" content="https://jwt.deepakjangra.com" />
        <meta name="identifier-URL" content="https://jwt.deepakjangra.com" />
        <meta name="directory" content="submission" />
        <meta name="category" content="developer tools, web development, JWT, authentication" />
        <meta name="copyright" content="© 2024 Deepak Jangra" />
        <meta name="owner" content="Deepak Jangra" />
        <meta name="reply-to" content="hey@deepakjangra.com" />
        <meta name="abstract" content="Professional JWT toolkit for developers with decoder, generator, verifier, key manager and token vault. 100% client-side processing." />
        <meta name="topic" content="JWT, JSON Web Token, Developer Tools, Authentication, Security" />
        <meta name="summary" content="Free online JWT tool for developers to decode, generate and verify JSON Web Tokens with all algorithm support." />
        <meta name="Classification" content="Business" />
        <meta name="designer" content="Deepak Jangra" />
        <meta name="reply-to" content="hey@deepakjangra.com" />
        <meta name="owner" content="Deepak Jangra" />
        <meta name="subject" content="JWT Developer Tool - JSON Web Token Toolkit" />
        <meta name="copyright" content="Copyright 2024 Deepak Jangra. All Rights Reserved." />
        <meta name="language" content="EN" />
        <meta name="revisit-after" content="7 days" />
        <meta name="subtitle" content="Professional JWT Decoder, Generator & Verifier" />
        <meta name="target" content="all" />
        <meta name="date" content="2024-01-01" />
        <meta name="search-date" content="2024-01-01" />
        <link rel="canonical" href="https://jwt.deepakjangra.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="jwt-tool-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
