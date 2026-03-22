This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="mysql://username:password@localhost:3306/royalcargo"

# JWT Secret (change this in production!)
NEXT_PUBLIC_JWT_SECRET="your-super-secret-jwt-key-here"

# Node Environment
NODE_ENV="development"
```

## Database Setup

1. Make sure you have MySQL installed and running
2. Create a database named `royalcargo`
3. Run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Authentication

The application uses JWT-based authentication with HTTP-only cookies. The authentication flow includes:

- User registration at `/register`
- User login at `/login`
- Protected routes that require authentication
- Automatic token verification on API calls

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/adresses` - Get all addresses (protected)
- `PATCH /api/adresses/[id]` - Update address (protected)
- `DELETE /api/adresses/[id]` - Delete address (protected)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
