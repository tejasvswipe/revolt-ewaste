# Vercel deployment

Copy `vercel.json` into the root of the repository, at the same level as `package.json`. Import the repository into Vercel and keep the project root set to the repository root.

The configuration builds the Vite frontend into `dist/public` and rewrites client-side routes such as `/contact` to `index.html`.

Add these environment variables in Vercel Project Settings for the frontend and server environments as appropriate:

- `SUPABASE_URL`: the Supabase project URL.
- `SUPABASE_TOKEN`: the private server-side Supabase token. Never expose this value through a `VITE_` variable.
- `VITE_APP_TITLE`: `ReVolt AI — The Evidence Layer for E-Waste`.

The current `vercel.json` is safe for serving the React frontend and client-side routes. The project's Express/tRPC backend is designed for the managed full-stack hosting environment and is not automatically converted into a Vercel serverless function by this file. For production Contact Us persistence, File Storage uploads, and authentication, use the managed full-stack deployment or add a dedicated Vercel serverless adapter for the backend entrypoint before switching those routes to Vercel.

After deploying, verify `/`, `/contact`, and `/api/trpc` separately. A working frontend does not by itself prove that the backend routes are connected.
