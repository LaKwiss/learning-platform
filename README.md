# Learning Platform v0.1.0

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Features

*   **Framework**: [Next.js](https://nextjs.org/) 15 (with Turbopack)
*   **UI**: [React](https://react.dev/) 19 & [Tailwind CSS](https://tailwindcss.com/)
*   **Authentication**: [Clerk](https://clerk.com/) for user management and authentication.
*   **TypeScript**: Strict type checking.

## ⚙️ Configuration

1.  **Environment Variables**: Create a `.env.local` file at the root of the project and add your Clerk credentials:

    ```
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
    CLERK_SECRET_KEY=your_secret_key
    ```

2.  **Dependencies**: Install the dependencies with:
    ```bash
    npm install
    ```

## 📜 Scripts

*   `npm run dev`: Starts the development server with Turbopack.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts a production server.
*   `npm run lint`: Runs the linter.
