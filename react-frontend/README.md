# DevVault React Frontend

React/Vite frontend for DevVault. This version connects the existing UI to the Express API and MongoDB-backed endpoints.

## Features
- Real registration and login through the backend API
- JWT-based authenticated API requests
- Create, read, update, and delete for notes, snippets, resources, bug logs, and projects
- API-backed global search and dashboard counts
- Existing React UI and styling retained

## Run locally

Ensure the backend is running at `http://localhost:5000` and `backend/.env` has:

```env
CLIENT_ORIGIN=http://localhost:5173
```

Then run:

```bash
cd react-frontend
cp .env.example .env
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## API configuration

The default API base URL is `http://localhost:5000/api`. Set `VITE_API_URL` to your full API base URL (including `/api`) when deploying. The backend's `CLIENT_ORIGIN` must match the frontend origin. Never use `localhost` as the production API URL.

## Data model notes

- Bug journal fields align with the backend: `error`, `cause`, `solution`, `technology`, and optional `resourceLink`.
- Project technologies are saved as `tags`, because the current backend schema does not define a `stack` field.
- Browser localStorage stores only the session token and basic account profile; records are managed through the API.

Keep secrets in backend `.env` only. Do not commit `.env` files.
