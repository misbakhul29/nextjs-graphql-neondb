This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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


# pengingat cara membuat project :
## buat proyek dengan nextjs
```bash
npx create-next-app@latest blog-app
cd blog-app
npm install @apollo/client @prisma/client apollo-server-micro graphql prisma
```
## Buat file prisma/schema.prisma
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
## Setup .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blogdb"
```
## Jalankan migrate
```bash
npx prisma migrate dev --name init
npx prisma generate
```

