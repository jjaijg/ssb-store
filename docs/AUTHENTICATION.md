# Authentication

## Implementation
- Uses NextAuth.js for authentication
- JWT-based sessions
- Role-based access control (USER/ADMIN)

## Routes
- `/signin` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password recovery

## Protected Routes
```typescript
// Middleware protection
export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/checkout/:path*"
  ]
}
```