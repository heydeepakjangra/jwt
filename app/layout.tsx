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
    default: "JWT Tool - Professional JWT Decoder, Generator & Verifier",
    template: "%s | JWT Tool"
  },
  description: "Professional JWT (JSON Web Token) toolkit for developers. Decode, generate, verify JWT tokens with support for all algorithms (HS256, RS256, ES256, etc.). 100% client-side, secure, and RFC 7519 compliant.",
  keywords: [
    "JWT", "JSON Web Token", "JWT decoder", "JWT generator", "JWT verifier", 
    "JWT tool", "developer tools", "token generator", "JWT debugger",
    "HS256", "RS256", "ES256", "JWT parser", "token validator",
    "web crypto", "cryptography", "authentication", "authorization"
  ],
  authors: [{ name: "Deepak Jangra", url: "https://x.com/heydeepakjangra" }],
  creator: "Deepak Jangra",
  publisher: "Deepak Jangra",
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
    title: "JWT Tool - Professional JWT Decoder, Generator & Verifier",
    description: "Professional JWT toolkit for developers. Decode, generate, verify JWT tokens with support for all algorithms. 100% client-side and secure.",
    siteName: "JWT Tool",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JWT Tool - Professional JWT Decoder, Generator & Verifier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JWT Tool - Professional JWT Decoder, Generator & Verifier",
    description: "Professional JWT toolkit for developers. Decode, generate, verify JWT tokens with support for all algorithms. 100% client-side and secure.",
    creator: "@heydeepakjangra",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
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
