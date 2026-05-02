# Blazing Barbecue - Food Ordering Web Application

A production-ready, mobile-first food ordering web application for Blazing Barbecue BBQ restaurant.

## Features

- **User Authentication**: WhatsApp OTP-style login (simulated)
- **Menu Browsing**: Card-based food grid with categories
- **Shopping Cart**: Right-side floating cart panel
- **Order Management**: Place orders, track status in real-time
- **Payment**: Razorpay integration (Test Mode UPI)
- **Admin Dashboard**: Live order management, status updates
- **PDF Invoice**: Downloadable invoices for orders
- **Real-time Updates**: Socket.io for live order tracking

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL, Prisma ORM
- **Real-time**: Socket.io
- **Payments**: Razorpay (Test Mode)
- **State**: Zustand
- **Deployment**: Docker, Docker Compose

## Project Structure

```
blazing_bbq/
├── apps/
│   ├── client/          # Next.js frontend
│   └── server/          # Express.js API
├── shared/types/        # Shared TypeScript types
├── prisma/              # Database schema & seed
├── docker/               # Docker configuration
├── docker-compose.yml
└── package.json
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or use Docker)
- npm or yarn

### 1. Clone and Install

```bash
# Clone the repository
cd blazing_bbq

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values
# DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/blazing_bbq"
# JWT_SECRET="your-secret-key-min-32-chars"
# RAZORPAY_KEY_ID="rzp_test_XXXXXXXXXXXXXX"
# RAZORPAY_KEY_SECRET="XXXXXXXXXXXXXXXXXXXX"
```

### 3. Database Setup

```bash
# Push schema to database
npm run prisma:push

# Seed with sample data
npm run prisma:seed
```

Local development uses SQLite via `prisma/schema.sqlite.prisma`.
Production uses Postgres via `prisma/schema.prisma`:

```bash
# Generate client for production schema
npm run prisma:generate:prod

# Apply production migrations
npm run prisma:migrate:prod

# (Optional) Push production schema without migrations
npm run prisma:push:prod
```

### 4. Start Development Servers

```bash
# Start both client and server
npm run dev

# Or start individually:
npm run dev:server  # Backend on http://localhost:4000
npm run dev:client  # Frontend on http://localhost:3000
```

### 5. Access Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **Admin**: http://localhost:3000/admin (login with +919321836106)

## Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build images
docker build -t blazing-bbq-server -f docker/server.Dockerfile .
docker build -t blazing-bbq-client -f docker/client.Dockerfile .
```

## Razorpay Setup (Test Mode)

1. Create account at https://dashboard.razorpay.com
2. Get API Key ID and Secret from Settings > API Keys
3. Add to `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
   RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXX
   ```
4. For UPI test: Use `success@razorpay` as UPI ID

## Default Login

- **Phone**: +919321836106
- **OTP**: 1234 (development mode shows OTP in console)

## Admin Access

After seeding, admin user is created:
- **Phone**: +919321836106
- **Role**: ADMIN

## API Endpoints

### Auth
- `POST /api/v1/auth/send-otp` - Send OTP
- `POST /api/v1/auth/verify-otp` - Verify OTP

### Menu
- `GET /api/v1/menu` - Get all categories and items
- `GET /api/v1/menu/categories` - Get categories only

### Cart (Authenticated)
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item
- `PATCH /api/v1/cart/items/:id` - Update quantity
- `DELETE /api/v1/cart/items/:id` - Remove item
- `POST /api/v1/cart/apply-coupon` - Apply coupon

### Orders (Authenticated)
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/:id` - Get order details

### Payment (Authenticated)
- `POST /api/v1/payment/create-order` - Create Razorpay order
- `POST /api/v1/webhook` - Razorpay webhook

### Admin (Admin only)
- `GET /api/v1/admin/orders` - Get all orders
- `PATCH /api/v1/admin/orders/:id` - Update order status
- `GET /api/v1/admin/revenue` - Revenue stats

## Socket.io Events

### Server to Client
- `order:created` - New order received
- `order:statusUpdate` - Order status changed
- `order:completed` - Order completed
- `notification` - General notifications

### Client to Server
- `join:order` - Join order tracking room
- `leave:order` - Leave order tracking room
- `join:admin` - Join admin room for live orders

## Available Coupons (Seeded)

| Code | Discount |
|------|----------|
| WELCOME20 | 20% off (max Rs.100) |
| BBQ100 | Rs.100 off on orders above Rs.499 |

## Production Checklist

1. Set `NODE_ENV=production`
2. Configure proper JWT_SECRET
3. Add real Razorpay keys
4. Setup PostgreSQL with SSL
5. Configure reverse proxy (nginx)
6. Enable HTTPS
7. Setup webhook URL in Razorpay dashboard

## Contact

- **Primary**: +91 9321836106
- **Thane**: +91 8369434959
- **Email**: blazingbarbecue@gmail.com
- **FSSAI**: 21520046000143

## License

Private - All rights reserved
