# DevVault React Frontend

This folder is the React/Vite frontend conversion of the existing DevVault HTML/CSS/JavaScript frontend. It is intended to live directly inside your existing `devops-24ESKCS110` project root as `react-frontend/`.

## Pages converted
- Landing page
- Login and registration (demo-only local profile; no real authentication)
- Dashboard
- Notes
- Code snippets
- Resources
- Bug journal
- Projects
- Global search
- Profile/settings

## Run locally
From the repository root:

```bash
cd react-frontend
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

To test a production build:

```bash
npm run build
```

## Notes
- This is frontend-only. It does not create or require a backend or database.
- The original `frontend/` folder and all root DevOps files are intentionally untouched. Keep them until you have checked the React version.
- The UI uses React components, React Router, Lucide icons, Tailwind utility classes, and browser `localStorage` for demo data.
- Authentication is simulated only. Do not use real credentials.
- The initial sample data follows the existing HTML/JS frontend content; new and edited items persist in the current browser.
