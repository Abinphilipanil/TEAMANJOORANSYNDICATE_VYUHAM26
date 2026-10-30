# AF-03 — Shared Data Contracts Documentation

## Protected Integration Boundary: `packages/contracts`

All four independent developers MUST adhere to the typed data contracts located in `packages/contracts/src/index.ts`. No developer may alter fields without team coordination and version bump.

---

### Core Data Models

#### 1. `Skill`
Represents a canonical technical or soft skill recognized in the system taxonomy.
- `id`: string
- `name`: string (e.g., "React.js")
- `normalizedName`: string (e.g., "react")
- `category`: `SkillCategory` ('language' | 'framework' | 'library' | 'database' | 'cloud_devops' | 'architecture' | 'tool' | 'soft_skill' | 'domain_knowledge')
- `description`: optional string
- `aliases`: string[] (e.g., ["ReactJS", "React", "React.js"])

#### 2. `SkillEvidence`
Records verifiable artifacts connecting a user to a declared skill.
- `skillId`: string
- `skillName`: string
- `sourceType`: `'resume' | 'github_repo' | 'linkedin' | 'user_text' | 'self_assessment' | 'project_proof'`
- `sourceTitle`: optional string
- `sourceUrl`: optional string
- `confidenceScore`: number (0.0 to 1.0)
- `snippetOrEvidenceText`: string
- `verifiedAt`: ISO 8601 string

#### 3. `LearningPreferences`
Captured during Onboarding Step 3.
- `learningPace`: `'fast' | 'moderate' | 'steady'`
- `hoursPerWeek`: number (e.g. 10)
- `budget`: number (e.g. 0 or 5000)
- `currency`: string (default `"INR"`)
- `targetWeeks`: number (e.g. 12)
- `preferredLearningFormats`: `ResourceType[]`
- `preferredLocation`: string (e.g., `"Remote"`, `"Bengaluru"`)

#### 4. `UserProfile`
Aggregated candidate profile.
- `id`: string
- `fullName`: string
- `email`: string
- `headline`, `bio`, `rawProfileText`, `resumeFileName`, `linkedInUrl`, `githubUrl`: optional strings
- `detectedSkills`: `SkillEvidence[]`
- `preferences`: `LearningPreferences`
- `lastActiveAt`: ISO 8601 string (used by email inactivity worker)

#### 5. `CareerRole`
Standardized industry role model displayed on Career Explorer and Career Profile pages.
- `id`, `slug`, `title`, `domain`, `summary`, `overviewDescription`: strings
- `salaryInsight`:
  - `entryLevelINR`, `midLevelINR`, `seniorLevelINR`: strings
  - `marketTrend`: `'Growing Fast' | 'High Demand' | 'Stable' | 'Emerging'`
  - `sourceCitation`: string
  - `isDemoData`: boolean
- `requiredTechnicalSkills`: Array of `{ name, category, importance, minimumProficiency }`
- `requiredSoftSkills`: Array of `{ name, importance, description }`
- `coreCompetencies`: string[]
- `isCustomRole`: boolean (set to true if user submitted custom role)

#### 6. `JobPosting`
Real or benchmark market job postings.
- `id`, `title`, `company`, `location`, `isRemote`: fields
- `requiredSkills`, `preferredSkills`: string arrays
- `sourceUrl`, `sourcePlatform`, `collectedAt`: citations
- `isDemoData`: boolean

#### 7. `SkillGap`
Computed item in the Gap Matrix.
- `skillName`: string
- `status`: `'already_possessed' | 'partially_developed' | 'missing' | 'needs_verification'`
- `importance`: `'critical' | 'high' | 'medium' | 'nice_to_have'`
- `currentProficiency`, `targetProficiency`: `ProficiencyLevel`
- `reasoning`: string
- `estimatedHoursToMaster`: number

#### 8. `RoleReadiness`
Explainable scoring engine output.
- `overallScorePercentage`: number (0 to 100)
- `ratingBand`: `'Novice' | 'Developing' | 'Career-Ready Foundation' | 'Job-Market Competitive'`
- `scoringBreakdown`: counts of core skills possessed, total required, critical gaps, partially covered, and evidence quality score.
- `topStrengths`, `priorityGaps`: string arrays

#### 9. `LearningResource`
Curated study materials for each skill.
- `id`, `skillName`, `title`, `url`, `type`, `cost`, `estimatedMinutes`, `provider`, `description`
- `isDownloadableDocument`: boolean
- `localCachedPath`: optional string
- `sourceVerification`: `'verified' | 'unverified' | 'demo_data'`

#### 10. `Roadmap` & `RoadmapItem`
Weekly milestones with actionable learning objectives, resources, and practical projects.
- `id`, `userId`, `targetRoleId`, `targetRoleTitle`
- `weeklyMilestones`: Array of `{ weekNumber, phaseName, goal, items, isCompleted }`
- `overallProgressPercentage`: number

#### 11. `LearningWorkspace`
Representation of the server-side folder structure created in `AF03_Workspace/`.
- `serverRootPath`: string (e.g., `AF03_Workspace/Full_Stack_Developer`)
- `status`: `'initialized' | 'created_on_disk' | 'sync_error'`
- `diskStructure`: `WorkspaceFolderNode` (hierarchical tree of folders and files)

#### 12. `ProgressRecord`
Audit trail of completed milestones and updated proficiency.
- `itemId`, `skillName`, `isCompleted`, `proofUrl`, `impactOnReadinessScore`

#### 13. `Opportunity`
Curated career acceleration events (hackathons, competitions, conferences).
- `id`, `title`, `type`, `organization`, `location`, `deadlineDate`, `url`, `verificationStatus`

#### 14. `Notification`
Audit record for emails sent by scheduled jobs.
- `userEmail`, `subject`, `status`: `'sent' | 'mocked' | 'failed'`

