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
- Redesigned the admin sidebar with icon navigation, collapse controls, a corrected SVG logo treatment, and a glowing brand-colour edge.
- Added branded hover glow feedback to admin navigation and dashboard cards.
- Corrected admin sidebar hover contrast across light and dark themes.
- Moved the public-site and sign-out controls to the bottom of the admin sidebar.
- Added settings navigation, branded information toasts, and a custom sign-out confirmation modal.
- Added an admin dashboard overview with quick-access status cards.
- Added a signed-in user menu to the bottom of the admin sidebar.
- Fixed the admin content editor header inheriting public-site layout styles.
- Restored independent language and theme controls to the admin header.
- Enlarged admin header controls and added visual icons to dashboard cards.
- Restored a unified signed-in user panel and normalized sidebar navigation sizing.
- Restored the branded hover light bar for sidebar navigation.
- Grouped the site-content entry beneath the Settings navigation area.
- Consolidated the admin account controls into a single bottom user menu.
- Removed the redundant sidebar superadmin label.
- Replaced the unavailable dashboard icon with a supported Font Awesome icon.
- Corrected the admin SVG logo contrast in dark mode.
- Improved dark-mode contrast for admin navigation and action buttons.
- Added animated hover feedback to admin navigation items.
- Replaced full-menu hover glow with a focused left-side brand light bar.
- Added a translucent, brand-colour glass treatment to the admin sidebar.
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
