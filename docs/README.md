# SSB Store Documentation

## Overview
A full-featured e-commerce platform built with:
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Material UI
- Razorpay Integration
- NextAuth.js

## Project Structure
```
ssb-store/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   └── admin/             # Admin panel routes
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── checkout/         # Checkout flow components
│   └── shared/           # Shared/common components
├── lib/                  # Utility functions and shared code
│   ├── actions/          # Server actions
│   ├── hooks/           # Custom React hooks
│   └── validations/     # Form validation schemas
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Core Features
1. User Authentication
2. Product Management
3. Shopping Cart
4. Checkout Process
5. Order Management
6. Admin Dashboard
7. Payment Integration