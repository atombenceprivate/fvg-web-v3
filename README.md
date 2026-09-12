# FirstVideos Group Website

The official one-page website and administration interface for FirstVideos Group, built with React and Vite.

## Features

- Responsive, bilingual public website (English and Hungarian)
- Light and dark colour modes
- Font Awesome icon set and SVG logo assets
- Dedicated `/admin` route with first-installation superadmin setup
- Password hashing and time-limited admin sessions
- Turso/libSQL persistence, with an automatic local SQLite-compatible fallback
- Local demo administrator when no Turso connection is configured

## Requirements

- Node.js 20 or newer
- npm

## Getting started

Install dependencies and start the local website and admin API:

```bash
npm install
npm run dev
```

The public website is available at `http://localhost:5173` and the administration interface at `http://localhost:5173/admin`.

## Local demo access

When `TURSO_DATABASE_URL` is not set, the application can create a local database at `data/fvg.db` and provision a demo superadmin account. Set `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` in an untracked local `.env` file; the admin sign-in page will then offer to fill those local credentials automatically. Demo access is disabled in production mode.

## Environment configuration

Copy `.env.example` to `.env` and set production values before deployment.

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token
AUTH_SECRET=a-long-random-secret
DEMO_ADMIN_EMAIL=local-admin@example.test
DEMO_ADMIN_PASSWORD=local-development-password
```

Without `TURSO_DATABASE_URL`, libSQL uses the local database URL specified by `LOCAL_DATABASE_URL`, or `file:./data/fvg.db` by default.

## Build

Create the production client build with:

```bash
npm run build
```

## Project structure

```text
src/          React application and styles
server/       Express admin API and libSQL database layer
public/       Public SVG logo assets
```

## Security notes

- Set a unique `AUTH_SECRET` for every production environment.
- Configure Turso credentials in the deployment platform's protected environment variables.
- Replace the demo login flow with managed accounts before making the admin interface publicly available.

=======
## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
