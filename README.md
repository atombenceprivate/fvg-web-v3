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

## Getting started

```bash
npm install
npm run dev
```

The public website is available at `http://localhost:5173` and the administration interface at `http://localhost:5173/admin`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
