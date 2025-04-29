# Breet Shopping cart API

A scalable shopping cart API that handles concurrent operations efficiently using Node.js, MongoDB, Redis, Prisma, and TypeScript.

## Features

- Product inventory management
- Cart operations (add, update, remove)
- Checkout with transaction support
- Distributed locking for concurrency control
- Redis caching for performance optimization
- Repository pattern for clean architecture

## Tech Stack

- Node.js
- TypeScript
- MongoDB (with Prisma ORM)
- Redis (for caching and locking)
- Express

## Project Structure

The project follows a clean architecture approach with the repository pattern:

- **controllers/**: Handle HTTP requests and responses
- **services/**: Implement business logic
- **repositories/**: Data access layer
- **middlewares/**: Express middlewares
- **utils/**: Utility functions and helpers
- **routes/**: API endpoints
- **config/**: Configuration settings

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="mongodb+srv://<db_username>:<db_password>@<db_url>/<collection_name>?retryWrites=true&w=majority&appName=<collection_name>" //use a real mongodb database

   REDIS_URL="redis://localhost:6379"

   PORT=3000
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Push schema to database:
   ```bash
   npm run prisma:push
   ```
6. Seed the database:
   ```bash
   npm run seed
   ```
7. Start the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## API Endpoints

### Users
- `POST /api/user`: Create a new user


### Products

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product

### Cart & Checkout

- `GET /api/cart`: Get current user's cart
- `POST /api/cart/items`: Add item to cart
- `PUT /api/cart/items/:productId`: Update cart item quantity
- `DELETE /api/cart/items/:productId`: Remove item from cart
- `DELETE /api/cart`: Clear cart
- `POST /api/cart/checkout`: Process checkout
- `GET /api/cart/orders`: Get user's orders
- `GET /api/cart/orders/:id`: Get a specific order

## Authentication

For test purposes, this project uses a simplified authentication mechanism. 
In a production environment,  we will implement proper JWT or OAuth authentication.

When making requests to authenticated endpoints, include the following header:
```
X-User-Email: <user_email>
```

## Concurrency Control

The system uses Redis-based distributed locks to handle concurrent operations:

- Product stock checks are performed atomically
- Cart updates are synchronized
- Checkout process uses transactions with locks

This ensures that even under high load, the system maintains data consistency 
and prevents issues like overselling products.

## Caching Strategy

Redis caching is implemented for:

- Product listings
- Individual product details

Cache invalidation occurs when:
- Products are updated
- Stock levels change
- Orders are placed

## Transaction Support

The checkout process uses MongoDB transactions to ensure atomicity:

1. Verify stock availability
2. Create order record
3. Update product stock levels
4. Clear cart
5. Release locks

If any step fails, the entire transaction is rolled back.
