# AF-03 — Architecture Overview

## Project: AI-Powered Career and Skill-Gap Analysis Agent

### 1. Vision and Product Mission
AF-03 is an AI-powered career intelligence, skill-gap analysis, and learning execution platform. Rather than serving as a passive chatbot or a generic video course catalog, AF-03 implements a data-driven **"Learn-Then-Prove"** loop inspired by real employer job market demands:
1. **Career Role Discovery & Market Benchmarking**: Users explore high-demand careers with realistic salary insights and market metrics.
2. **Multi-Modal Profile Onboarding**: Ingestion of resumes (PDF/DOCX), plain text, LinkedIn URLs, and GitHub profiles.
3. **AI Agent Analysis Pipeline**:
   - Profile Skill Extraction & Taxonomy Normalization
   - Job Market Multi-Posting Aggregation
   - Explainable Skill-Gap Matrix (Possessed, Partially Developed, Missing, Needs Verification)
   - Explainable Role-Readiness Scoring
   - Time- & Budget-Constrained Roadmap Generation with rationales
4. **Server-Side Controlled Learning Workspace**:
   - Generates deterministic, sandboxed server-side folder hierarchies (`AF03_Workspace/<career>/<skill>/[Fundamentals, Advanced, Resources, Projects]`)
   - Controlled tools for resource validation, safe document retrieval, and metadata tracking.
5. **Interactive Progress & Evidence-Based Verification**:
   - Weekly checklist tied directly to roadmap items.
   - Project proof submissions that dynamically update skill proficiency and role readiness.
6. **Career Opportunities Engine**:
   - Filtered hackathons, product competitions, tech conferences, and developer meetups matched to user's target role and verified skills.
7. **Scheduled Follow-Up Reminders**:
   - Background worker monitoring 7-day user inactivity with configurable mock/SMTP adapters.

---

### 2. Monorepo Topology

```text
skillgapper/
├── apps/
│   ├── api/                    # Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── agent/          # MEMBER 3: AI Agent Orchestrator & Pipelines
│   │   │   ├── config/         # MEMBER 2: Environment & System Config
│   │   │   ├── controllers/    # MEMBER 2: REST Controllers
│   │   │   ├── integrations/
│   │   │   │   ├── github/     # MEMBER 4: GitHub API & Profiling
│   │   │   │   ├── jobs/       # MEMBER 3: Job Market Feed Aggregator
│   │   │   │   └── resources/  # MEMBER 4: Learning Resource Index & Safe Downloader
│   │   │   ├── jobs/           # MEMBER 4: Inactivity Email Reminder Worker
│   │   │   ├── repositories/   # MEMBER 2: Persistence Layer (JSON / SQLite DB)
│   │   │   ├── routes/         # MEMBER 2: Express Route Definitions
│   │   │   ├── services/       # MEMBER 2: Business Logic & Scoring Services
│   │   │   └── tools/          # MEMBER 4: Safe Server Workspace Tooling
│   │   └── test/
│   └── web/                    # MEMBER 1: Vite + React + TypeScript + Tailwind UI
│       ├── src/
│       │   ├── api/            # Typed Frontend API Clients
│       │   ├── components/     # UI Components (Cards, Gauges, Modals, Breadcrumbs)
│       │   ├── layouts/        # PublicLayout & DashboardLayout (Sidebar/Topbar)
│       │   ├── pages/          # 8 Core Pages
│       │   └── types/
├── packages/
│   └── contracts/              # SHARED BOUNDARY: TypeScript Models & DTOs
├── docs/                       # Architectural & Team Governance Documentation
│   ├── ARCHITECTURE.md
│   ├── CONTRACTS.md
│   ├── TEAM_OWNERSHIP.md
│   └── API_ENDPOINTS.md
├── AF03_Workspace/             # Controlled Server-Side Workspace Root
└── package.json                # Root npm workspace manifest
```

---

### 3. Data Flow Diagram

```mermaid
flowchart TD
    User([User in Browser]) --> Web[apps/web Frontend]
    Web -->|REST API Requests| API[apps/api Express Backend]
    
    subgraph Member2_Backend [Backend Core - Member 2]
        API --> Controllers[Controllers]
        Controllers --> Services[Domain Services]
        Services --> Repos[Persistence Repositories]
    end

    subgraph Member3_Agent [AI & Market Intelligence - Member 3]
        Services --> Agent[Agent Orchestrator]
        Agent --> Extractor[Profile Extractor]
        Agent --> Normalizer[Taxonomy Normalizer]
        Agent --> MarketIntel[Job Market Aggregator]
        Agent --> GapAnalyzer[Skill Gap & Readiness Engine]
        Agent --> RoadmapGen[Roadmap Generator]
    end

    subgraph Member4_Integrations [Workspace & Tools - Member 4]
        Services --> WorkspaceTool[Safe Workspace Tool]
        WorkspaceTool --> Disk[AF03_Workspace Disk Storage]
        Services --> ResDownloader[Resource Downloader]
        Services --> CronJob[Email Inactivity Scheduler]
    end

    subgraph SharedContracts [Shared Integration Boundary]
        Contracts[@af03/contracts package]
    end

    Web -.-> Contracts
    API -.-> Contracts
```

---

### 4. Technical Stack
- **Runtime**: Node.js v20+ (tested on Node v24)
- **Language**: TypeScript 5.3+
- **Backend**: Express.js, CORS, Multer (file uploads), Safe FS tools
- **Frontend**: Vite, React 18, Tailwind CSS, Lucide React (clean SaaS iconography)
- **Persistence**: High-reliability file-backed persistent repository store with deterministic schema migration support
- **Contracts**: Shared npm workspace package `@af03/contracts`

