# The Saviour Malema Foundation

A full-stack NGO website serving less privileged communities, with a Supabase backend, authenticated admin panel, blog/newsletter system, and a 3D moments wheel.

## Stack

- Yarn package manager
- Vite + React 19
- Tailwind CSS 3.4
- Supabase (PostgreSQL, Auth, Storage)
- React Router for client-side routing
- Glassmorphism UI with 3D carousel

## Features

- **3D Moments Wheel** — a simulated vertical-axis spinning carousel of foundation milestones
- **Secure Admin Panel** — email/password auth via Supabase, protected routes
- **Blog/Updates Feed** — public Markdown-rendered posts with admin CRUD
- **Newsletter Signup** — email collection stored in Supabase
- **Image Uploads** — Supabase Storage integration with URL fallback
- **Pledge Estimator** — interactive slider showing donation impact

## Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL editor to create tables, RLS policies, and seed data
3. Copy `.env.example` to `.env` and fill in your project URL and anon key:

```bash
cp .env.example .env
```

### 3. Create an admin user

In your Supabase Dashboard, go to Auth > Users and invite a user with email/password.

### 4. Run locally

```bash
yarn dev
```

Open http://localhost:5173

## Project Structure

```
src/
├── main.jsx              # Entry with BrowserRouter + AuthProvider
├── App.jsx               # Layout shell: Navbar + Routes + Footer
├── lib/                  # Supabase client, constants
├── hooks/                # useMoments, useBlogPosts
├── context/              # AuthContext
├── components/           # Navbar, Footer, MomentWheel3D, etc.
├── pages/                # HomePage, BlogPage, LoginPage
│   └── admin/            # MomentsAdmin, BlogAdmin
└── utils/                # formatDate
```

## Offline Mode

The app works without Supabase credentials — it falls back to localStorage for moments data. Blog and newsletter features require a configured Supabase instance.
