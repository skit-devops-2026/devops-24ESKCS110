# DevVault Backend

A standalone REST API for the current DevVault React project. Built with Node.js, Express, MongoDB, Mongoose, JWT and bcrypt.

## Included
- MongoDB connection and health endpoint
- Register, login and current-user endpoints
- JWT-protected CRUD for notes, resources, code snippets, bug logs and projects
- Ownership checks: users can only read, update or delete their own records
- Search, favorite/archive filters, project filter and pagination
- Request validation, Helmet, CORS and rate limiting

## Requirements
- Node.js 20 or newer
- MongoDB Community Server running locally OR a MongoDB Atlas connection string
- npm

## 1. Install and configure

Extract this ZIP into the root of the existing repository, so the structure looks like:

```text
devops-24ESKCS110/
├── react-frontend/
├── docs/
├── docker-compose.yml
└── backend/
    ├── package.json
    ├── .env
    └── src/
```

Rename the extracted folder from `devvault-backend` to `backend` (or copy its contents into a new `backend/` folder). From the repository root:

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`. For local MongoDB, use:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/devvault
JWT_SECRET=put_a_random_secret_of_at_least_32_characters_here
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Generate a secret on Linux/macOS with:

```bash
openssl rand -hex 32
```

Paste the output as `JWT_SECRET`. Never commit `.env`.

### MongoDB options
- **Local:** install/start MongoDB Community Server, then keep the local `MONGODB_URI` above.
- **Atlas:** create a database/user in MongoDB Atlas, allow your current IP in Network Access, and paste the Atlas connection string into `MONGODB_URI`. Do not share the URI publicly.

## 2. Start the API

```bash
npm run dev
```

Expected startup output includes `MongoDB connected: devvault` and `DevVault API running at http://localhost:5000`.

Open `http://localhost:5000/api/health`. Expected JSON:

```json
{
  "success": true,
  "service": "devvault-api",
  "database": "connected",
  "timestamp": "..."
}
```

If MongoDB is unavailable, the server exits with a connection error rather than pretending the database is connected.

## 3. Test CRUD (using curl)

Keep the API running. Open a second terminal from any directory.

### Register and save the token

```bash
curl -s -X POST http://localhost:5000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"DevVault Tester","email":"tester@example.com","password":"TestPass123!"}'
```

Copy the `token` from the response and set it in your shell:

```bash
export TOKEN='PASTE_TOKEN_HERE'
```

If the account already exists, call `/api/auth/login` instead:

```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"tester@example.com","password":"TestPass123!"}'
```

### Create (C)

```bash
curl -s -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"MongoDB basics","content":"Documents, collections and indexes","tags":["MongoDB","Database"]}'
```

Copy the returned `data._id` as `ITEM_ID`.

### Read (R)

List your notes:

```bash
curl -s http://localhost:5000/api/notes -H "Authorization: Bearer $TOKEN"
```

Get one note:

```bash
curl -s http://localhost:5000/api/notes/ITEM_ID -H "Authorization: Bearer $TOKEN"
```

Search and filters:

```bash
curl -s 'http://localhost:5000/api/notes?q=MongoDB&favorite=false&archived=false' \
  -H "Authorization: Bearer $TOKEN"
```

### Update (U)

```bash
curl -s -X PATCH http://localhost:5000/api/notes/ITEM_ID \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"title":"MongoDB indexing","favorite":true}'
```

### Delete (D)

```bash
curl -s -X DELETE http://localhost:5000/api/notes/ITEM_ID \
  -H "Authorization: Bearer $TOKEN"
```

Replace `ITEM_ID` with the actual MongoDB ObjectId returned by Create. A user's token is required for all knowledge-item endpoints.

## API reference

### Authentication
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register; returns user and JWT |
| POST | `/api/auth/login` | Login; returns user and JWT |
| GET | `/api/auth/me` | Current authenticated user |

### CRUD endpoints
All require `Authorization: Bearer <token>`.

| Type | Endpoint |
|---|---|
| Notes | `/api/notes` |
| Resources | `/api/resources` |
| Code snippets | `/api/snippets` |
| Bug logs | `/api/bugs` |
| Projects | `/api/projects` |

For each type:
- `POST /api/{type}` — create
- `GET /api/{type}` — list (default 50 records; max 100 per page)
- `GET /api/{type}/:id` — read one
- `PATCH /api/{type}/:id` — update supplied fields
- `DELETE /api/{type}/:id` — delete

List query parameters: `q`, `favorite=true|false`, `archived=true|false`, `projectId`, `page`, `limit`.

### Required record fields
- `notes`: `title`, `content`
- `resources`: `title`, `type`, `url`
- `snippets`: `title`, `language`, `code`
- `bugs`: `title`, `error`, `cause`, `solution`, `technology`
- `projects`: `title`; `status` defaults to `Planned`

Common optional fields include `projectId`, `tags`, `favorite` and `archived`.

## 4. Connect the existing frontend (next integration step)

The API runs separately from the current static frontend. For local frontend development:

1. In `backend/.env`, set `CLIENT_ORIGIN=http://localhost:5173`.
2. Terminal 1: start MongoDB, then run the backend with `cd backend && npm run dev`.
3. Terminal 2: run the frontend with `cd react-frontend && npm install && npm run dev`.
4. Frontend API calls should use `http://localhost:5000/api` and attach the token:
   `Authorization: Bearer <token>`.

The current `react-frontend/src/data.js` uses `localStorage` and seed/demo records. This backend does **not** automatically replace that frontend behavior. The frontend's login and collection pages need to be updated to call these endpoints before the deployed UI uses database-backed data. The backend CRUD itself can be tested immediately with curl or Postman.

## 5. Notes
- Do not commit `.env` or real credentials.
- JWT auth is suitable as an MVP foundation; production deployment should use HTTPS, strong secrets, careful CORS settings and a managed database.
- `Folders` are in the PRD but are not specified in `docs/Database.md`; this starter does not implement a separate Folder collection.
