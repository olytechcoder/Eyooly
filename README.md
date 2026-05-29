# Eyooly — Official Platform

**Eyooly** is the local marketplace platform for Equatorial Guinea, covering marketplace/classified listings, local deliveries, food delivery, dispatch/package sending, and ride-hailing.

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma + PostgreSQL**, **NextAuth.js** (magic-link auth), and **Resend** (email).

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Variables](#environment-variables)
5. [Local Development](#local-development)
6. [Production Build](#production-build)
7. [Deployment: VPS / WHM / cPanel](#deployment-vps--whm--cpanel)
8. [Deployment: Docker](#deployment-docker)
9. [Deployment: Vercel (optional)](#deployment-vercel-optional)
10. [Database Setup](#database-setup)
11. [Making a User Admin](#making-a-user-admin)
12. [File Uploads](#file-uploads)
13. [Email Configuration](#email-configuration)

---

## Features

- **Marketplace** — Browse, search, and filter listings by category and city
- **Listing detail** — Image gallery, seller info, inquiry form, related listings
- **Create listing** — Multi-image upload, auth-gated (login required)
- **Deliveries** — Request local package delivery with pickup/dropoff details
- **Rides** — Request a ride with scheduled pickup support
- **Food** — Coming soon page for food delivery
- **Sellers page** — Benefits, how-to-sell, and pricing
- **Safety page** — Trust & safety guidelines
- **Contact page** — Contact form with Resend email notification
- **Waitlist** — Email capture for launch notification
- **User dashboard** — Own listings, inquiries, delivery and ride history with status tracking
- **Admin dashboard** — Listing moderation (approve/reject), user management, seller verification badges, delivery/ride status management
- **Magic-link auth** — Passwordless email login via NextAuth.js + Resend
- **ES/EN/FR language toggle** — Full 3-locale support
- **Seller verification badges** — Admin can verify sellers; badge shown on cards and detail pages

---

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Framework   | Next.js 14 (App Router)                   |
| Language    | TypeScript                                |
| Styling     | Tailwind CSS v3                           |
| Database    | PostgreSQL via Prisma ORM                 |
| Auth        | NextAuth.js v4 (Email magic-link)         |
| Email       | Resend API                                |
| File upload | Local disk (default) or S3-compatible     |
| Deployment  | VPS/cPanel/Docker/Vercel                  |

---

## Project Structure

```
eyooly-nextjs/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed categories + sample listings
├── public/
│   └── uploads/            # Local image uploads (created at runtime)
├── src/
│   ├── app/
│   │   ├── api/            # Next.js API route handlers
│   │   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   │   ├── listings/             # Listings CRUD
│   │   │   ├── categories/           # Categories list
│   │   │   ├── inquiries/            # Inquiry submission
│   │   │   ├── waitlist/             # Waitlist signup
│   │   │   ├── contact/              # Contact form
│   │   │   ├── delivery/             # Delivery requests
│   │   │   ├── rides/                # Ride requests
│   │   │   ├── upload/               # Image upload
│   │   │   └── admin/                # Admin endpoints
│   │   ├── (pages)/        # All page components
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Brand theme + global styles
│   ├── components/
│   │   └── layout/         # Header, Footer, PublicLayout
│   ├── contexts/
│   │   └── LanguageContext.tsx  # ES/EN/FR translations
│   └── lib/
│       ├── auth.ts         # NextAuth configuration
│       ├── prisma.ts       # Prisma client singleton
│       └── utils.ts        # Formatting helpers
├── .env.example            # Environment variable template
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

Copy `.env.example` to `.env.local` (development) or `.env` (production):

```bash
cp .env.example .env.local
```

| Variable              | Required | Description                                                  |
|-----------------------|----------|--------------------------------------------------------------|
| `DATABASE_URL`        | ✅        | PostgreSQL connection string                                 |
| `NEXTAUTH_SECRET`     | ✅        | Random secret for session signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL`        | ✅        | Canonical URL of your deployment (e.g. `https://eyooly.com`) |
| `RESEND_API_KEY`      | ✅        | Resend API key — **server-side only, never expose in frontend** |
| `EMAIL_FROM`          | ✅        | Sender address for emails (must be verified in Resend)       |
| `ADMIN_EMAIL`         | ✅        | Admin notification email; first login with this email gets admin role |
| `UPLOAD_PROVIDER`     | ❌        | `local` (default) or `s3`                                   |
| `AWS_ACCESS_KEY_ID`   | S3 only  | S3 / Cloudflare R2 access key                               |
| `AWS_SECRET_ACCESS_KEY` | S3 only | S3 / Cloudflare R2 secret key                              |
| `AWS_REGION`          | S3 only  | S3 region (use `auto` for Cloudflare R2)                    |
| `AWS_S3_BUCKET`       | S3 only  | S3 bucket name                                              |
| `AWS_S3_ENDPOINT`     | S3 only  | Custom endpoint for R2 or other S3-compatible providers     |
| `NEXT_PUBLIC_APP_URL` | ❌        | Public URL for Open Graph meta tags                         |

---

## Local Development

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn
- PostgreSQL 14+ (local or remote)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/eyooly.git
cd eyooly

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up the database
npx prisma migrate dev --name init

# 5. Seed sample data (categories + listings)
npx prisma db seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
# Build the app
npm run build

# Start the production server
npm run start
```

The server listens on port `3000` by default. Set the `PORT` environment variable to change it.

---

## Deployment: VPS / WHM / cPanel

### Option A — Direct Node.js with PM2 (Recommended)

PM2 keeps the app alive and restarts it on crash or server reboot.

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Install Node.js 18+ (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 globally
npm install -g pm2

# 4. Upload your project (via git, SCP, or cPanel File Manager)
git clone https://github.com/your-org/eyooly.git /var/www/eyooly
cd /var/www/eyooly

# 5. Install dependencies (production only)
npm install --omit=dev

# 6. Create .env file with production values
cp .env.example .env
nano .env   # Fill in all required values

# 7. Run database migrations
npx prisma migrate deploy

# 8. Seed categories (first deploy only)
npx prisma db seed

# 9. Build the app
npm run build

# 10. Start with PM2
pm2 start npm --name eyooly -- start
pm2 save
pm2 startup   # Follow the printed command to enable auto-start on reboot
```

**PM2 management commands:**
```bash
pm2 status          # Check app status
pm2 logs eyooly     # View logs
pm2 restart eyooly  # Restart app
pm2 stop eyooly     # Stop app
pm2 delete eyooly   # Remove from PM2
```

### Option B — Nginx Reverse Proxy (Recommended for production)

Nginx handles SSL, compression, and proxies requests to Node.js on port 3000.

```nginx
# /etc/nginx/sites-available/eyooly
server {
    listen 80;
    server_name eyooly.com www.eyooly.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name eyooly.com www.eyooly.com;

    ssl_certificate     /etc/letsencrypt/live/eyooly.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/eyooly.com/privkey.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Static files (Next.js _next/static)
    location /_next/static/ {
        alias /var/www/eyooly/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploaded images
    location /uploads/ {
        alias /var/www/eyooly/public/uploads/;
        expires 30d;
    }

    # Proxy all other requests to Next.js
    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site and reload Nginx
sudo ln -s /etc/nginx/sites-available/eyooly /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Let's Encrypt (free)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d eyooly.com -d www.eyooly.com
```

### Option C — cPanel Node.js App

If your cPanel hosting supports Node.js applications:

1. Log into cPanel → **Setup Node.js App**
2. Create a new application:
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `/home/user/eyooly`
   - **Application URL**: `eyooly.com`
   - **Application startup file**: `node_modules/.bin/next` (or use a custom `server.js`)
3. Set environment variables in the cPanel Node.js app panel (all variables from `.env.example`)
4. Upload your project files via File Manager or Git
5. Run `npm install` and `npm run build` in the terminal
6. Start the application

> **Note:** cPanel Node.js hosting varies by provider. Some providers require a custom `server.js` entry point. If `npm start` doesn't work directly, create a `server.js`:
> ```js
> const { createServer } = require('http');
> const { parse } = require('url');
> const next = require('next');
> const app = next({ dev: false });
> const handle = app.getRequestHandler();
> app.prepare().then(() => {
>   createServer((req, res) => {
>     handle(req, res, parse(req.url, true));
>   }).listen(process.env.PORT || 3000);
> });
> ```

---

## Deployment: Docker

### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

> Add `output: 'standalone'` to `next.config.js` for the Docker standalone build.

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: eyooly
      POSTGRES_USER: eyooly_user
      POSTGRES_PASSWORD: your_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://eyooly_user:your_secure_password@db:5432/eyooly
      NEXTAUTH_SECRET: your-secret-here
      NEXTAUTH_URL: https://eyooly.com
      RESEND_API_KEY: re_xxxx
      EMAIL_FROM: "Eyooly <noreply@eyooly.com>"
      ADMIN_EMAIL: admin@eyooly.com
      UPLOAD_PROVIDER: local
    depends_on:
      - db
    volumes:
      - uploads:/app/public/uploads

volumes:
  postgres_data:
  uploads:
```

```bash
# Build and start
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed data
docker-compose exec app npx prisma db seed

# View logs
docker-compose logs -f app
```

---

## Deployment: Vercel (optional)

Vercel is the easiest option but requires a remote PostgreSQL database (e.g., Supabase, Neon, or PlanetScale).

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
vercel env add ADMIN_EMAIL

# Deploy to production
vercel --prod
```

> **Note:** When using Vercel, set `UPLOAD_PROVIDER=s3` and configure S3/R2 credentials, as Vercel's filesystem is ephemeral and local uploads will be lost on redeploy.

---

## Database Setup

### First-time setup

```bash
# Generate Prisma client
npx prisma generate

# Run all migrations
npx prisma migrate deploy

# Seed categories and sample listings
npx prisma db seed
```

### Schema changes (development)

```bash
# After editing prisma/schema.prisma:
npx prisma migrate dev --name describe-your-change

# Apply to production:
npx prisma migrate deploy
```

### Prisma Studio (visual DB browser)

```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## Making a User Admin

After a user logs in for the first time, promote them to admin via Prisma Studio or direct SQL:

```sql
-- PostgreSQL
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@eyooly.com';
```

Or via Prisma Studio: open the `User` table, find the user, and change `role` to `ADMIN`.

> **Tip:** Set `ADMIN_EMAIL` in your `.env` to the email address that should automatically receive admin role on first login. The auth callback checks this and assigns the role.

---

## File Uploads

### Local disk (default)

Images are saved to `public/uploads/` and served at `/uploads/filename.jpg`.

- Works out of the box for VPS and cPanel deployments.
- **Not suitable for Vercel** (ephemeral filesystem).
- Ensure the `public/uploads/` directory is writable by the Node.js process.

### S3 / Cloudflare R2

Set `UPLOAD_PROVIDER=s3` and configure the S3 credentials in `.env`:

```bash
UPLOAD_PROVIDER=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=auto
AWS_S3_BUCKET=eyooly-uploads
# For Cloudflare R2:
AWS_S3_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
```

---

## Email Configuration

Eyooly uses [Resend](https://resend.com) for:

- **Magic-link authentication** — passwordless login emails
- **Contact form notifications** — sent to `ADMIN_EMAIL`
- **Waitlist confirmation** — sent to subscribers

### Setup

1. Create a free account at [resend.com](https://resend.com)
2. Add and verify your domain (or use `onboarding@resend.dev` for testing)
3. Create an API key and add it to `RESEND_API_KEY`
4. Set `EMAIL_FROM` to a verified sender address

### Testing without a domain

Use `onboarding@resend.dev` as `EMAIL_FROM` during development. Magic links will only be sent to the email address registered in your Resend account.

---

## package.json Scripts

| Script         | Command                       | Description                          |
|----------------|-------------------------------|--------------------------------------|
| `dev`          | `next dev`                    | Start development server on port 3000 |
| `build`        | `next build`                  | Build for production                 |
| `start`        | `next start`                  | Start production server              |
| `lint`         | `next lint`                   | Run ESLint                           |
| `db:generate`  | `prisma generate`             | Generate Prisma client               |
| `db:migrate`   | `prisma migrate dev`          | Run migrations (development)         |
| `db:deploy`    | `prisma migrate deploy`       | Apply migrations (production)        |
| `db:seed`      | `prisma db seed`              | Seed database with sample data       |
| `db:studio`    | `prisma studio`               | Open Prisma Studio                   |

---

## Brand Colors

| Name       | Hex       | Usage                              |
|------------|-----------|------------------------------------|
| Carbon     | `#080e0a` | Primary dark background            |
| Ink        | `#0f1110` | Secondary dark background          |
| Cream      | `#f5f2ed` | Light background, primary text on dark |
| Terracotta | `#c9735a` | Brand accent, CTAs, highlights     |
| Sage       | `#b7baad` | Muted text, secondary elements     |

---

## License

Copyright © 2025 Eyooly. All rights reserved.
