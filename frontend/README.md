# Kepemimpinan Platform — Frontend (Next.js 14)

Modern leadership learning platform frontend built with Next.js 14 App Router, TypeScript, and Tailwind CSS.

---

## Prerequisites

- Node.js >= 18
- Backend running at `http://localhost:3001`
- Supabase project setup complete (see `backend/README.md`)

---

## Environment Variables

Create `.env.local` in the `frontend/` root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Installation & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev
```

Open: `http://localhost:3000`

---

## Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page (Hero, Curriculum, File Repo) | Public |
| `/materials` | Browse all files with filters | Public |
| `/materials/[id]` | File detail page | Public |
| `/materials/[id]/present` | Full-screen presentation viewer | Public |
| `/login` | Login form | Public |
| `/register` | Register form | Public |
| `/dashboard` | User dashboard | Auth required |
| `/upload` | Upload file | Auth required |
| `/admin` | Admin overview | Admin only |
| `/admin/files` | Manage files | Admin only |
| `/admin/users` | Manage users | Admin only |
| `/admin/categories` | Manage categories | Admin only |

---

## Tech Stack

- **Next.js 14** — App Router, Server Components
- **TypeScript** — Strict mode
- **Tailwind CSS** — Utility-first styling + custom design system
- **Zustand** — Auth state (persisted to localStorage)
- **TanStack Query** — Server state, caching, mutations
- **React Hook Form + Zod** — Form validation
- **Axios** — HTTP client with interceptors
- **Sonner** — Toast notifications
- **Lucide React** — Icons
- **Plus Jakarta Sans** — Typography

---

## Design System

The UI uses a premium dark theme with:
- Glassmorphism cards with hover glow effects
- Animated gradient text accents
- Floating blob decorations in the hero
- Micro-animations (fade-in-up staggered, float)
- Color palette: Navy `#060b18` bg, Blue `#3b82f6` primary, Violet `#8b5cf6` accent

---

## Setting Admin Role

After registering, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```
