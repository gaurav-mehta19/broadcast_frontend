# Content Broadcasting System — Frontend

React + TypeScript + Vite frontend for the Content Broadcasting System. Teachers upload educational content, Principals approve or reject it, and approved content is broadcast live on public screens via a rotation algorithm.

## Live Demo

| | |
|---|---|
| **Frontend** | `https://exquisite-crepe-0a0919.netlify.app` |
| **Backend API** | `https://content-broadcast-backend.onrender.com/api/v1` |
| **Swagger Docs** | `https://content-broadcast-backend.onrender.com/api/v1/docs` |

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **React Router v7** — client-side routing
- **TanStack Query** — server state & caching
- **Axios** — HTTP client
- **shadcn/ui** + **Tailwind CSS** — UI components
- **React Hook Form** + **Zod** — form validation
- **Sonner** — toast notifications

## Roles

| Role | Can do |
|------|--------|
| **Teacher** | Upload content, view own submissions, manage rotation schedule |
| **Principal** | Approve / reject pending content, view all content |
| **Public** | View live broadcast at `/live/:teacherId` (no login required) |

## Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy and fill env vars
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# 3. Start dev server
npm run dev
```

App runs at: `http://localhost:5173`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL (include `/api/v1`) | `http://localhost:5001/api/v1` |
| `VITE_BACKEND_URL` | Backend public URL | `http://localhost:5001` |

## Demo Credentials

Use the quick-login buttons on the login page, or sign in manually:

| Role | Email | Password |
|------|-------|----------|
| Principal | principal@school.com | Principal@123 |
| Teacher | teacher1@school.com | Teacher@123 |

## Key Routes

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/register` | Create account |
| `/teacher/dashboard` | Teacher home |
| `/teacher/upload` | Upload new content |
| `/teacher/content` | Manage all uploads |
| `/teacher/schedule` | Manage rotation schedule |
| `/principal/dashboard` | Principal home |
| `/principal/pending` | Review pending content |
| `/principal/all` | View all content |
| `/live/:teacherId` | Public broadcast screen (no auth) |
