# 🏠 ReHome - Complete Project Index & Reference

**Last Updated**: February 2026 | **Status**: Production Ready | **Phase**: 2 Complete + Ongoing

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Database Schema](#database-schema)
6. [Authentication & Security](#authentication--security)
7. [Pages & Routes](#pages--routes)
8. [Components](#components)
9. [Hooks & Utilities](#hooks--utilities)
10. [Integrations](#integrations)
11. [Deployment](#deployment)
12. [Environment Configuration](#environment-configuration)

---

## Project Overview

**ReHome** is a comprehensive sustainable donation platform that transforms household clutter into community impact. Users upload items, AI classifies them, and the platform connects donors with verified organizations for pickup.

### Key Statistics
- **Live URL**: https://13la7e.github.io/ReHome/
- **Deployment**: GitHub Pages (automatic via GitHub Actions)
- **Node.js Requirement**: 20.0.0 or higher
- **Database**: Supabase PostgreSQL with Row Level Security
- **Mobile**: Capacitor-enabled Android app support

### Mission
Transform clutter into community impact through AI-powered sustainable giving with real-time environmental impact tracking.

---

## Technology Stack

### Frontend Framework
- **React 18** with TypeScript - Modern reactive UI
- **Vite 5** - Ultra-fast build tool & HMR (Hot Module Replacement)
- **React Router v6** - Client-side routing with HashRouter
- **TypeScript 5.8** - Type safety and developer experience

### UI & Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - 460+ consistent SVG icons
- **Recharts** - Data visualization & charts

### State Management & Data Fetching
- **TanStack React Query 5.83** - Server state management, caching, mutations
- **React Hook Form** - Performant form handling with validation
- **Zod** - TypeScript-first schema validation
- **Sonner** - Toast notifications
- **Radix UI Alert Dialog, Popovers, Dialogs** - Accessible UI patterns

### Backend & Database
- **Supabase** - Firebase alternative with PostgreSQL
- **PostgreSQL 13.0.5** - Relational database with RLS
- **Supabase Auth** - Email/password authentication with JWT
- **supabase-js @2.75** - TypeScript client library

### AI & ML
- **Google Gemini 2.5 Flash** - Image classification via API Gateway
- **Custom Image Classifier Hook** - Client-side heuristic analysis
- **QR Code Generation** - qrcode.react for redemption codes

### Third-Party APIs
- **Mapbox GL** - Interactive partner location mapping
- **Resend** - Email service (via Edge Functions)
- **Sentry** - Error tracking & performance monitoring
- **next-themes** - Dark mode management

### Mobile
- **Capacitor 7.4** - Cross-platform mobile app framework
- **Android Build Tools** - Gradle-based Android builds
- **Progressive Web App** - Service Worker, manifest, offline support

### Development Tools
- **ESLint 9.32** - Code quality & style enforcement
- **Autoprefixer** - CSS vendor prefixes
- **Sharp** - Image optimization
- **Vite React SWC Plugin** - Faster transpilation

---

## Project Structure

```
/ReHome
├── /src
│   ├── /components          # Reusable React components
│   │   ├── /ui/            # shadcn/ui components
│   │   ├── AuthProvider.tsx # Auth context & hooks
│   │   ├── ThemeProvider.tsx# Dark mode context
│   │   ├── Navigation.tsx   # Main navigation bar
│   │   ├── Footer.tsx       # Site footer
│   │   ├── PartnersMap.tsx  # Mapbox integration
│   │   ├── NotificationBell.tsx # Real-time notifications
│   │   ├── Testimonials.tsx # Review carousel
│   │   ├── ProtectedRoute.tsx # Auth guard wrapper
│   │   ├── ErrorBoundary.tsx # Error fallback
│   │   └── PageTransition.tsx# Route animations
│   │
│   ├── /pages               # Route-based pages
│   │   ├── Index.tsx        # Home page with hero & features
│   │   ├── Auth.tsx         # Login/register with OAuth
│   │   ├── Upload.tsx       # Single item donation
│   │   ├── MultiUpload.tsx  # Batch item upload
│   │   ├── Partners.tsx     # Partner location finder
│   │   ├── Redeem.tsx       # Rewards redemption
│   │   ├── VerifyRedemption.tsx # Partner verification
│   │   ├── ImpactNew.tsx    # Environmental metrics dashboard
│   │   ├── Settings.tsx     # User profile & preferences
│   │   ├── Admin.tsx        # Admin control panel
│   │   ├── PartnerDashboard.tsx # Partner pickup management
│   │   ├── Blog.tsx         # Blog article listing
│   │   ├── BlogPost.tsx     # Individual article view
│   │   ├── Referral.tsx     # Referral program
│   │   ├── About.tsx        # Company story & mission
│   │   ├── FAQ.tsx          # 15+ help questions
│   │   ├── Contact.tsx      # Contact form & info
│   │   ├── Terms.tsx        # Terms of service
│   │   ├── Privacy.tsx      # Privacy policy
│   │   └── NotFound.tsx     # 404 page with nav
│   │
│   ├── /hooks               # Custom React hooks
│   │   ├── useImageClassifier.ts # AI image analysis
│   │   ├── use-mobile.tsx   # Mobile detection
│   │   └── use-toast.ts     # Toast notifications
│   │
│   ├── /integrations        # Third-party integrations
│   │   └── /supabase
│   │       ├── client.ts    # Supabase initialization
│   │       └── types.ts     # Auto-generated TypeScript types
│   │
│   ├── /lib
│   │   └── utils.ts         # Utility functions
│   │
│   ├── /email-templates     # HTML email templates
│   │   ├── welcome.html     # New user onboarding
│   │   ├── pickup-confirmed.html # Pickup notification
│   │   └── monthly-impact.html # Impact report
│   │
│   ├── App.tsx              # Main app component with routes
│   ├── main.tsx             # React DOM entry point
│   ├── index.css            # Global styles
│   └── animations.css       # Animation definitions
│
├── /supabase
│   ├── config.toml          # Supabase local config
│   ├── /migrations          # Database schema files
│   │   ├── 20251010101809_*.sql (Phase 1 setup)
│   │   ├── 20251014100000_phase2_features.sql (New tables)
│   │   └── COMPLETE_DATABASE_SETUP.sql (Full schema)
│   │
│   ├── /functions           # Supabase Edge Functions
│   │   ├── /classify-image  # AI image classification
│   │   │   └── index.ts     # Uses OpenAI API Gateway
│   │   └── /send-pickup-email # Email notifications
│   │       └── index.ts     # Uses Resend API
│   │
│   ├── *.sql                # SQL helper scripts
│   └── CREATE_ADMIN_ACCOUNT.sql
│
├── /android                 # Capacitor Android app
│   ├── build.gradle         # App build configuration
│   ├── gradle.properties    # Gradle settings
│   ├── variables.gradle     # Gradle variables
│   ├── /gradle/wrapper      # Gradle wrapper files
│   └── /app/src             # Android source code
│
├── /public                  # Static assets
│   ├── index.html           # HTML shell with PWA manifest
│   ├── manifest.json        # PWA app manifest
│   ├── sw.js                # Service Worker for PWA
│   ├── robots.txt           # SEO robots directives
│   ├── 404.html             # GitHub Pages 404 handling
│   └── /assets              # Images, favicons, etc.
│
├── Configuration Files
│   ├── package.json         # Dependencies & scripts
│   ├── tsconfig.json        # Base TypeScript config
│   ├── tsconfig.app.json    # App-specific TypeScript
│   ├── tsconfig.node.json   # Build tool TypeScript
│   ├── vite.config.ts       # Vite build configuration
│   ├── tailwind.config.ts   # Tailwind CSS customization
│   ├── postcss.config.js    # PostCSS plugins
│   ├── eslint.config.js     # ESLint rules
│   ├── capacitor.config.ts  # Mobile app config
│   └── components.json      # shadcn/ui config
│
├── Documentation Files
│   ├── README.md            # Main project documentation
│   ├── PROJECT_INDEX.md     # This file
│   ├── DEPLOYMENT.md        # Deployment instructions
│   ├── /docs/setup          # Active setup and operations guides
│   │   ├── SENTRY_SETUP_GUIDE.md
│   │   ├── SUPABASE_MIGRATION_GUIDE.md
│   │   ├── GITHUB_PAGES_SETUP.md
│   │   └── MIGRATION_GUIDE.md
│   ├── /docs/archive        # Historical phase reports and bugfix logs
│   │   ├── PHASE1_COMPLETE.md
│   │   ├── PHASE2_COMPLETE.md
│   │   ├── PHASE2_IMPLEMENTATION.md
│   │   └── BUGFIX_*.md
│   └── FINAL_INTEGRATION.md # Final phase integration checklist
│
└── .env.example             # Environment variables template
```

---

## Core Features

### 1. **AI-Powered Item Classification** 🤖
- **How It Works**: Users upload item photos → Google Gemini 2.5 Flash API classifies → confidence score returned
- **Categories**: books, clothes, electronics, e-waste, furniture
- **Accuracy**: 75-95% confidence depending on image clarity
- **Fallback**: Client-side heuristic classifier for offline/error cases
- **File**: [src/hooks/useImageClassifier.ts](src/hooks/useImageClassifier.ts)
- **Edge Function**: [supabase/functions/classify-image/index.ts](supabase/functions/classify-image/index.ts)

### 2. **Smart Partner Mapping** 📍
- **Interactive Map**: Mapbox GL integration showing nearby donation centers
- **Filters**: By category, rating, verified status
- **Location**: Automatically detects user geolocation
- **Pickup Scheduling**: Direct email notifications to partners
- **File**: [src/components/PartnersMap.tsx](src/components/PartnersMap.tsx)
- **Sample Data**: 4 pre-configured partners in database

### 3. **Impact Dashboard** 📊
- **Real-Time Metrics**: Total items, waste diverted (kg), CO₂ saved, lives impacted
- **Community Points**: Earned through donations, visible in progress
- **Visual Charts**: Recharts library for data visualization
- **User-Specific**: Pulled from impact_metrics table
- **File**: [src/pages/ImpactNew.tsx](src/pages/ImpactNew.tsx)

### 4. **Rewards & Redemption System** 🎁
- **Point-Based**: Earn community points for donations
- **Reward Types**: 
  - Tree planting (earth impact)
  - Discount vouchers (partner collaboration)
- **Redemption**: QR code generation for partner verification
- **Verification Page**: `/verify` for partner side verification
- **File**: [src/pages/Redeem.tsx](src/pages/Redeem.tsx)

### 5. **Multi-Upload Capability** 📸
- **Batch Processing**: Upload multiple items simultaneously
- **Real-Time Classification**: Each image classified as uploaded
- **Remove & Retry**: Delete failed classifications
- **Bulk Save**: Save all at once to database
- **File**: [src/pages/MultiUpload.tsx](src/pages/MultiUpload.tsx)

### 6. **Email Notifications** 📧
- **Pickup Confirmation**: Automated emails when donation requested
- **User Emails**: Welcome on signup, impact reports monthly
- **Partner Emails**: Pickup requests with Google Maps links
- **Service**: Resend API via Edge Functions
- **Templates**: HTML stored in src/email-templates/
- **File**: [supabase/functions/send-pickup-email/index.ts](supabase/functions/send-pickup-email/index.ts)

### 7. **User Authentication** 🔐
- **Email/Password**: Supabase built-in auth
- **OAuth**: Google Sign-In support (configurable)
- **Password Validation**: 8+ chars, uppercase, lowercase, number, special char
- **Email Verification**: Optional in Supabase settings
- **Session Persistence**: Auto-refresh tokens via PKCE flow
- **File**: [src/components/AuthProvider.tsx](src/components/AuthProvider.tsx)

### 8. **Blog & Content Management** 📝
- **Admin Creation**: Manage blog posts via admin dashboard
- **Search & Tags**: Filter articles by keywords and tags
- **View Tracking**: Track article popularity
- **Publishing**: Draft/publish status control
- **File**: [src/pages/Blog.tsx](src/pages/Blog.tsx), [src/pages/Admin.tsx](src/pages/Admin.tsx)

### 9. **Referral Program** 👥
- **Unique Codes**: Auto-generated per user
- **Tracking**: Monitor referral conversions
- **Rewards**: Bonus points for successful referrals
- **Sharing**: Copy/share code functionality
- **File**: [src/pages/Referral.tsx](src/pages/Referral.tsx)

### 10. **Admin Control Panel** ⚙️
- **Blog Management**: Create, edit, delete posts
- **Testimonial Approval**: Review and feature user reviews
- **User Statistics**: Dashboard with analytics
- **Notifications**: Send system-wide announcements
- **Role-Based Access**: Via user_roles table
- **File**: [src/pages/Admin.tsx](src/pages/Admin.tsx)

### 11. **Partner Dashboard** 📋
- **Pickup Requests**: View incoming donations
- **Status Updates**: Mark pickups as completed
- **Statistics**: Analyze partner performance
- **Request Filtering**: By date, status, category
- **Email Match**: Partner login via email
- **File**: [src/pages/PartnerDashboard.tsx](src/pages/PartnerDashboard.tsx)

### 12. **Progressive Web App (PWA)** 📲
- **Installable**: Can be installed like native app
- **Offline Support**: Service Worker caches key pages
- **Manifest**: manifest.json for installability
- **Notifications**: Push notification support
- **File**: [public/sw.js](public/sw.js), [public/manifest.json](public/manifest.json)

### 13. **Dark Mode Support** 🌙
- **Auto Detection**: Respects system preference
- **Toggle**: Manual switch in sidebar
- **Persistent**: Stored in localStorage
- **Implementation**: next-themes with Tailwind classes
- **File**: [src/components/ThemeProvider.tsx](src/components/ThemeProvider.tsx)

### 14. **In-App Notifications** 🔔
- **Real-Time Bell**: NotificationBell component shows unread count
- **Types**: info, success, warning, pickup, reward, achievement
- **User Links**: Clickable notifications navigate to relevant pages
- **Read Tracking**: Database tracks read status
- **File**: [src/components/NotificationBell.tsx](src/components/NotificationBell.tsx)

---

## Database Schema

### Tables (Phase 1 + Phase 2)

#### 1. **profiles** - User Information
```sql
id (UUID, PK)
email (TEXT)
full_name (TEXT)
username (TEXT, UNIQUE)
avatar_url (TEXT)
phone (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```
- **Purpose**: Store user profile data
- **RLS**: Users read all, update own only

#### 2. **user_roles** - Role Management
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
role (ENUM: 'user', 'admin', 'partner')
created_at (TIMESTAMP)
```
- **Purpose**: Assign admin/partner roles
- **RLS**: Users view own, admins manage all

#### 3. **impact_metrics** - Environmental Tracking
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users, UNIQUE)
total_items (INTEGER)
waste_diverted_kg (NUMERIC)
co2_saved_kg (NUMERIC)
lives_impacted (INTEGER)
community_points (INTEGER)
updated_at (TIMESTAMP)
```
- **Purpose**: Track user's environmental impact
- **RLS**: Users read/update own only

#### 4. **partners** - Donation Organizations
```sql
id (UUID, PK)
name (TEXT)
description (TEXT)
logo_url (TEXT)
categories (TEXT[])
contact_email (TEXT)
contact_phone (TEXT)
address (TEXT)
latitude (NUMERIC)
longitude (NUMERIC)
rating (NUMERIC)
verified (BOOLEAN)
active (BOOLEAN)
created_at (TIMESTAMP)
```
- **Purpose**: Store verified partner organizations
- **RLS**: Anyone can view active, admins manage all

#### 5. **items** - Donation Items
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
category (TEXT: 'books', 'clothes', 'electronics', 'ewaste', 'furniture')
image_url (TEXT)
confidence (NUMERIC 0-1)
is_reusable (BOOLEAN)
status (TEXT: 'pending', 'approved', 'picked_up', 'rejected')
created_at (TIMESTAMP)
```
- **Purpose**: Store uploaded item data
- **RLS**: Users see/edit own, admins see all

#### 6. **pickup_requests** - Donation Scheduling
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
item_id (UUID, FK → items)
partner_id (UUID, FK → partners)
status (TEXT: 'pending', 'confirmed', 'completed', 'cancelled')
scheduled_date (TIMESTAMP)
completed_date (TIMESTAMP)
created_at (TIMESTAMP)
```
- **Purpose**: Track pickup scheduling
- **RLS**: Users see own, partners see theirs

#### 7. **rewards** - Redemption Catalog
```sql
id (UUID, PK)
name (TEXT)
description (TEXT)
points_required (INTEGER)
type (TEXT: 'tree_planting', 'discount', 'voucher')
image_url (TEXT)
partner_id (UUID, FK → partners)
active (BOOLEAN)
created_at (TIMESTAMP)
```
- **Purpose**: Store available rewards
- **RLS**: Users can read all active

#### 8. **redemptions** - User Redemptions
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
reward_id (UUID, FK → rewards)
qr_code_data (TEXT)
redeemed_date (TIMESTAMP)
partner_verified_date (TIMESTAMP)
created_at (TIMESTAMP)
```
- **Purpose**: Track reward redemptions
- **RLS**: Users see own, partners verify

#### 9. **blog_posts** (Phase 2)
```sql
id (UUID, PK)
author_id (UUID, FK → auth.users)
title (TEXT)
slug (TEXT, UNIQUE)
content (TEXT)
excerpt (TEXT)
featured_image (TEXT)
tags (TEXT[])
published (BOOLEAN)
published_at (TIMESTAMP)
views (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```
- **Purpose**: Store blog articles
- **RLS**: Anyone read published, author/admin write

#### 10. **testimonials** (Phase 2)
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
user_name (TEXT)
user_avatar (TEXT)
rating (INTEGER 1-5)
content (TEXT)
featured (BOOLEAN)
approved (BOOLEAN)
created_at (TIMESTAMP)
```
- **Purpose**: Store user reviews
- **RLS**: Users create own, admins approve

#### 11. **notifications** (Phase 2)
```sql
id (UUID, PK)
user_id (UUID, FK → auth.users)
title (TEXT)
message (TEXT)
type (TEXT: 'info', 'success', 'warning', 'pickup', 'reward', 'achievement')
link (TEXT)
read (BOOLEAN)
created_at (TIMESTAMP)
```
- **Purpose**: In-app notification system
- **RLS**: Users see own only

#### 12. **referrals** (Phase 2)
```sql
id (UUID, PK)
referrer_id (UUID, FK → auth.users)
referred_user_id (UUID, FK → auth.users)
referral_code (TEXT, UNIQUE)
reward_earned (INTEGER)
created_at (TIMESTAMP)
activated_at (TIMESTAMP)
```
- **Purpose**: Track referral program
- **RLS**: Users see own codes

#### 13. **partner_stats** (Phase 2)
```sql
id (UUID, PK)
partner_id (UUID, FK → partners)
total_pickups (INTEGER)
completed_pickups (INTEGER)
pending_pickups (INTEGER)
total_weight_kg (NUMERIC)
average_rating (NUMERIC)
updated_at (TIMESTAMP)
```
- **Purpose**: Partner performance tracking
- **RLS**: Partners see own, admins see all

### Key Functions & Triggers
- **`has_role(user_id, role)`**: Check user roles securely
- **`generate_referral_code()`**: Create unique referral codes
- **`create_notification(...)`**: Insert notifications with proper permissions
- **`handle_new_user()`**: Trigger on signup to initialize profile, roles, metrics

### Storage Buckets
- **avatars**: User profile pictures (public)
- **item-images**: Donation item photos (public)

---

## Authentication & Security

### Flow
1. **Signup**: Email/password → Supabase auth.users
2. **Creation Trigger**: handle_new_user() creates profiles, roles, metrics
3. **Login**: JWT token + session persistence
4. **Refresh**: Automatic token refresh via PKCE flow
5. **Logout**: Clear session and auth state

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Row Level Security (RLS)
**Enabled on all tables with policies:**
- Users access own data by default
- Admins bypass restrictions
- Public tables like partners/rewards readable by all
- Email verification gates sensitive operations

### Protected Routes
```tsx
/upload, /multi-upload, /partners, /impact
/redeem, /settings, /referral
/admin (admin-only), /partner-dashboard (partner-only)
```

### Storage Access Control
```sql
Users can upload, read, delete own files
Files stored in UUID-based folders: /user-id/filename
```

---

## Pages & Routes

### Public Pages (No Auth Required)
| Route | File | Purpose |
|-------|------|---------|
| `/` | [src/pages/Index.tsx](src/pages/Index.tsx) | Home page with hero, features, testimonials |
| `/auth` | [src/pages/Auth.tsx](src/pages/Auth.tsx) | Login/signup with password validation |
| `/about` | [src/pages/About.tsx](src/pages/About.tsx) | Company mission & story |
| `/faq` | [src/pages/FAQ.tsx](src/pages/FAQ.tsx) | 15+ FAQ questions with accordion |
| `/contact` | [src/pages/Contact.tsx](src/pages/Contact.tsx) | Contact form & support links |
| `/blog` | [src/pages/Blog.tsx](src/pages/Blog.tsx) | Blog article listing, search, tags |
| `/blog/:slug` | [src/pages/BlogPost.tsx](src/pages/BlogPost.tsx) | Individual article view |
| `/terms` | [src/pages/Terms.tsx](src/pages/Terms.tsx) | Terms of service |
| `/privacy` | [src/pages/Privacy.tsx](src/pages/Privacy.tsx) | Privacy policy |
| `/verify` | [src/pages/VerifyRedemption.tsx](src/pages/VerifyRedemption.tsx) | QR code verification (partner-facing) |

### Protected Pages (Auth Required)
| Route | File | Purpose |
|-------|------|---------|
| `/upload` | [src/pages/Upload.tsx](src/pages/Upload.tsx) | Single item donation with AI classification |
| `/multi-upload` | [src/pages/MultiUpload.tsx](src/pages/MultiUpload.tsx) | Batch upload up to 10 items |
| `/partners` | [src/pages/Partners.tsx](src/pages/Partners.tsx) | Find & schedule pickups, Mapbox map |
| `/redeem` | [src/pages/Redeem.tsx](src/pages/Redeem.tsx) | Rewards marketplace with QR codes |
| `/impact` | [src/pages/ImpactNew.tsx](src/pages/ImpactNew.tsx) | Environmental metrics dashboard |
| `/settings` | [src/pages/Settings.tsx](src/pages/Settings.tsx) | Profile, avatar, preferences, theme |
| `/referral` | [src/pages/Referral.tsx](src/pages/Referral.tsx) | Referral code sharing & tracking |

### Admin Pages (Admin Role + Auth)
| Route | File | Purpose |
|-------|------|---------|
| `/admin` | [src/pages/Admin.tsx](src/pages/Admin.tsx) | Multi-tab control panel (blog, testimonials, notifications, stats) |

### Partner Pages (Partner Email Match)
| Route | File | Purpose |
|-------|------|---------|
| `/partner-dashboard` | [src/pages/PartnerDashboard.tsx](src/pages/PartnerDashboard.tsx) | Manage pickups, view statistics |

### Utility Pages
| Route | File | Purpose |
|-------|------|---------|
| `/sentry-test` | [src/pages/SentryTest.tsx](src/pages/SentryTest.tsx) | Error tracking test (remove in production) |
| `*` | [src/pages/NotFound.tsx](src/pages/NotFound.tsx) | 404 error page |

---

## Components

### Layout Components
- **Navigation**: [src/components/Navigation.tsx](src/components/Navigation.tsx) - Top nav with logo, links, user menu
- **Footer**: [src/components/Footer.tsx](src/components/Footer.tsx) - Bottom footer with copyright & links
- **PageTransition**: [src/components/PageTransition.tsx](src/components/PageTransition.tsx) - Route animations with Framer Motion

### Provider Components
- **AuthProvider**: [src/components/AuthProvider.tsx](src/components/AuthProvider.tsx) - Auth context, session management
- **ThemeProvider**: [src/components/ThemeProvider.tsx](src/components/ThemeProvider.tsx) - Dark/light mode context
- **ErrorBoundary**: [src/components/ErrorBoundary.tsx](src/components/ErrorBoundary.tsx) - Fallback UI on errors

### Feature Components
- **PartnersMap**: [src/components/PartnersMap.tsx](src/components/PartnersMap.tsx) - Mapbox GL integration, pin clustering, info windows
- **NotificationBell**: [src/components/NotificationBell.tsx](src/components/NotificationBell.tsx) - Real-time notification bell with dropdown
- **Testimonials**: [src/components/Testimonials.tsx](src/components/Testimonials.tsx) - Review carousel on homepage
- **ProgressCircle**: [src/components/ProgressCircle.tsx](src/components/ProgressCircle.tsx) - Circular progress indicator
- **StatCard**: [src/components/StatCard.tsx](src/components/StatCard.tsx) - Metric card template

### UI Components (shadcn/ui)
All located in [src/components/ui/](src/components/ui/)
- **Button, Card, Input, Label, Dialog, Tabs, Switch, Progress, Avatar**
- **Alert, Badge, Toast, Popover, Dropdown, Checkbox, Radio, Slider**
- **Accordion, Collapsible, Tooltip, HoverCard, etc.**

### Utility Components
- **CookieConsent**: [src/components/CookieConsent.tsx](src/components/CookieConsent.tsx) - GDPR cookie banner
- **ThemeSelector**: [src/components/ThemeSelector.tsx](src/components/ThemeSelector.tsx) - Theme switcher UI
- **ProtectedRoute**: [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) - Route guard wrapper
- **Hero**: [src/components/Hero.tsx](src/components/Hero.tsx) - Homepage hero section
- **HowItWorks**: [src/components/HowItWorks.tsx](src/components/HowItWorks.tsx) - Feature explanation
- **ImpactPreview**: [src/components/ImpactPreview.tsx](src/components/ImpactPreview.tsx) - Impact preview cards

---

## Hooks & Utilities

### Custom Hooks
- **[useImageClassifier](src/hooks/useImageClassifier.ts)**: AI-powered image classification with fallback heuristics
- **[use-mobile](src/hooks/use-mobile.tsx)**: Detect mobile viewport (responsive design)
- **[use-toast](src/hooks/use-toast.ts)**: Toast notification hook

### Utilities
- **[lib/utils.ts](src/lib/utils.ts)**: Shared utility functions (cn for Tailwind classname merging, etc.)

---

## Integrations

### Supabase (Backend as a Service)
**Project ID**: byhbvuoprsgqggndudxj  
**URL**: https://dspwgwivmqvyskikbfdq.supabase.co

**Features Used**:
- PostgreSQL database with 13 tables
- Row Level Security (RLS) policies
- Edge Functions (classify-image, send-pickup-email)
- Storage buckets (avatars, item-images)
- Auth with email/password + OAuth
- Triggers for user signup automation

**Client Setup**:
```typescript
// src/integrations/supabase/client.ts
- PKCE auth flow (production-safe)
- Auto token refresh
- Session persistence
- Environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
```

### Google Gemini AI
**API**: Gemini 2.5 Flash (fastest model)  
**Gateway**: OpenAI-compatible API endpoint  
**Usage**: Image classification into 5 categories

**Prompt**:
```
Classify item into EXACTLY ONE: books, clothes, electronics, ewaste, furniture
Return JSON: {category, confidence, reasoning}
```

**Fallback**: Client-side heuristic analyzer in hook

### Mapbox GL
**Token**: Set in environment (VITE_MAPBOX_TOKEN)  
**Features**: Interactive maps, partner markers, clustering  
**Files**: [src/components/PartnersMap.tsx](src/components/PartnersMap.tsx)

### Resend (Email Service)
**API Key**: RESEND_API_KEY (via Edge Functions)  
**From Email**: onboarding@resend.dev  
**Templates**: HTML in src/email-templates/  
**Edge Function**: [supabase/functions/send-pickup-email/index.ts](supabase/functions/send-pickup-email/index.ts)

### Sentry (Error Tracking)
**Setup**: Follow [docs/setup/SENTRY_SETUP_GUIDE.md](docs/setup/SENTRY_SETUP_GUIDE.md)  
**Features**: Error tracking, performance monitoring, session replay  
**DSN**: Set via environment  
**Test Page**: `/sentry-test`

### Google Sign-In (OAuth)
**Setup**: Configure in Supabase auth settings  
**Redirect**: GitHub Pages deployment URL  
**Fallback**: Email/password authentication

---

## Deployment

### GitHub Pages (Production)
- **URL**: https://13la7e.github.io/ReHome/
- **Base Path**: /ReHome/
- **Automatic**: Triggered on main branch push
- **Workflow**: `.github/workflows/deploy.yml`
- **Build**: Node.js 20, Vite production build
- **Branch**: Deploys from `main` to `gh-pages`

### Deployment Steps
```bash
git add .
git commit -m "Feature: description"
git push origin main
# GitHub Actions automatically builds & deploys
# Check: https://github.com/13LA7E/ReHome/actions
```

### Environment Variables (GitHub Secrets)
```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_GEMINI_API_KEY
VITE_APP_URL
VITE_SUPPORT_EMAIL
VITE_MAPBOX_TOKEN (optional for maps)
```

### Vercel Alternative
If needed, Vercel deployment is supported:
- Connect GitHub repo
- Auto-deploys on push
- Automatic preview deployments
- Serverless functions ready

### Android Build (Capacitor)
```bash
npm run android           # Build & open in Android Studio
npm run android:sync     # Sync to device
npm run android:open     # Open Studio
```

---

## Environment Configuration

### Development (.env.local)
```env
# Supabase
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key

# AI
VITE_GEMINI_API_KEY=your_gemini_key

# App
VITE_APP_URL=http://localhost:8080
VITE_SUPPORT_EMAIL=support@rehome.app

# Maps (Optional)
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Build Commands
```bash
npm run dev           # Dev server at :8080
npm run build         # Production build to /dist
npm run build:dev     # Dev mode production build
npm run preview       # Preview production build locally
npm run lint          # ESLint check
```

### Node.js Version
- **Required**: 20.0.0 or higher
- **Management**: Use `.nvmrc` with nvm (`nvm use`)
- **Check**: `node -v` should be >= 20.0.0

---

## Key Configuration Files Reference

### [package.json](package.json)
- Dependencies (React, Vite, Supabase, UI libraries)
- Scripts (dev, build, lint, android)
- Engine requirements (Node 20+, npm 9+)

### [vite.config.ts](vite.config.ts)
- Base path: `/ReHome/` for GitHub Pages
- Dev server: localhost:8080
- React SWC plugin for fast builds
- Path alias: `@` → `src/`

### [tailwind.config.ts](tailwind.config.ts)
- Dark mode: class-based toggle
- Colors: CSS variables (HSL)
- Custom animations: fade-in, scale-in, float, glow-pulse
- Radius: 6px base, modular scale

### [tsconfig.json](tsconfig.json)
- Target: ES2020
- Lib: ES2020, DOM, DOM.Iterable
- Strict mode enabled
- Path aliases configured

### [capacitor.config.ts](capacitor.config.ts)
- App ID: com.rehome.app
- App name: ReHome
- Web dir: dist
- Android scheme: https

### [supabase/config.toml](supabase/config.toml)
- Project ID: byhbvuoprsgqggndudxj
- Edge functions: classify-image (JWT required)

---

## Development Workflow

### First Time Setup
```bash
# 1. Clone repo
git clone https://github.com/13LA7E/ReHome.git
cd ReHome

# 2. Install dependencies
npm install

# 3. Create .env.local from .env.example
cp .env.example .env.local
# Fill in actual API keys

# 4. Start dev server
npm run dev
# Open http://localhost:8080
```

### Making Changes
```bash
# 1. Create feature branch
git checkout -b feature/description

# 2. Make changes
# Code in src/, components/, pages/, etc.

# 3. Test locally
npm run dev  # Dev server with HMR

# 4. Lint & check
npm run lint

# 5. Commit & push
git add .
git commit -m "Feature: description"
git push origin feature/description

# 6. Create Pull Request → Merge to main
# GitHub Actions automatically deploys
```

### Database Changes
```bash
# 1. Create migration in supabase/migrations/
# File name: YYYYMMDDHHMMSS_description.sql

# 2. Run migration in Supabase dashboard SQL editor

# 3. Regenerate types
npx supabase gen types typescript --project-id byhbvuoprsgqggndudxj > src/integrations/supabase/types.ts

# 4. Commit types
git add src/integrations/supabase/types.ts
```

---

## Troubleshooting Reference

### Issue: Blank Page on Load
**Cause**: GitHub Pages base path issue  
**Fix**: Verify `base: "/ReHome/"` in vite.config.ts

### Issue: Supabase Connection Failed
**Cause**: Invalid API keys  
**Fix**: Copy correct keys from Supabase dashboard Settings → API

### Issue: Image Classification Doesn't Work
**Cause**: Gemini API credits exhausted or API key invalid  
**Fix**: Check API Gateway status, regenerate keys in Google Cloud Console

### Issue: Dark Mode Doesn't Persist
**Cause**: localStorage disabled or theme not set  
**Fix**: Clear cache, refresh, check ThemeProvider is wrapping app

### Issue: Type Errors After DB Changes
**Cause**: types.ts is outdated  
**Fix**: Regenerate types: `npx supabase gen types...`

---

## Testing Endpoints

### Authentication
- Signup: `/auth` form
- Login: `/auth` form
- Protected route test: `/upload` (should redirect if not logged in)

### AI Classification
- Upload page: `/upload` (single item)
- Multi-upload: `/multi-upload` (batch)
- Check console for API responses

### Email
- Trigger: Schedule pickup on Partners page
- Check: Dummy email account or Resend dashboard

### Payment/Rewards
- Redeem: `/redeem` page
- Generate QR: Click reward card
- Verify: `/verify` page with QR code

### Admin Features
- Setup: Create user, add admin role via SQL
- Access: `/admin` page
- Blog: Create post, test publish toggle

---

## Performance Notes

### Optimizations Done
- ✅ Image lazy loading with Tailwind aspect ratio
- ✅ Skeleton loaders on slow pages
- ✅ React Query caching for API responses
- ✅ Code splitting with React Router lazy loading
- ✅ Tailwind CSS purging unused styles
- ✅ Vite fast HMR via SWC transpiler
- ✅ Sharp image optimization for build

### Best Practices
- Keep components small and reusable
- Use React Query for all API calls
- Avoid inline functions in JSX (pass refs)
- Lazy load heavy components (maps, charts)
- Use Suspense boundaries for loading states

---

## Next Steps / Future Phases

### Phase 3 (Idea List)
- [ ] Payment integration (Stripe for premium features)
- [ ] Advanced analytics (user segmentation, cohort analysis)
- [ ] Community leaderboard (top donors, organizations)
- [ ] Video guide for item classification
- [ ] SMS notifications for pickups
- [ ] Mobile app on App Store / Play Store
- [ ] Recurring donations (monthly auto-pickup)
- [ ] Social sharing with impact metrics
- [ ] Partner review system
- [ ] Carbon offset marketplace

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Check code quality
npm run build           # Production build

# Database
npx supabase gen types typescript --project-id byhbvuoprsgqggndudxj > src/integrations/supabase/types.ts

# Android
npm run android         # Build & open
npm run android:sync    # Sync to phone
npm run android:open    # Open Studio

# Git Workflow
git checkout -b feature/name
git add .
git commit -m "Feature: description"
git push origin feature/name
# Then create PR and merge
```

---

## Contact & Resources

- **GitHub Repo**: https://github.com/13LA7E/ReHome
- **Live App**: https://13la7e.github.io/ReHome/
- **Supabase Dashboard**: https://app.supabase.com/
- **Issues**: Use GitHub Issues for bug reports
- **Documentation**: See .md files in root directory

---

**This index was last updated February 2026. For the latest information, check the README.md and individual feature files.**

