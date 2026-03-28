# FundBD — Crowdfunding Platform for Bangladesh

Production-grade crowdfunding platform built for Bangladesh and emerging markets. Similar to Wefunder, Kickstarter, and AngelList but optimized for the Bangladeshi market with local payment integration.

## Tech Stack

- **Framework:** Next.js 15+ (App Router) with TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL with Prisma ORM
- **Charts:** Recharts
- **Auth:** JWT (httpOnly cookies)
- **Validation:** Zod
- **Icons:** Lucide React

## Features

### Public Platform
- Campaign discovery with search, filters, and categories
- Campaign detail pages with growth metrics, milestones, and data room
- Founder profiles with trust scores and verification badges
- Landing page with featured campaigns and activity feed

### Founder Dashboard
- Campaign creation wizard (5-step)
- Growth metrics entry (revenue, users, customers, etc.)
- Milestone tracking with budget allocation
- Data room for investor documents
- Withdrawal management
- Campaign analytics

### Supporter Dashboard
- Browse and fund campaigns
- Contribution history
- Saved campaigns
- Notifications

### Admin Panel
- Campaign approval workflow
- User management
- Transaction monitoring
- Withdrawal review
- Verification review
- Platform analytics (KPI dashboard)

### Investor-Grade Features
- Trust Score system (0-100) with verification badges
- Growth analytics with Recharts (revenue, users, funding progress)
- Data room with public/private document visibility
- Milestone tracking with budget allocation charts
- Comments and campaign updates

### Payment Integration (Modular)
- bKash, Nagad, SSLCommerz stubs (ready for production integration)
- Payment gateway abstraction layer
- Platform fee (5%) built in

### Security
- Role-based access control (Founder, Supporter, Admin)
- JWT auth with httpOnly cookies
- Rate limiting on auth endpoints
- Input validation with Zod on all routes
- Audit logging for admin actions
- Secure password hashing (bcrypt)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database URL and secrets

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

6. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

7. Seed the database:
   ```bash
   npx prisma db seed
   ```

8. Start the development server:
   ```bash
   npm run dev
   ```

9. Open [http://localhost:3000](http://localhost:3000)

### Seed Accounts
- **Admin:** admin@fundbd.com / Admin123!
- **Founder:** rahim@example.com / Founder123!
- **Supporter:** karim@example.com / Supporter123!

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, signup, verify-email, reset-password
│   ├── (dashboard)/
│   │   ├── admin/           # Admin panel pages
│   │   ├── founder/         # Founder dashboard pages
│   │   └── supporter/       # Supporter dashboard pages
│   ├── (public)/            # Public pages (campaigns, founders, categories)
│   └── api/                 # API routes
│       ├── admin/           # Admin endpoints
│       ├── auth/            # Auth endpoints
│       ├── campaigns/       # Campaign CRUD + sub-resources
│       ├── contributions/   # Contribution history
│       ├── notifications/   # User notifications
│       ├── payments/        # Payment callbacks
│       ├── saved-campaigns/ # Bookmarked campaigns
│       ├── trust-score/     # Trust score calculation
│       ├── verifications/   # Identity verification
│       └── withdrawals/     # Withdrawal requests
├── components/
│   ├── campaign/            # Campaign cards, detail, filters, grid
│   ├── charts/              # Recharts components
│   ├── data-room/           # Document management
│   ├── layout/              # Header, footer, sidebar
│   ├── shared/              # Reusable UI patterns
│   └── ui/                  # Base UI primitives
├── context/                 # Auth context provider
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities, validators, payment stubs
└── types/                   # TypeScript type definitions
prisma/
├── schema.prisma            # Database schema
├── seed.ts                  # Database seeder
└── migrations/              # Migration files
```

## API Routes

### Auth
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/verify-email
- POST /api/auth/reset-password
- GET /api/auth/me

### Campaigns
- GET/POST /api/campaigns
- GET/PATCH/DELETE /api/campaigns/[id]
- GET /api/campaigns/featured
- GET /api/campaigns/search
- GET/POST /api/campaigns/[id]/metrics
- GET/POST /api/campaigns/[id]/milestones
- GET/POST /api/campaigns/[id]/documents
- GET/POST /api/campaigns/[id]/comments
- GET/POST /api/campaigns/[id]/updates
- POST /api/campaigns/[id]/contribute

### User
- GET/PATCH /api/users/[id]/profile
- GET /api/contributions
- GET/POST /api/saved-campaigns
- GET /api/notifications
- PATCH /api/notifications/[id]/read
- GET /api/trust-score/[userId]
- GET/POST /api/verifications
- GET/POST /api/withdrawals

### Admin
- GET /api/admin/stats
- PATCH /api/admin/campaigns/[id]/review
- GET /api/admin/users
- GET /api/admin/transactions
- PATCH /api/admin/withdrawals/[id]/review
- PATCH /api/admin/verifications/[id]/review

## Deployment

### Vercel
```bash
npm run build
vercel deploy
```

### Environment Variables
Set all variables from `.env.example` in your deployment platform.

### Database
Use Railway, Supabase, or Neon for managed PostgreSQL.

## Future Roadmap (Phase 2)
- AI fraud detection
- Investor mode with portfolio tracking
- Recommendation engine
- Mobile apps (React Native)
- Bangla localization
- Advanced analytics & reporting
- Real payment gateway integration

## License
MIT
