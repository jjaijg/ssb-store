# Deployment Guide

## Prerequisites
1. Node.js 18+
2. PostgreSQL database
3. Razorpay account

## Environment Setup
```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

## Build Process
```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

## Production Start
```bash
npm start
```