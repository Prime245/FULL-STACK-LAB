# ShopNest (NestJS + SQLite, persistent)

    npm install
    npm run start:dev

- Store page:  http://localhost:3000/        (public/index.html, original, unchanged)
- API:         http://localhost:3000/api/...
- Database:    data/shopnest.sqlite  (created automatically; survives restarts)

Env vars (optional): JWT_SECRET, PORT, DB_PATH
To reset all data: stop the server and delete the data/ folder.
Protected routes need:  Authorization: Bearer <token>

Note: index.html still uses its own in-browser data; it does not call /api yet.
