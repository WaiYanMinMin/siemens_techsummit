# Siemens Tech Summit Microsite

Responsive event microsite with a registration form backed by Supabase and
confirmation emails via Resend.

## 1) Environment Setup

Update `.env.local` placeholders with real values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
FROM_EMAIL=events@yourdomain.com
```

## 2) Supabase Table

Run this in Supabase SQL Editor:

```sql
create table if not exists public.registrations (
  id bigserial primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  mobile_number text not null,
  job_title text not null,
  company text not null,
  industry text not null,
  breakout_track text not null,
  challenges text[] default '{}',
  need_timeline text check (need_timeline in ('6_months', '12_months', 'exploring', 'no_requirement')),
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists registrations_email_unique
on public.registrations (lower(email));

create unique index if not exists registrations_mobile_unique
on public.registrations (mobile_number);

alter table public.registrations enable row level security;
```

## 3) Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) What Is Implemented

- Responsive landing page and registration section
- Form validation on client and server
- Duplicate registration protection (email/mobile)
- Server API inserts into Supabase
- Confirmation email: successful registration now, QR access later

## 5) Deploy

- Push repo to GitHub
- Import into Vercel
- Add the same environment variables in Vercel project settings
- Connect your custom domain in Vercel and update DNS records
