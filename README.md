# Personal Finance & Expense Tracker

A modern, full-stack personal finance and expense tracking web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Clerk Auth**.

---

## 📸 Screenshots

![BillFusion Screenshot](./public/assets/web.png)

| Dashboard Overview | Analytics & Reports |
|:------------------:|:------------------:|
| ![Dashboard Screenshot](./public/assets/dashboard-preview.png) | ![Analytics Screenshot](./public/assets/analytics-preview.png) |

| Budgets & Goals | Transactions & Categories |
|:---------------:|:-------------------------:|
| ![Budgets Screenshot](./public/assets/budgets-preview.png) | ![Transactions Screenshot](./public/assets/transactions-preview.png) |

---

## ✨ Features

- **📊 Dashboard Overview**: Real-time summary of total balances, recent transactions, spending breakdowns, and active budgets.
- **💳 Accounts Management**: Track multiple financial accounts (checking, savings, credit cards, investments).
- **💸 Transaction Tracking**: Log income, expenses, and inter-account transfers with custom categories.
- **🎯 Budgeting & Limits**: Set monthly or category-based spending budgets with visual progress indicators.
- **📈 Advanced Analytics**: Interactive charts for visual spending insights.
- **🔔 Notifications**: Alerts for budget thresholds and account updates.
- **🔐 User Authentication**: Secure sign-up/login powered by Clerk.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: PostgreSQL / SQLite with [Prisma ORM](https://www.prisma.io/)
- **Auth**: [Clerk](https://clerk.com/)
- **Icons & UI Components**: Lucide Icons, Radix UI primitives

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/pnpm/yarn installed.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/BLACKEYE-ASTRO/billfusion.git
cd billfusion

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and set up your environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/finance_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

### 4. Database Setup
Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📂 Project Structure

```text
├── app/
│   ├── api/            # API Route handlers (accounts, budgets, transactions, analytics, etc.)
│   ├── dashboard/      # Dashboard pages (analytics, budgets, transactions, settings)
│   ├── login/          # Clerk authentication routes
│   └── page.tsx        # Hero / Landing page
├── components/
│   ├── dashboard/      # UI components (charts, cards, modals, sidebar)
│   └── home-screen/    # Landing page components
├── lib/
│   ├── api/            # API client helpers
│   ├── hooks/          # Custom React SWR/fetcher hooks
│   └── prisma.ts       # Prisma Client instance
└── prisma/
    ├── schema.prisma   # Database schema & models
    └── migrations/     # SQL migrations
```

