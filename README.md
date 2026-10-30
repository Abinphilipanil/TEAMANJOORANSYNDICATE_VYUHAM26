# AF-03 — AI-Powered Career and Skill-Gap Analysis Agent

**AF-03 SkillGapper** is an AI-powered career intelligence, skill-gap analysis, and learning execution platform built for the Vyuham 2026 Hackathon. Rather than serving as a passive chatbot or generic video course library, AF-03 implements a data-driven **"Learn-Then-Prove"** loop aligned with real employer hiring requirements.

---

## 🌟 Key Features

1. **Career Explorer & Custom Roles**:
   - Explore verified tech career roles across domains (Web & Cloud, Data & AI, Cloud & Infrastructure, Security).
   - In-depth salary insights (entry, mid, senior INR) and market demand trends.
   - Dynamic custom career role support with real-time requirement synthesis.

2. **Career Profile & Market Signals**:
   - Categorized technical proficiencies, soft skills, and core engineering competencies.
   - Sample employer job postings with citations and timestamps.
   - Direct CTA: *"BUILD MY PERSONALIZED ROADMAP"*.

3. **Multi-Step Onboarding**:
   - Background input: Resume upload (PDF/DOCX), direct text description, LinkedIn URL, and GitHub profile URL.
   - Preferences: Learning pace (Fast / Moderate / Steady), weekly availability (hrs/wk), budget (INR), target completion period, and preferred formats.

4. **AI Agent Analysis Pipeline**:
   - **Stage A**: Profile extraction, normalization into canonical taxonomy, and confidence-weighted evidence.
   - **Stage B**: Job-market multi-posting aggregation and emerging skill detection.
   - **Stage C**: Explainable skill-gap matrix (Possessed, Partially Developed, Missing, Needs Verification) and deterministic role-readiness scoring.
   - **Stage D**: Time- and budget-constrained personalized roadmap generation with explicit learning rationales.

5. **Server-Side Controlled Learning Workspace**:
   - Generates physical server disk folders (`AF03_Workspace/<career>/<skill>/[Fundamentals, Advanced_Concepts, Learning_Resources, Projects]`).
   - Controlled backend tools for safe document downloading, custom subfolder creation, and metadata provenance tracking.
   - Sandboxed security with path-traversal prevention.

6. **Progress Tracking & Evidence Verification**:
   - Weekly checklist tied to roadmap skills and milestones.
   - Practical deliverable proof submissions (e.g. GitHub repos, PR links) that recalculate skill proficiency and role readiness live.
   - Persistent progress audit trail.

7. **Curated Career Opportunities**:
   - Filtered hackathons, product competitions, tech summits, and developer meetups matched to user's target career and verified skills.

8. **Automated 7-Day Inactivity Email Reminders**:
   - Scheduled job scanning candidate velocity.
   - Dispatches polite encouragement with roadmap links if inactive > 7 days.
   - Zero-config development mock adapter and production SMTP transport.

---

## 🏗️ Repository Architecture & Monorepo Structure

```text
skillgapper/
├── apps/
│   ├── api/                    # MEMBER 2, 3, 4: Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── agent/          # MEMBER 3: AI Agent Orchestrator & Gap Pipelines
│   │   │   ├── config/         # MEMBER 2: Environment Configuration
│   │   │   ├── controllers/    # MEMBER 2: REST Controllers
│   │   │   ├── integrations/
│   │   │   │   ├── github/     # MEMBER 4: GitHub Profile Enricher
│   │   │   │   ├── jobs/       # MEMBER 3: Job Market Multi-Posting Aggregator
│   │   │   │   └── resources/  # MEMBER 4: Resource Catalog & Safe Downloader
│   │   │   ├── jobs/           # MEMBER 4: 7-Day Inactivity Email Reminder Worker
│   │   │   ├── repositories/   # MEMBER 2: Persistent Storage Repositories
│   │   │   ├── routes/         # MEMBER 2: Express REST Routes
│   │   │   ├── services/       # MEMBER 2: Scoring & Progress Services
│   │   │   ├── tools/          # MEMBER 4: Safe Server Workspace Tooling
│   │   │   └── index.ts        # MEMBER 2: Express Server Entrypoint
│   │   └── test/               # Node test runner suite
│   └── web/                    # MEMBER 1: Vite + React 18 + Tailwind CSS
│       ├── src/
│       │   ├── api/            # Typed Frontend API Client
│       │   ├── components/     # UI Components (Gauges, Badges, FolderTree, etc.)
│       │   ├── context/        # React State Context (AppContext)
│       │   ├── layouts/        # PublicLayout & DashboardLayout (Sidebar/Topbar)
│       │   └── pages/          # 8 Core Pages
├── packages/
│   └── contracts/              # SHARED BOUNDARY: Centralized Data Models & DTOs
├── docs/                       # Architectural & Team Governance Documentation
│   ├── ARCHITECTURE.md         # System Architecture & Data Flow
│   ├── CONTRACTS.md            # Shared Data Contract Specification
│   ├── TEAM_OWNERSHIP.md       # 4-Member Ownership Boundaries
│   └── API_ENDPOINTS.md        # Complete REST API Directory
├── AF03_Workspace/             # Server Disk Workspace Root
└── package.json                # Root npm workspace manifest
```

---

## 👥 Four-Member Development Ownership

| Member | Primary Responsibility | Directory Boundaries |
| :--- | :--- | :--- |
| **MEMBER 1** | Frontend UI/UX, Design System, Responsive Pages | `apps/web/**` |
| **MEMBER 2** | REST API, Repositories, Database, Readiness Scoring | `apps/api/src/routes/**`<br>`apps/api/src/controllers/**`<br>`apps/api/src/repositories/**`<br>`apps/api/src/services/**`<br>`apps/api/src/config/**` |
| **MEMBER 3** | AI Agent Pipeline, Skill Extraction & Job Market Intel | `apps/api/src/agent/**`<br>`apps/api/src/integrations/jobs/**` |
| **MEMBER 4** | Server Storage Tools, Safe Downloader, GitHub & Email Cron | `apps/api/src/tools/**`<br>`apps/api/src/integrations/resources/**`<br>`apps/api/src/integrations/github/**`<br>`apps/api/src/jobs/**` |
| **SHARED** | Centralized Data Contracts | `packages/contracts/**` |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20+ (tested on Node v24)
- **npm**: v10+ (tested on npm 11)

### 1. Install Monorepo Dependencies
```bash
npm install
```

### 2. Build Shared Contracts & Packages
```bash
npm run build
```

### 3. Run Backend API Server
In terminal 1:
```bash
npm run dev:api
```
Server runs on: `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)

### 4. Run Frontend Web Application
In terminal 2:
```bash
npm run dev:web
```
Application opens on: `http://localhost:5173`

### 5. Run Automated Tests
```bash
npm test
```

---

## 📡 API Endpoints Overview

- `GET /api/careers`: List and search available career roles.
- `GET /api/careers/:idOrSlug`: Retrieve detailed career profile.
- `POST /api/careers/custom`: Create custom career path.
- `POST /api/agent/analyze`: Full 4-stage agent analysis pipeline.
- `GET /api/roadmaps/:id`: Fetch roadmap and current readiness score.
- `GET /api/workspace/:roadmapId`: Retrieve server filesystem tree.
- `POST /api/workspace/sync`: Synchronize physical directories on server disk.
- `POST /api/workspace/download-resource`: Controlled safe document download.
- `POST /api/progress/update`: Mark checklist item and recalculate readiness.
- `GET /api/opportunities`: Matched hackathons, competitions, conferences.
- `POST /api/jobs/trigger-reminders`: Execute 7-day inactivity email scan.

*For complete API schemas and DTOs, see [docs/API_ENDPOINTS.md](docs/API_ENDPOINTS.md).*

