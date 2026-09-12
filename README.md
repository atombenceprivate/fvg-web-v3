# FirstVideos Group

Kétnyelvű React one-page produkciós stúdió weboldal, adatbázis-alapú admin felülettel.

## Helyi fejlesztés

```bash
npm install
npm run dev
```

A weboldal a Vite által kiírt címen, az admin a `/admin` útvonalon érhető el. Az első megnyitáskor az admin felület bekéri a superadmin fiók adatait.

Ha nincs `TURSO_DATABASE_URL`, az alkalmazás automatikusan a `data/fvg.db` helyi libSQL adatbázist használja. A beállítási minta a `.env.example` fájlban található.
