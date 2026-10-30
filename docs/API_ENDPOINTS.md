# AF-03 — REST API Specification & Endpoint Directory

All endpoints are hosted on the backend server (default `http://localhost:5000/api`).

---

### 1. Careers & Roles (`/api/careers`)

| Method | Endpoint | Description | Query / Body Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/careers` | List available career roles | `domain`, `search` | `CareerRole[]` |
| `GET` | `/api/careers/:idOrSlug` | Get detailed career profile | - | `CareerRole` |
| `POST` | `/api/careers/custom` | Submit custom career role | `{ title, domain, description }` | `CareerRole` |

---

### 2. Analysis & Agent Orchestration (`/api/agent`)

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/agent/analyze` | Run full 4-stage agent analysis pipeline | `AnalyzeCareerRequest` (multipart or JSON) | `AnalyzeCareerResponse` |
| `POST` | `/api/agent/extract-profile` | Stage A: Profile & Skill extraction | `{ profileText, resumeFile }` | `{ skills: SkillEvidence[] }` |
| `GET` | `/api/agent/market-signals` | Stage B: Market intelligence for role | `roleSlug` query | `{ jobPostings: JobPosting[] }` |

---

### 3. Roadmaps & Personalized Dashboard (`/api/roadmaps`)

| Method | Endpoint | Description | Body / Query | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/roadmaps/:id` | Fetch roadmap and current readiness | - | `Roadmap` |
| `GET` | `/api/roadmaps/user/:userId` | Get roadmaps for a user | - | `Roadmap[]` |

---

### 4. Learning Workspace & Safe Filesystem (`/api/workspace`)

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/workspace/:roadmapId` | Fetch tree structure of server workspace | - | `LearningWorkspace` |
| `POST` | `/api/workspace/sync` | Create actual folders on server disk | `CreateWorkspaceRequest` | `CreateWorkspaceResponse` |
| `POST` | `/api/workspace/download-resource` | Controlled resource document download | `DownloadResourceRequest` | `DownloadResourceResponse` |
| `POST` | `/api/workspace/custom-folder` | Create custom subfolder in workspace | `{ roadmapId, skillFolder, subfolderName }` | `LearningWorkspace` |

---

### 5. Progress Tracking (`/api/progress`)

| Method | Endpoint | Description | Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/progress/:roadmapId` | Get progress history and completed tasks | - | `ProgressRecord[]` |
| `POST` | `/api/progress/update` | Toggle item completion & recalculate readiness | `UpdateProgressRequest` | `UpdateProgressResponse` |

---

### 6. Opportunities (`/api/opportunities`)

| Method | Endpoint | Description | Query Params | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities` | Get curated opportunities | `targetRole`, `type`, `location` | `Opportunity[]` |

---

### 7. Email Follow-up & Scheduled Reminders (`/api/jobs`)

| Method | Endpoint | Description | Query / Trigger | Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/trigger-reminders` | Run the 7-day inactivity reminder job | `{ thresholdDays?: 7 }` | `EmailReminderJobResult` |
| `GET` | `/api/jobs/notification-logs` | Retrieve audit trail of sent/mocked emails | - | `Notification[]` |

