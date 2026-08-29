# EstateHub — Real Estate Business Web Application

A production-ready, modern real-estate web application for a family-owned property and land sales business. Built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase-ready architecture**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Deployment](#deployment)
- [Admin Credentials](#admin-credentials)
- [Future AI Features](#future-ai-features)
- [License](#license)

---

## Features

### Customer Website

- **Home Page** — Hero, business intro, featured properties, categories, locations, why choose us, CTA, contact, footer
- **Properties Listing** — Search, filters (location, type, budget, size, availability)
- **Property Details** — Image gallery, features, map section, enquiry CTA
- **Enquiry Form** — Validates input, associates with selected property, success feedback

### Admin Dashboard

- **Protected Admin Area** — Login / logout with Supabase Auth-ready architecture
- **Dashboard** — Summary cards for properties, enquiries, leads, and follow-ups
- **Property Management** — Add, edit, delete, change availability
- **Enquiry Management** — View, update status, add notes, convert to lead
- **Lead Management** — CRM-style pipeline with priority, status, notes, follow-up dates

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom component library (shadcn/ui-compatible)
- **Auth:** Supabase Auth (mock mode included for quick testing)
- **Database:** Supabase PostgreSQL (service layer ready)
- **Storage:** Supabase Storage (ready for property images)
- **Validation:** Zod
- **Icons:** Lucide React

---

## Project Structure

```
real-estate-app/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/           # Admin dashboard routes
│   │   ├── enquiry/         # Customer enquiry page
│   │   ├── properties/      # Property listing & detail pages
│   │   ├── globals.css      # Global styles & CSS variables
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── admin/           # Admin-specific components
│   │   ├── enquiry/         # Enquiry form component
│   │   ├── layout/          # Navbar, Footer, AdminSidebar
│   │   ├── property/        # Property cards, filters, gallery, form
│   │   └── ui/              # Reusable UI primitives
│   ├── hooks/               # Custom React hooks (auth, properties)
│   ├── lib/
│   │   ├── ai/              # Future AI feature extension point
│   │   ├── data/            # Data service layer (mock / Supabase)
│   │   ├── supabase/        # Supabase client setup
│   │   ├── utils/           # Formatting & validation helpers
│   │   └── constants.ts     # App constants
│   ├── types/               # TypeScript types & interfaces
│   └── middleware.ts        # Route protection & session refresh
├── .env.example             # Environment variable template
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone or extract the project**

```bash
cd real-estate-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see [Environment Variables](#environment-variables)).

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin credentials for mock/demo mode
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

> **Important:** Never commit `.env.local` to Git. It is already added to `.gitignore`.

---

## Supabase Setup

### 1. Create a Supabase Project

Go to [https://supabase.com](https://supabase.com) and create a new project.

### 2. Get Your Credentials

From your Supabase project settings, copy:

- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service Role Key → `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

### 3. Create Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL,
  price BIGINT NOT NULL,
  area INTEGER NOT NULL,
  features TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property images table
CREATE TABLE property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries table
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  budget BIGINT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  budget BIGINT,
  priority TEXT NOT NULL DEFAULT 'WARM',
  status TEXT NOT NULL DEFAULT 'NEW',
  notes TEXT,
  next_followup TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Enable Row Level Security (RLS)

Enable RLS on all tables and create policies for authenticated admin users. Example for `properties`:

```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write" ON properties
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### 5. Switch from Mock Data to Supabase

The data layer is in `src/lib/data/`. Each file contains mock implementations with comments showing the equivalent Supabase query.

To connect Supabase:

1. Replace the mock function bodies in `src/lib/data/properties.ts`, `enquiries.ts`, and `leads.ts` with `supabase.from(...)` calls.
2. In `src/hooks/useAuth.ts`, uncomment the Supabase Auth sections and remove the mock login logic.
3. In `src/middleware.ts`, uncomment the server-side auth check for `/admin/*` routes.

---

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/real-estate-app.git
git push -u origin main
```

2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` in the Vercel dashboard.
4. Deploy.

### Build Locally

```bash
npm run build
```

---

## Admin Credentials

For local development and demo purposes, the default admin credentials are:

- **Email:** `admin@example.com`
- **Password:** `admin123`

You can change these in `.env.local`:

```env
NEXT_PUBLIC_ADMIN_EMAIL=your-admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

> In production, switch to Supabase Auth and remove these mock credentials.

---

## Future AI Features

The application is structured to easily add AI capabilities later:

- AI Lead Scoring
- AI Property Recommendations
- AI Customer Chatbot
- AI Enquiry Summarization
- AI Follow-up Suggestions
- AI Marketing Content Generation

See `src/lib/ai/README.md` for the planned extension pattern.

---

## License

This project is provided as a starter template for your real estate business. Modify and use it as needed.

---

## Support

For questions or customizations, refer to the Next.js and Supabase documentation:

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
