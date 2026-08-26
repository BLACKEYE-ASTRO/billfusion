# BillFusion

### Modern Personal Finance Management, Reimagined.

BillFusion is a modern full-stack personal finance management platform designed to help users **track spending, manage budgets, monitor accounts, and understand their financial activity** through a clean and intuitive dashboard.

Built with **Next.js, React, TypeScript, Prisma, PostgreSQL, Clerk, Tailwind CSS, Motion, and Recharts**, BillFusion combines a robust backend architecture with a polished, responsive user experience.

> **BillFusion — Take control of your money.**

---

## ✨ Overview

Managing personal finances shouldn't feel like working with a spreadsheet.

BillFusion brings everyday financial management into a centralized dashboard where users can:

* Monitor their overall financial activity
* Manage income and expenses
* Organize transactions by category
* Create and track budgets
* Manage multiple financial accounts
* Analyze spending patterns
* Receive relevant notifications
* Search financial data quickly
* Customize application preferences
* Personalize the interface with multiple themes

The application is designed around three principles:

**Clarity** — Understand your finances at a glance.
**Control** — Manage transactions, accounts, and budgets efficiently.
**Personalization** — Make the financial workspace your own.

---

## 🚀 Highlights

| Feature           | Description                                       |
| ----------------- | ------------------------------------------------- |
| 🔐 Authentication | Secure authentication powered by Clerk            |
| 📊 Dashboard      | Centralized overview of financial activity        |
| 💳 Transactions   | Create, edit, categorize, and manage transactions |
| 🎯 Budgets        | Create budgets and monitor spending               |
| 🏦 Accounts       | Organize and track financial accounts             |
| 📈 Analytics      | Interactive financial charts and insights         |
| 🔔 Notifications  | Finance-related notifications and updates         |
| 🔎 Global Search  | Quickly find relevant financial information       |
| ⚙️ Settings       | Manage application and user preferences           |
| 🎨 Themes         | Multiple customizable visual themes               |
| 📱 Responsive UI  | Optimized for desktop, tablet, and mobile         |
| ⚡ App Router      | Built with the modern Next.js App Router          |
| 🗄️ Prisma        | Type-safe database access through Prisma ORM      |
| 🎞️ Motion        | Smooth UI animations and interactions             |

---

# 🎨 Theme System

BillFusion includes a centralized theme architecture that allows users to change the application's visual identity without affecting its underlying functionality.

### Available Themes

| Theme          | Description                   |
| -------------- | ----------------------------- |
| 🟢 **Emerald** | Default BillFusion theme      |
| 🔵 **Ocean**   | Cool blue financial interface |
| 🟣 **Violet**  | Modern purple visual system   |
| 🌹 **Rose**    | Warm rose/pink aesthetic      |
| 🟠 **Amber**   | Warm amber/orange interface   |
| ⚪ **Light**    | Clean light-mode appearance   |

Theme preferences are persisted so users can maintain their selected appearance across sessions.

The primary theme logic is centralized in:

```text
components/providers/theme-provider.tsx
```

This architecture makes it possible to introduce additional themes without modifying individual dashboard pages.

### Theme Architecture

```text
Settings
   │
   ▼
Theme Selector
   │
   ▼
Theme Provider
   │
   ├── Local UI State
   │
   └── Settings API
          │
          ▼
       Prisma
          │
          ▼
     UserSettings
```

---

# 🧩 Core Modules

## Dashboard

The dashboard provides a centralized financial overview containing:

* Total balance
* Income and expenses
* Spending information
* Recent transactions
* Budget information
* Financial activity

The goal is to provide users with the most important information without requiring them to navigate through multiple pages.

---

## Transactions

The transaction system allows users to manage their financial activity.

### Supported Operations

* Create transactions
* Edit transactions
* Delete transactions
* Categorize transactions
* Track income
* Track expenses
* Review transaction history

Transactions form the foundation of the application's financial analytics and budgeting features.

---

## Budgets

The budgeting module allows users to establish spending limits and monitor their financial behavior.

Users can:

* Create budgets
* Define spending limits
* Assign categories
* Monitor budget usage
* Track remaining budget
* Review budget performance

---

## Analytics

BillFusion transforms raw financial data into visual insights through interactive charts.

Analytics can include:

* Spending trends
* Category distribution
* Income vs. expenses
* Financial activity over time
* Spending patterns

Charts are powered by **Recharts** and are designed to make financial data easier to understand.

---

## Accounts

Accounts provide a way to organize different financial sources and maintain account-level balances.

The architecture supports managing multiple financial accounts while keeping their associated transactions organized.

---

## Notifications

The notification system provides users with relevant updates related to their financial activity and application state.

Notifications can be marked as read through the dedicated API endpoint.

---

## Global Search

BillFusion includes a centralized search experience for quickly locating relevant financial information across the dashboard.

The search architecture is designed to make large transaction and finance datasets easier to navigate.

---

## Settings

The settings module provides centralized controls for user preferences.

Current configuration includes:

* Application theme
* User preferences
* Visual customization
* Persisted settings

---

# 🏗️ Architecture

BillFusion follows a modern full-stack architecture built around Next.js.

```text
┌───────────────────────────────┐
│           Client              │
│      React + Next.js          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Dashboard UI            │
│ Components + Hooks + Motion   │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Route Handlers           │
│          /api/*                │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          Prisma ORM            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         PostgreSQL             │
└───────────────────────────────┘

        Authentication
              │
              ▼
            Clerk
```

---

# 🛠️ Tech Stack

## Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**
* **Lucide React**
* **React Icons**
* **Motion**
* **Recharts**

## Backend

* **Next.js Route Handlers**
* **Prisma ORM**
* **PostgreSQL**
* **Clerk Authentication**

## Development

* **ESLint**
* **TypeScript**
* **Prisma Migrations**
* **Next.js App Router**
* **Turbopack**

---

# 📁 Project Structure

```text
billfusion/
│
├── app/
│   ├── api/
│   │   ├── accounts/
│   │   ├── analytics/
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── dashboard/
│   │   ├── notifications/
│   │   ├── onboarding/
│   │   ├── search/
│   │   ├── settings/
│   │   ├── sidebar/
│   │   └── transactions/
│   │
│   ├── dashboard/
│   │   ├── analytics/
│   │   ├── budgets/
│   │   ├── settings/
│   │   ├── transactions/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── login/
│   ├── signup/
│   ├── onboarding/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── balance-card.tsx
│   │   ├── budget-card.tsx
│   │   ├── dashboard-header.tsx
│   │   ├── dashboard-shell.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── recent-transactions.tsx
│   │   ├── sidebar.tsx
│   │   └── spending-chart.tsx
│   │
│   ├── home-screen/
│   │
│   └── providers/
│       └── theme-provider.tsx
│
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── auth.ts
│   ├── default-categories.ts
│   └── prisma.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# 🗄️ Database Architecture

BillFusion uses **PostgreSQL** as its primary database and **Prisma ORM** as the database access layer.

### Core Models

```text
User
│
├── UserSettings
├── Account
├── Category
├── Transaction
├── Budget
│   └── BudgetCategory
├── FinancialGoal
└── Notification
```

### User Settings

Theme preferences are associated with the authenticated user through `UserSettings`.

```prisma
theme String @default("emerald")
```

This allows theme preferences to be persisted at the user level rather than relying solely on browser storage.

---

# 📡 API Architecture

BillFusion uses Next.js Route Handlers to provide backend functionality.

### API Endpoints

```text
/api/accounts
/api/analytics
/api/budgets
/api/categories
/api/dashboard
/api/notifications
/api/notifications/read
/api/onboarding
/api/search
/api/settings
/api/sidebar
/api/transactions
```

### Dynamic Routes

```text
/api/accounts/[id]
/api/budgets/[id]
/api/transactions/[id]
```

The API layer is responsible for:

* Authentication
* Request validation
* Business logic
* Database operations
* Response handling

---

# 🔐 Authentication

Authentication is handled through **Clerk**.

The authentication architecture supports:

* User registration
* User login
* Session management
* Protected dashboard routes
* Authenticated API requests
* User identity integration

Protected API endpoints should always verify the authenticated user before performing database operations.

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

### Environment Variable Reference

| Variable                            | Purpose                      |
| ----------------------------------- | ---------------------------- |
| `DATABASE_URL`                      | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public application key |
| `CLERK_SECRET_KEY`                  | Clerk server-side secret     |

> **Important:** Never commit `.env` files or production secrets to Git.

---

# 🚀 Getting Started

## Prerequisites

Before running BillFusion locally, make sure you have:

* Node.js installed
* npm installed
* A PostgreSQL database
* A Clerk application
* Git installed

---

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd billfusion
```

---

## 2. Install Dependencies

```bash
npm install
```

The project is configured to generate Prisma Client through the package `postinstall` script.

You can also generate it manually:

```bash
npx prisma generate
```

---

## 3. Configure Environment Variables

Create:

```text
.env
```

Then add your PostgreSQL and Clerk credentials:

```env
DATABASE_URL="your_database_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_publishable_key"
CLERK_SECRET_KEY="your_secret_key"
```

---

## 4. Configure the Database

Run the Prisma development migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client if necessary:

```bash
npx prisma generate
```

For production:

```bash
npx prisma migrate deploy
```

---

## 5. Start the Development Server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command                     | Description                            |
| --------------------------- | -------------------------------------- |
| `npm run dev`               | Start development server               |
| `npm run build`             | Create production build                |
| `npm run start`             | Start production server                |
| `npm run lint`              | Run ESLint                             |
| `npx prisma generate`       | Generate Prisma Client                 |
| `npx prisma migrate dev`    | Create and apply development migration |
| `npx prisma migrate deploy` | Apply production migrations            |

---

# 🚢 Deployment

BillFusion can be deployed to platforms capable of running Next.js applications and connecting to PostgreSQL.

### Production Architecture

```text
Users
  │
  ▼
Next.js Application
  │
  ├── React UI
  ├── Route Handlers
  └── Authentication
          │
          ▼
        Clerk
          
Next.js
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

### Production Checklist

Before deploying:

```bash
npm run lint
npx prisma generate
npx prisma migrate deploy
npm run build
```

Configure the production environment variables:

```env
DATABASE_URL="your_production_database_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_production_clerk_key"
CLERK_SECRET_KEY="your_production_clerk_secret"
```

Make sure your Clerk application is configured with the correct production domains, redirect URLs, and allowed origins.

---

# 🔒 Security

Security is an important part of the application's architecture.

### Best Practices

* Keep `CLERK_SECRET_KEY` server-side.
* Never expose server secrets to the client.
* Never commit `.env` files.
* Authenticate protected API requests.
* Validate request payloads before database operations.
* Scope database queries to the authenticated user.
* Use separate credentials for development and production.
* Configure Clerk production domains correctly.
* Apply database migrations through the production migration workflow.

---

# 📱 Responsive Design

BillFusion is designed to provide a consistent experience across:

* Desktop
* Laptop
* Tablet
* Mobile

The dashboard uses dedicated desktop and mobile navigation components to ensure important financial functionality remains accessible across different screen sizes.

---

# 🧪 Quality Checks

Before submitting changes, run:

```bash
npm run lint
npm run build
```

For database-related changes:

```bash
npx prisma generate
npx prisma migrate dev
```

A change should ideally pass both linting and production builds before being considered ready.

---

# 🎯 Roadmap

The current architecture leaves room for several future improvements.

### Financial Features

* [ ] Recurring transactions
* [ ] CSV transaction import
* [ ] CSV transaction export
* [ ] PDF financial reports
* [ ] Advanced financial goals
* [ ] Recurring budgets
* [ ] Account reconciliation
* [ ] Multi-currency support

### Analytics

* [ ] Advanced date-range filtering
* [ ] Monthly financial summaries
* [ ] Spending alerts
* [ ] Automated financial insights
* [ ] More advanced spending predictions

### Personalization

* [ ] Custom user-created themes
* [ ] Theme preview cards
* [ ] Independent light/dark mode
* [ ] More personalization options

### Platform

* [ ] Progressive Web App support
* [ ] Improved offline capabilities
* [ ] Advanced notification preferences

---

# 🤝 Contributing

Contributions and improvements are welcome.

### Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

### Make Your Changes

Implement the feature or fix and verify the application locally.

### Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature"
```

### Push Your Branch

```bash
git push origin feature/your-feature
```

Then open a pull request.

### Suggested Commit Convention

```text
feat: add new feature
fix: resolve application bug
refactor: improve application architecture
style: update UI styling
docs: update documentation
chore: update dependencies
```

---

# 🧹 Code Quality

BillFusion follows a modular architecture intended to keep the codebase maintainable as the application grows.

Key principles include:

* Reusable components
* Centralized theme management
* Type-safe database access
* Server-side authentication checks
* Separation of UI and API responsibilities
* Consistent naming conventions
* Responsive-first UI development
* Reusable hooks and utilities

---

# 📸 Screenshots

> Add screenshots or GIFs of the application here.

Recommended screenshots:

```text
/screenshots/
├── dashboard.png
├── transactions.png
├── budgets.png
├── analytics.png
├── settings.png
└── themes.png
```

Example:

```md
![BillFusion Dashboard](./screenshots/dashboard.png)
```

---

# 🗺️ Data Flow

### Standard Financial Data Flow

```text
User
 │
 ▼
Clerk Authentication
 │
 ▼
Next.js Dashboard
 │
 ▼
React Components
 │
 ▼
Custom Hooks
 │
 ▼
Next.js API Routes
 │
 ▼
Prisma ORM
 │
 ▼
PostgreSQL
```

### Theme Data Flow

```text
User
 │
 ▼
Settings UI
 │
 ▼
Theme Provider
 │
 ├──────────────► Local UI State
 │
 ▼
Settings API
 │
 ▼
Prisma
 │
 ▼
UserSettings
```

---

# 📄 License

BillFusion is currently a private personal/development project.

If the project is released publicly, add an appropriate license file and update this section accordingly.

---

# 👨‍💻 Author

## Akash Shingare

**Full Stack Developer**

BillFusion is built using:

* Next.js
* React
* TypeScript
* Prisma
* PostgreSQL
* Clerk
* Tailwind CSS
* Motion
* Recharts

---

# 🌟 Project Vision

BillFusion aims to make personal finance management feel less like maintaining a spreadsheet and more like using a modern financial product.

The project focuses on:

### Clarity

Present financial information in a simple and understandable way.

### Control

Provide practical tools for managing transactions, accounts, and budgets.

### Personalization

Allow users to customize their financial workspace through a flexible and extensible theme system.

---

<div align="center">

### BillFusion

**Take control of your money.**

Built with ❤️ using Next.js, Prisma & PostgreSQL.

</div>
