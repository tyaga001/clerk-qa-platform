

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/tyaga001/clerk-qa-platform
```

2. Install the dependencies

```bash
npm install
```

3. Set up a Clerk application and Neon database. Then create a Create a .env.local file in the root directory of the project and add the following keys

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEON_DATABASE_URL=
```

4. Initialize the database

```bash
npx drizzle-kit push 
```

5. Start the Next.js development server

```bash
npm run dev
```
