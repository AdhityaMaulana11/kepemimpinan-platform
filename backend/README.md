# Kepemimpinan Platform — Backend (NestJS)

REST API for the Kepemimpinan Platform — a professional leadership learning and file management platform.

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- A [Supabase](https://supabase.com) project (free tier works)

---

## Step-by-Step Supabase Setup

### Step 1 — Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click **New Project**, fill in name + database password
3. Wait for provisioning (~2 min)
4. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon / public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Project Settings → Database → Connection string (URI)** → copy it

### Step 2 — Run Database Schema

Go to **SQL Editor** in Supabase and run:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  created_at timestamptz default now(),
  primary key (id)
);

-- Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Files
create table public.files (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  file_type text not null,
  file_url text not null,
  storage_path text not null,
  file_size bigint,
  category_id uuid references public.categories(id),
  uploaded_by uuid references public.profiles(id),
  is_published boolean default true,
  download_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- File views/analytics
create table public.file_views (
  id uuid default gen_random_uuid() primary key,
  file_id uuid references public.files(id) on delete cascade,
  viewer_id uuid references public.profiles(id),
  viewed_at timestamptz default now()
);
```

### Step 3 — Run Seed + RLS Policies

Run the contents of `seed.sql` in the SQL Editor.

### Step 4 — Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **New bucket**
3. Name it: `kepemimpinan-files`
4. Make it **Public**
5. Set file size limit to **50MB**

### Step 5 — Set Admin Role

After registering your first user via the API, run this in SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

---

## Environment Variables

Create a `.env` file in the `backend/` root:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_ANON_KEY=eyJhbGci...
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRY=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## Installation & Running

```bash
# Install dependencies
npm install

# Development (with hot-reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server runs on: `http://localhost:3001`  
Swagger docs: `http://localhost:3001/api/docs`

---

## API Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/files | Public | List files (filter/search/paginate) |
| GET | /api/files/:id | Public | Get file + increment view |
| POST | /api/files/upload | JWT | Upload file (multipart) |
| PATCH | /api/files/:id | Admin | Update file metadata |
| DELETE | /api/files/:id | Admin | Delete file |
| GET | /api/files/:id/download | Public | Get signed download URL |
| GET | /api/files/stats | Admin | Platform statistics |
| GET | /api/categories | Public | List categories |
| POST | /api/categories | Admin | Create category |
| PATCH | /api/categories/:id | Admin | Update category |
| DELETE | /api/categories/:id | Admin | Delete category |
| GET | /api/users | Admin | List users (paginated) |
| GET | /api/users/:id | Admin | Get user by ID |
| PATCH | /api/users/:id | Admin | Update user (name, role) |
| DELETE | /api/users/:id | Admin | Delete user |

---

## Supported File Types

`pdf`, `docx`, `pptx`, `xlsx`, `jpg`, `jpeg`, `png`, `gif`, `mp4`, `webm`

Max size: **50MB**
