# Kelo Care website

Marketing site, information pages and the agency portal for Kelo Care.

- Next.js 16 (static export), Tailwind utilities for the agency portal only
- `/` home, `/get-started`, `/privacy`, `/terms`, `/accessibility`, `/delete-account`
- `/for-agencies` agency sign-in (email or Google) and `/for-agencies/dashboard`
- `/classic` is the previous design, kept as a backup

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static output in ./out
```

Environment variables (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
