# DevVault

A Developer Knowledge Management Platform — your personal second brain for development.

## Author

| Roll No. | Name | GitHub Username |
|---|---|---|
| 24ESKCS110 | Devesh Kirad | [Deveshkirad](https://github.com/Deveshkirad) |

## About

DevVault is a Developer Knowledge Management Platform that helps developers store, organize, search, and reuse their technical knowledge in one centralized place.

It provides a workspace for managing:

- **Notes** — Save technical knowledge and learning notes.
- **Code Snippets** — Store reusable code.
- **Learning Resources** — Organize useful links and study materials.
- **Bug Solutions** — Keep track of bugs and their solutions.
- **Projects** — Maintain project-related information.

## Features

- User registration and login.
- Personal workspace for managing developer knowledge.
- Integration between the React frontend and backend API.
- Persistent data storage using MongoDB.
- Responsive web interface.
- Production deployment on Render.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| API | REST API |
| Version Control | Git and GitHub |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Deployment | Render |

## Architecture

DevVault follows a client-server architecture.

```text
User
  |
  v
React Frontend
  |
  v
REST API
  |
  v
Node.js / Express Backend
  |
  v
MongoDB Database
```

The frontend communicates with the backend through REST API endpoints. The backend handles application requests and database operations.

## Live URL

Live URL: https://devault-frontend.onrender.com/

**Backend API:** [https://devvault-api-hsp3.onrender.com/api](https://devvault-api-hsp3.onrender.com/api)

**Health Check:** [https://devvault-api-hsp3.onrender.com/api/health](https://devvault-api-hsp3.onrender.com/api/health)

- **Status:** Deployed
- **Hosting Platform:** Render
- **Frontend and Backend:** Separately deployed services

*Note: Free hosting services may take time to respond after periods of inactivity.*

## CI/CD and DevOps

The project uses GitHub Actions to automate code checks, frontend build and test tasks, and Docker image publishing according to the workflow configuration.

Docker is used to containerize the frontend. Render hosts the live frontend and backend services.

## Repository

[View DevVault on GitHub](https://github.com/skit-devops-2026/devops-24ESKCS110)

## Project Status

DevVault is deployed and operational. The frontend-to-backend integration, user authentication, and note persistence have been tested.

Future improvements may include enhanced validation, error handling, search capabilities, and additional testing of all workspace modules.

---

*Developed by Devesh Kirad — 24ESKCS110*