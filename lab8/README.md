# ShopNest (NestJS backend + original index.html)

    npm install
    npm run start:dev

- Store page:  http://localhost:3000/        (public/index.html, unchanged)
- API:         http://localhost:3000/api/...

Optional: JWT_SECRET=your-secret npm run start:dev
Data is in memory (demo) and resets on restart.
Protected routes need:  Authorization: Bearer <token>

Note: the original index.html still uses its own in-browser data.
It is served by Nest but does not call /api yet.
