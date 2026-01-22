# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean car leasing/rental landing site ("민생지원카") built on the Base44 platform. React frontend with Vite, using Base44 SDK for backend entities, authentication, and serverless functions.

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
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=your_backend_url
```

## Architecture

### Frontend (`src/`)
- **Pages** configured in `pages.config.js` - register new pages here with the page name as key
- **Layout** in `Layout.jsx` wraps all pages with common header/navigation
- **Components**
  - `components/ui/` - shadcn/ui components (Radix-based, don't modify directly)
  - `components/landing/` - Page-specific sections (HeroSection, VehiclesSection, etc.)
- **State Management**
  - React Query for server state: `useQuery` with `base44.entities.EntityName.list()/filter()`
  - Auth state via `AuthContext` (`useAuth` hook)

### Backend Functions (`functions/`)
Deno-based serverless functions deployed to Base44. Use `createClientFromRequest` from `@base44/sdk`:
```typescript
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    // Use base44.asServiceRole for privileged operations
});
```

### Data Fetching Pattern
```jsx
const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => base44.entities.Vehicle.list()
});

// With filtering
const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.filter({ is_featured: true }, '-created_date', 3)
});
```

### Path Aliases
`@/` maps to `src/` (e.g., `@/components`, `@/lib`, `@/api`)

## Key Dependencies

- **@base44/sdk** - Backend client for entities, auth, integrations
- **@tanstack/react-query** - Data fetching/caching
- **shadcn/ui** - UI components (configured in `components.json`, uses "new-york" style)
- **framer-motion** - Animations
- **react-hook-form + zod** - Form handling and validation
- **lucide-react** - Icons

## ESLint Configuration

Only lints `src/components/**`, `src/pages/**`, and `src/Layout.jsx`. Ignores `src/lib/**` and `src/components/ui/**`.
