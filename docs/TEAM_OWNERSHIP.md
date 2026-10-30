# AF-03 — Team Ownership and Modular Boundaries

To ensure zero code collision across our four developers, the repository enforces strict folder boundaries, single responsibilities, and clear integration interfaces.

---

### Team Ownership Matrix

| Member | Primary Responsibility | Directory Boundaries | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **MEMBER 1 (Frontend)** | UI/UX & Client Applications | `apps/web/**` | - Career Explorer Page<br>- Career Profile Page<br>- Multi-Step Onboarding Form<br>- Interactive Dashboard & Visualizations<br>- Dual-Pane Learning Workspace UI<br>- Progress Tracking & Checklist UI<br>- Opportunities UI<br>- Design System & Responsive Layouts |
| **MEMBER 2 (Backend & DB)** | Core REST API, Services, Repositories | `apps/api/src/routes/**`<br>`apps/api/src/controllers/**`<br>`apps/api/src/repositories/**`<br>`apps/api/src/services/**`<br>`apps/api/src/config/**` | - REST Controller Endpoints<br>- Persistent Data Repositories<br>- Request Validation Middleware<br>- Role-Readiness & Progress Scoring Engine<br>- User & Roadmap Storage |
| **MEMBER 3 (AI Agent & Market Intel)** | Agent Pipeline & Job Intelligence | `apps/api/src/agent/**`<br>`apps/api/src/integrations/jobs/**` | - Resume Skill Extractor (PDF/DOCX/Text)<br>- Canonical Skill Normalizer<br>- Multi-Posting Job Market Aggregator<br>- Skill-Gap Matrix Evaluator<br>- Personalized Roadmap Generator with Rationales |
| **MEMBER 4 (Workspace & Integrations)** | Server Storage & External Integrations | `apps/api/src/tools/**`<br>`apps/api/src/integrations/resources/**`<br>`apps/api/src/integrations/github/**`<br>`apps/api/src/jobs/**` | - Safe Server-Side Workspace Folder Creator<br>- Controlled Document Downloader<br>- GitHub Profile Enricher<br>- 7-Day Inactivity Email Reminder Job<br>- Email Adapter (Mock & SMTP) |
| **SHARED BOUNDARY** | Centralized Data Contracts | `packages/contracts/**` | - TypeScript models, DTOs, and Enums<br>- Shared validation helpers |

---

### Communication & Change Protocol
1. **Contract Immutability**: No developer may alter `packages/contracts` without raising a design note.
2. **Mock Fallback Rule**: All external integrations (AI Providers, Job aggregators, Email providers) must provide a zero-credential mock fallback so that tests and local development can run without internet or paid API keys.
3. **No Monolithic Files**: Code logic is strictly decoupled across controllers, services, repositories, and tools.

