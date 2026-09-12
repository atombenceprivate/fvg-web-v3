# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Vercel deployment configuration.
- Expanded content management controls for projects and site settings.

### Changed

- Moved local demo credentials and the fallback session secret out of source code into environment configuration.
- Synchronize the local demo account password with its local environment configuration on startup.
- Updated the primary FirstVideos Group brand colour to `#EB0044`.
- Applied shared language and light/dark preferences to the admin sign-in and dashboard views.
- Aligned all admin surfaces with the shared FirstVideos Group colour tokens.
- Removed remaining legacy lime accents from the admin dashboard.
- Replaced the site-wide type system with Bodoni Moda.
- Updated the site-wide type system to Kanit.

## [0.1.0] - 2026-09-12

### Added

- React and Vite foundation for the FirstVideos Group website.
- Responsive one-page studio website in English and Hungarian.
- Persistent light and dark theme preference.
- Font Awesome icons and transparent black/white SVG logo assets.
- Dedicated `/admin` dashboard route.
- First-installation superadmin account setup and password-based sign-in.
- JWT-based, time-limited admin sessions and bcrypt password hashing.
- Turso/libSQL database client with automatic local file database fallback.
- Local-only demo superadmin account and one-click credential fill action.
- Environment variable template and project documentation.
