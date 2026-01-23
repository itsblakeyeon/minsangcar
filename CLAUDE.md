# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean car leasing/rental landing site ("민생지원카"). React frontend with Vite, using Supabase for database. Public landing page with consultation form - no authentication required.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint (quiet mode)
npm run lint:fix     # ESLint with auto-fix
npm run typecheck    # TypeScript check via jsconfig.json
npm run preview      # Preview production build
```

## Environment Setup

Create `.env.local` with:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
VITE_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxx/exec
```

## Architecture

### Frontend (`src/`)
- **Pages** configured in `pages.config.js` - register new pages here with the page name as key
- **Layout** in `Layout.jsx` wraps all pages with common header/navigation
- **Components**
  - `components/ui/` - shadcn/ui components (Radix-based, don't modify directly)
  - `components/landing/` - Page-specific sections (HeroSection, VehiclesSection, etc.)
- **State Management**
  - React Query for server state with Supabase API

### API Layer (`src/api/`)
- `supabaseClient.js` - Supabase client initialization
- `entities/vehicles.js` - Vehicle CRUD operations
- `entities/reviews.js` - Review CRUD operations
- `entities/consultations.js` - Consultation form submissions with Slack/Google Sheets integration
- `index.js` - Exports all APIs

### Data Fetching Pattern
```jsx
import { vehiclesApi, reviewsApi } from '@/api';

const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehiclesApi.list()
});

const { data: reviews = [] } = useQuery({
    queryKey: ['featured-reviews'],
    queryFn: () => reviewsApi.listFeatured(3)
});
```

### Consultation Submission Flow
1. User submits form (ConsultationModal or CTASection)
2. Data saved to Supabase `consultations` table
3. Slack notification sent (async, non-blocking)
4. Google Sheets row added (async, non-blocking)
5. Meta Pixel Lead event fired

### Path Aliases
`@/` maps to `src/` (e.g., `@/components`, `@/lib`, `@/api`)

## Key Dependencies

- **@supabase/supabase-js** - Database client
- **@tanstack/react-query** - Data fetching/caching
- **shadcn/ui** - UI components (configured in `components.json`, uses "new-york" style)
- **framer-motion** - Animations
- **lucide-react** - Icons

## Database Schema (Supabase)

### vehicles
- `id` (UUID, PK)
- `name`, `brand`, `trim`, `fuel_type`, `image_url`
- `created_at`

### reviews
- `id` (UUID, PK)
- `customer_name`, `customer_situation`, `rating`, `content`
- `images` (text[]), `is_featured` (boolean)
- `created_at`

### consultations
- `id` (UUID, PK)
- `customer_name`, `phone`, `vehicle_name`
- `preferred_method`, `message`, `status`
- `created_at`

## ESLint Configuration

Only lints `src/components/**`, `src/pages/**`, and `src/Layout.jsx`. Ignores `src/lib/**` and `src/components/ui/**`.
