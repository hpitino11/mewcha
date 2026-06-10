# Mewcha

A full-stack ordering app for a boba tea cafe. Customers can browse the menu, customize drinks, and place orders. Admins can manage the menu and track order status through a separate dashboard.

## Tech stack

**Client** — React, TypeScript, Vite, TanStack Query, CSS Modules  
**Server** — Node.js, Express, Knex, PostgreSQL  
**Auth** — JWT stored in localStorage

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` at the repo root and fill in your values:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mewcha
JWT_SECRET=your_jwt_secret
PORT=3001
CLIENT_URL=http://localhost:5173
```

### Database setup

```bash
npm run migrate --workspace=server
npm run seed --workspace=server
```

### Run (both servers)

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## Features

- Menu browsing by category (Matcha, Boba, Coffee, Seasonal)
- Drink customization: size, ice level, sweetness, toppings
- Cart with per-item subtotals
- Order placement and order history (requires account)
- Admin dashboard: manage menu items, view and update order status

## Project structure

```
mewcha/
├── client/         React + TypeScript frontend
│   └── src/
│       ├── context/    AuthContext, CartContext
│       ├── lib/        api.ts — all fetch calls
│       └── types/      shared TypeScript interfaces
└── server/
    └── src/
        ├── middleware/ JWT auth, admin guard
        ├── migrations/ Knex migrations
        ├── routes/     auth, menu, orders, admin
        └── seeds/      sample menu data
```

## Admin access

To promote a user to admin, run this SQL against your database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```
