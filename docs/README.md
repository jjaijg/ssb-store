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
ssb-store
📦app                   # Next.js app router pages
 ┣ 📂(auth)             # Authntication pages
 ┃ ┣ 📂signin
 ┃ ┣ 📂signup
 ┃ ┗ 📜layout.tsx
 ┣ 📂(root)
 ┃ ┣ 📂cart             # Cart page
 ┃ ┣ 📂checkout         # Checkout pages
 ┃ ┃ ┣ 📂failed
 ┃ ┃ ┣ 📂payment
 ┃ ┃ ┣ 📂success
 ┃ ┣ 📂product          # Product pages
 ┃ ┣ 📜layout.tsx
 ┣ 📂admin              # Admin panel routes
 ┃ ┣ 📂brand
 ┃ ┣ 📂category
 ┃ ┣ 📂dashboard
 ┃ ┣ 📂orders
 ┃ ┣ 📂products
 ┃ ┃ ┣ 📂variants
 ┃ ┗ 📜layout.tsx
 ┣ 📂user               # User Routes
 ┃ ┣ 📂orders           # Order page
 ┃ ┣ 📂profile          # Profile Page
 ┃ ┣ 📂address          # Address page - TODO
 ┃ ┗ 📜layout.tsx
 ┣ 📂api
 ┃ ┣ 📂order
 ┃ ┣ 📂uploadthing
 ┃ ┣ 📂verify
 ┃ ┗ 📂[...nextauth]
 ┣ 📜error.tsx
 ┣ 📜layout.tsx
 ┣ 📜loading.tsx
 ┗ 📜not-found.tsx
 📦lib
 ┣ 📂actions                        # Server actions
 ┃ ┣ 📜brand.actions.ts
 ┃ ┣ 📜cart.actions.ts
 ┃ ┣ 📜category.actions.ts
 ┃ ┣ 📜checkout.actions.ts
 ┃ ┣ 📜order.actions.ts
 ┃ ┣ 📜payment.actions.ts
 ┃ ┣ 📜product.actions.ts
 ┃ ┣ 📜productVariant.actions.ts
 ┃ ┣ 📜uploadthing.actions.ts
 ┃ ┗ 📜user.actions.ts
 ┣ 📂constants                     # App constants
 ┣ 📂validationSchema              # Form Validation schemas
 ┃ ┣ 📜brand.schema.ts
 ┃ ┣ 📜cart.schema.ts
 ┃ ┣ 📜category.schema.ts
 ┃ ┣ 📜checkout.schema.ts
 ┃ ┣ 📜product.schema.ts
 ┃ ┗ 📜user.schema.ts
 ┣ 📜prisma.ts                     # Prisma setup with NeonDB
 ┣ 📜uploadthing.ts                # Uploadthing setup
 ┗ 📜utils.ts                      # App utility functions
 📦prisma                          # Prisma Schemas
 ┣ 📂generated
 ┣ 📂migrations                    # Migrations
 ┣ 📂schema
 ┃ ┣ 📜cart.prisma
 ┃ ┣ 📜ERD.md
 ┃ ┣ 📜order.prisma
 ┃ ┣ 📜product.prisma
 ┃ ┗ 📜user.prisma
 ┣ 📜ERD.md
 ┣ 📜schema.prisma
 ┗ 📜seed.ts                       # Seed file for dev
```

## Core Features

1. User Authentication
2. Product Management
3. Shopping Cart
4. Checkout Process
5. Order Management
6. Admin Dashboard
7. Payment Integration
