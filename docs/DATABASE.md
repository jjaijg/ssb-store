# Database Schema

## Core Models

### User
- Authentication
- Profile information
- Address management

### Product
- Product details
- Variants
- Stock management

### Order
- Order processing
- Payment tracking
- Status management

## Relationships
```prisma
model Order {
  id String @id @default(cuid())
  user User @relation(fields: [userId], references: [id])
  items OrderItem[]
}

model Product {
  id String @id @default(cuid())
  variants ProductVariant[]
}
```