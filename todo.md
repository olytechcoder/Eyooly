# Eyooly Next.js — TODO

## Foundation
- [x] Next.js 14 App Router + TypeScript + Tailwind CSS setup
- [x] Eyooly brand theme (Carbon/Ink/Cream/Terracotta/Sage) in globals.css
- [x] Google Fonts (Inter + Playfair Display) configured
- [x] tsconfig.json with path aliases (@/*)
- [x] next.config.js with image domains and security headers
- [x] .env.example with all required variables documented
- [x] .gitignore

## Layout & Navigation
- [x] Responsive sticky glass Header with logo, nav, language toggle, mobile menu
- [x] Footer with logo, tagline, nav links, social handles, copyright
- [x] PublicLayout wrapper component
- [x] ES/EN/FR language toggle (LanguageContext)
- [x] Mobile hamburger menu with slide-out drawer

## Database & Auth
- [x] Prisma schema: User, Account, Session, VerificationToken (NextAuth)
- [x] Prisma schema: Category, Listing, ListingImage, Inquiry
- [x] Prisma schema: DeliveryRequest, RideRequest, Waitlist, SavedListing, ContactMessage
- [x] Enums: UserRole, ListingType, ListingStatus, InquiryStatus, RequestStatus
- [x] Prisma seed: 8 categories + 8 sample listings
- [x] NextAuth.js magic-link auth with Resend email provider
- [x] Prisma adapter for NextAuth
- [x] Custom magic-link email template (branded HTML)
- [x] Admin auto-promotion on first login via ADMIN_EMAIL env var
- [x] Session augmentation with role, verified, phone, city fields

## API Routes
- [x] GET/POST /api/listings (list with filters, create)
- [x] GET/PATCH/DELETE /api/listings/[id]
- [x] GET /api/categories
- [x] POST /api/inquiries
- [x] POST /api/waitlist
- [x] POST /api/contact (with Resend email notification)
- [x] POST /api/delivery
- [x] POST /api/rides
- [x] POST /api/upload (local disk + S3 support)
- [x] GET /api/admin/stats
- [x] GET /api/admin/listings + PATCH /api/admin/listings/[id]
- [x] GET /api/admin/users + PATCH /api/admin/users/[id]
- [x] GET/PATCH /api/admin/requests (delivery + ride)

## Pages
- [x] Homepage: hero, service highlights, stats, how-it-works, testimonials, waitlist form, CTA
- [x] Marketplace: category filters, search bar, listing grid with cards
- [x] Listing detail: image gallery, description, seller info + verified badge, inquiry form, related listings
- [x] Create listing: multi-image upload, all fields, auth-gated with redirect
- [x] User dashboard: own listings, inquiries, delivery/ride history with status tracking
- [x] Deliveries service page with request form
- [x] Rides service page with request form
- [x] Food coming-soon page
- [x] Sellers page: benefits, how-to-sell, pricing
- [x] Safety page: trust & safety guidelines
- [x] Contact page with form
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Admin dashboard: stats, listing moderation, user management, delivery/ride status management
- [x] Auth pages: sign-in, verify-request, error

## Bonus Features
- [x] Multi-image upload on create listing (up to 10 images)
- [x] Delivery/ride status tracking (PENDING → ACCEPTED → IN_PROGRESS → COMPLETED)
- [x] Seller verification badges (admin toggle → badge on cards and detail pages)

## Deployment
- [x] README with full VPS/cPanel/Docker/Vercel deployment guide
- [x] Dockerfile (multi-stage, non-root user)
- [x] docker-compose.yml (app + PostgreSQL + migration runner)
- [x] ecosystem.config.js (PM2 configuration)
- [x] .dockerignore
- [x] .env.example with all variables documented

## Quality
- [x] TypeScript: zero errors (npx tsc --noEmit)
- [x] No Manus lock-in (no Manus OAuth, no Manus DB, no Manus-specific APIs)
- [x] Fully portable: download ZIP → configure .env → npm install → npm run build → npm start

## MVP v0.1 Sprint

- [x] Update Prisma schema: Listing with slug + sellerWhatsapp, unified Request model, WaitlistLead, ContactMessage
- [x] Seed updated categories and sample listings with slugs and WhatsApp numbers
- [x] /mercado page: listing grid, category/city/price/type filters, keyword search
- [x] /mercado/[slug] listing detail: image gallery, price in XAF, WhatsApp button, report button
- [x] /publicar-anuncio create listing page: all fields, pending status, Spanish success message
- [x] /entregas request form: name, phone, pickup, dropoff, notes, Resend email, success message
- [x] /viajes request form: name, phone, pickup, dropoff, notes, Resend email, success message
- [x] /comida request form: name, phone, pickup, notes, Resend email, success message
- [x] API: POST /api/listings (create listing, slug generation)
- [x] API: GET /api/listings (public approved only, with filters)
- [x] API: POST /api/delivery-request (save + Resend to ADMIN_EMAIL)
- [x] API: POST /api/ride-request (save + Resend to ADMIN_EMAIL)
- [x] API: POST /api/food-request (save + Resend to ADMIN_EMAIL)
- [x] API: POST /api/waitlist (save + Resend to ADMIN_EMAIL)
- [x] API: POST /api/contact (save + Resend to ADMIN_EMAIL)
- [x] /admin dashboard: pending/approved/rejected listings, approve/reject actions, all request types, waitlist
- [x] Admin guard via ADMIN_EMAIL env var (no full auth required for MVP)
- [x] Update Header navigation to include /mercado and /publicar-anuncio
- [x] TypeScript check passes with zero errors (npx tsc --noEmit)
