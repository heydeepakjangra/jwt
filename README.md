# JWT Tool - Professional JWT Decoder, Generator & Verifier

<div align="center">

![JWT Tool Logo](public/og-image.png)

**A powerful, professional JWT toolkit for developers**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**🚀 Live Demo**](https://jwt.deepakjangra.com) • [**📖 Documentation**](#features) • [**💻 GitHub**](https://github.com/heydeepakjangra/jwt)

</div>

## 🎯 Overview

JWT Tool is a comprehensive, professional-grade JSON Web Token (JWT) toolkit designed specifically for developers. It provides a complete suite of JWT operations including decoding, generation, verification, key management, and token storage - all performed client-side for maximum security.

## ✨ Features

### 🔓 **JWT Decoder**
- **Instant Decoding**: Parse and decode JWT tokens in real-time
- **Visual Structure**: Clear separation of header, payload, and signature
- **Claim Analysis**: Automatic detection and formatting of standard JWT claims
- **Expiry Validation**: Visual indicators for token expiration status
- **Copy Functionality**: One-click copy for any component

### 🔐 **JWT Generator**
- **Algorithm Support**: Complete support for all JWT algorithms
  - **HMAC**: HS256, HS384, HS512
  - **RSA**: RS256, RS384, RS512
  - **ECDSA**: ES256, ES384, ES512
  - **RSA-PSS**: PS256, PS384, PS512
  - **EdDSA**: Ed25519
- **Smart Claims**: Auto-generation of time-based claims (iat, exp, nbf)
- **Quick Actions**: One-click addition of common claims
- **Key Generation**: Automatic cryptographic key generation

### 🛡️ **JWT Verifier**
- **Signature Verification**: Validate JWT signatures with any algorithm
- **Multi-Key Support**: Support for both symmetric and asymmetric keys
- **PEM Import**: Direct import of PEM-formatted keys
- **Detailed Reports**: Comprehensive verification results with error analysis

### 🔑 **Key Manager**
- **Key Generation**: Generate cryptographic keys for any supported algorithm
- **Key Storage**: Secure local storage of key metadata
- **Export Options**: Export keys in PEM and JWK formats
- **Algorithm Detection**: Automatic algorithm detection from keys

### 🗄️ **Token Vault**
- **Secure Storage**: Local storage of JWT tokens with metadata
- **Organization**: Tag and categorize tokens for easy management
- **Search & Filter**: Powerful search and filtering capabilities
- **Import/Export**: Bulk import and export functionality
- **Expiry Tracking**: Visual indicators for token expiration

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.3.3](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **JWT Operations**: [jose](https://github.com/panva/jose) library
- **Validation**: [Zod](https://zod.dev/) for runtime type checking
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Themes**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 8.0 or higher (or yarn/pnpm equivalent)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heydeepakjangra/jwt.git
   cd jwt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Project Structure

```
jwt/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main application page
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots.txt
├── components/            # React components
│   ├── ui/                # ShadCN UI components
│   ├── jwt-decoder.tsx    # JWT decoding component
│   ├── jwt-generator.tsx  # JWT generation component
│   ├── jwt-verifier.tsx   # JWT verification component
│   ├── key-manager.tsx    # Key management component
│   ├── token-vault.tsx    # Token storage component
│   ├── mode-toggle.tsx    # Theme toggle component
│   └── theme-provider.tsx # Theme context provider
├── lib/                   # Utility libraries
│   ├── hooks/             # Custom React hooks
│   ├── jwt.ts             # Core JWT operations
│   ├── storage.ts         # Local storage utilities
│   ├── types.ts           # TypeScript type definitions
│   └── utils.ts           # General utilities
├── public/                # Static assets
└── package.json           # Project configuration
```

## 🔒 Security & Privacy

### Client-Side Only
- **Zero Data Transmission**: All operations performed locally in your browser
- **No Server Communication**: Tokens and keys never leave your device
- **Privacy First**: No tracking, analytics, or data collection

### Cryptographic Security
- **Web Crypto API**: Utilizes browser's native cryptographic functions
- **RFC 7519 Compliant**: Full compliance with JWT specifications
- **Secure Algorithms**: Support for industry-standard cryptographic algorithms

### Best Practices
- **HTTPS Required**: Asymmetric operations require secure context
- **Key Security**: Guidance for proper key handling and storage
- **Error Handling**: Comprehensive error messages and fallbacks

## 🌐 Browser Compatibility

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 60+ | ✅ Full Support |
| Firefox | 57+ | ✅ Full Support |
| Safari | 11+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |

**Note**: Asymmetric cryptographic operations require modern browsers with Web Crypto API support and HTTPS context.

## 📱 Device Support

- **Desktop**: Full feature set with optimized two-column layouts
- **Tablet**: Responsive design with touch-friendly interface  
- **Mobile**: Core features with HMAC algorithm support (crypto API limitations)

## 🎨 Features Showcase

### Dark/Light Theme Support
- **System Preference**: Automatic theme detection
- **Manual Toggle**: Easy theme switching
- **Persistent**: Theme preference saved locally

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Desktop Enhanced**: Advanced layouts for larger screens
- **Touch Friendly**: Accessible on all device types

### Developer Experience
- **Professional UI**: Clean, modern interface designed for developers
- **Keyboard Shortcuts**: Efficient workflow with hotkeys
- **Copy & Paste**: Seamless integration with development workflow
- **Error Handling**: Clear, actionable error messages

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build and test
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. **Code Style**: Follow the existing TypeScript and React patterns
2. **Type Safety**: Maintain strict TypeScript compliance
3. **Testing**: Ensure all features work across supported browsers
4. **Documentation**: Update README for any new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deepak Jangra**
- Twitter: [@heydeepakjangra](https://x.com/heydeepakjangra)
- GitHub: [@heydeepakjangra](https://github.com/heydeepakjangra)

## 🙏 Acknowledgments

- [Jose](https://github.com/panva/jose) - Excellent JWT library for JavaScript
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Next.js](https://nextjs.org/) - Amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📊 Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/heydeepakjangra/jwt?style=flat-square)
![GitHub forks](https://img.shields.io/github/forks/heydeepakjangra/jwt?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/heydeepakjangra/jwt?style=flat-square)
![GitHub license](https://img.shields.io/github/license/heydeepakjangra/jwt?style=flat-square)

**Made with ❤️ for the developer community**

</div>

---

<div align="center">

**[⬆ Back to Top](#jwt-tool---professional-jwt-decoder-generator--verifier)**

</div>
