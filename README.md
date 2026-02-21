# ReHome - Transform Clutter into Community Impact

[![Production URL](https://img.shields.io/badge/Production-Live-success)](https://13la7e.github.io/ReHome/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Project Info

**Live URL**: https://13la7e.github.io/ReHome/

**Status**: Production Ready | Phase 1 Complete

## 📖 About ReHome

ReHome is a comprehensive sustainable donation platform that revolutionizes how households donate items to verified organizations. Using AI-powered classification and real-time impact tracking, we make sustainable giving effortless and rewarding.

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Classification**: ReVision AI automatically categorizes donation items from photos — runs entirely on-device via TensorFlow.js, no data leaves your browser
- 📍 **Smart Partner Mapping**: Interactive map to find verified donation centers near you
- 📊 **Impact Dashboard**: Real-time tracking of environmental impact with detailed metrics
- 🎁 **Rewards System**: Earn points for donations and redeem exclusive rewards
- 🔄 **Multi-Upload**: Batch upload multiple items in one session
- 📧 **Pickup Coordination**: Automated email notifications for pickup scheduling with location tracking

### User Experience
- 🌐 **Fully Responsive**: Mobile-first design that works seamlessly on all devices
- ⚡ **Fast Loading**: Skeleton loaders and optimized performance
- � **Modern UI**: Beautiful gradient designs with smooth animations
- 🌙 **Dark Mode Support**: Automatic theme detection
- 🍪 **Cookie Consent**: GDPR-compliant cookie management
- 🛡️ **Error Boundaries**: Graceful error handling throughout the app

### Security & Legal
- 🔐 **Strong Password Requirements**: Enforced 8+ character passwords with complexity rules
- ✅ **Email Verification**: Supabase authentication with email confirmation
- 📜 **Legal Pages**: Comprehensive Terms of Service and Privacy Policy
- 🔒 **Row Level Security**: Database-level access control with Supabase RLS
- 🔑 **Environment Variables**: Secure API key management

### Content Pages
- ℹ️ **About Page**: Mission, values, and company story
- ❓ **FAQ Page**: 15+ comprehensive questions with accordion UI
- 📞 **Contact Page**: Multiple contact methods and quick links
- 🌱 **Impact Page**: Detailed environmental metrics and visualization

## How to run locally

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

The project is automatically deployed to GitHub Pages at: https://13la7e.github.io/ReHome/

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite 5** for blazing-fast build and HMR
- **Tailwind CSS** for utility-first styling
- **shadcn-ui** component library
- **React Router** (Hash Router for GitHub Pages)
- **TanStack Query** for data fetching
- **Zod** for form validation

### Backend & Services
- **Supabase** 
  - PostgreSQL database
  - Authentication & user management
  - Row Level Security (RLS)
  - Edge Functions (Deno)
  - Storage for images
- **ReVision AI** (TensorFlow.js + COCO-SSD + MobileNet, fully on-device) for image classification
- **Resend** for transactional emails

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **PostCSS** for CSS processing
- **GitHub Actions** for CI/CD

### Deployment
- **GitHub Pages** for static hosting
- **Capacitor** for Android app (in `/android` directory)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn
- Git

### Installation

```sh
# Clone the repository
git clone https://github.com/13la7e/ReHome.git
cd ReHome

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Then edit .env and add your API keys

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=https://13la7e.github.io/ReHome
VITE_SUPPORT_EMAIL=support@rehome.app
```

**Get API Keys:**
- Supabase: https://app.supabase.com/project/_/settings/api
- Resend: https://resend.com/api-keys (for edge functions)

> **Note:** No external AI API key is needed. ReVision AI runs entirely in the browser using TensorFlow.js.

## 📱 Android App

The Android app is built with Capacitor and located in the `/android` directory.

```sh
# Build the web app
npm run build

# Sync with Android project
npx cap sync android

# Open in Android Studio
npx cap open android
```

## 🗂️ Project Structure

```
ReHome/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn-ui components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── CookieConsent.tsx
│   ├── pages/           # Page components
│   │   ├── Index.tsx
│   │   ├── Auth.tsx
│   │   ├── Upload.tsx
│   │   ├── Partners.tsx
│   │   ├── Impact.tsx
│   │   ├── About.tsx
│   │   ├── FAQ.tsx
│   │   ├── Contact.tsx
│   │   ├── Terms.tsx
│   │   └── Privacy.tsx
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities
│   └── integrations/    # Supabase client
├── supabase/
│   ├── functions/       # Edge functions
│   └── migrations/      # Database migrations
├── android/             # Android app (Capacitor)
├── public/              # Static assets
└── .env.example         # Environment variables template
```

## 🔧 Available Scripts

```sh
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 📝 Features Documentation

### Authentication
- Email/password authentication via Supabase
- Password requirements: 8+ characters, uppercase, lowercase, number, special character
- Email verification (configurable in Supabase dashboard)
- Protected routes for authenticated users

### Donation Flow
1. User uploads item photo(s)
2. AI classifies item automatically
3. User confirms or edits classification
4. Item added to donations with points awarded
5. User can find partners and schedule pickup
6. Partner receives email with pickup details and location

### Rewards System
- Points awarded based on item type and condition
- Redeem points for rewards from partner businesses
- QR code generation for redemption verification
- Partner verification page at `/verify`

### Impact Tracking
- Total items donated
- CO₂ emissions saved
- Waste diverted from landfills
- Trees saved equivalent
- Historical data visualization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn-ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [TensorFlow.js](https://www.tensorflow.org/js) for powering ReVision AI (on-device classification)
- All our donation partners and community members

## 📞 Support

- Email: support@rehome.app
- FAQ: https://13la7e.github.io/ReHome/#/faq
- Issues: https://github.com/13la7e/ReHome/issues

---

Made with 💚 by the ReHome Team | Making the world greener, one donation at a time 🌱
