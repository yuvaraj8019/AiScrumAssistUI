# Scrum AI Assistant - Frontend

Production-ready React dashboard for Scrum AI Assistant backend.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching & caching
- **React Hook Form** + **Zod** - Form validation
- **Axios** - API client
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default configuration points to `http://localhost:8080/api` (your Spring Boot backend).

### 3. Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Features

### Dashboard
- View all meetings in a responsive table
- Real-time status updates
- Quick navigation to meeting details

### Create Meeting
- Form validation with Zod
- Support for all ceremony types (Standup, Planning, Review, Retrospective)
- Jira/Azure DevOps integration selection

### Meeting Details
- Upload and save transcripts
- Process transcripts with AI (Gemini)
- **Auto-polling**: Status updates every 2 seconds during processing
- View extracted tasks with Jira links
- Real-time status badges

## API Integration

The frontend automatically proxies `/api` requests to `http://localhost:8080` in development mode (configured in `vite.config.ts`).

### Endpoints Used:
- `GET /api/meetings` - List meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting details
- `POST /api/meetings/:id/transcript` - Save transcript
- `POST /api/meetings/:id/process` - Trigger AI processing
- `GET /api/meetings/:id/tasks` - Get created tasks

## Project Structure

```
src/
├── api/              # API client & endpoints
├── components/
│   ├── layout/      # Sidebar, Layout
│   └── ui/          # Reusable UI components (Button, Card, Input, etc.)
├── pages/           # Route pages (Dashboard, CreateMeeting, MeetingDetails)
├── types/           # TypeScript interfaces
└── utils/           # Helper functions (cn for classnames)
```

## Notes

- The UI uses a **dark theme** by default (shadcn-inspired)
- All forms include **client-side validation**
- **Polling** automatically stops when processing completes or fails
- Jira links are auto-generated for completed tasks
