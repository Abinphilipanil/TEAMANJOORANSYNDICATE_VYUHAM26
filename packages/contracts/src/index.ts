/**
 * @af03/contracts
 * Centralized Shared Data Contracts for AF-03 Career Intelligence Agent
 * 
 * Shared across all four team modules:
 * - MEMBER 1: Frontend (apps/web)
 * - MEMBER 2: Backend & Database (apps/api routes/controllers/services)
 * - MEMBER 3: AI Agent & Job Market Intelligence (apps/api agent/jobs)
 * - MEMBER 4: Workspace & External Integrations (apps/api tools/resources/github/jobs)
 */

// ==========================================
// 1. Enums and Core Types
// ==========================================

export type SkillCategory = 
  | 'language' 
  | 'framework' 
  | 'library' 
  | 'database' 
  | 'cloud_devops' 
  | 'architecture' 
  | 'tool' 
  | 'soft_skill' 
  | 'domain_knowledge';

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SkillGapStatus = 
  | 'already_possessed'     // User demonstrates strong evidence
  | 'partially_developed'   // User has some familiarity or related skill
  | 'missing'               // Essential skill with no evidence found
  | 'needs_verification';   // Mentioned but without sufficient practical proof

export type SkillImportance = 'critical' | 'high' | 'medium' | 'nice_to_have';

export type LearningPace = 'fast' | 'moderate' | 'steady';

export type ResourceType = 'documentation' | 'video' | 'tutorial' | 'interactive' | 'project' | 'cheat_sheet' | 'book';

export type ResourceCostType = 'free' | 'paid' | 'freemium';

export type OpportunityType = 'hackathon' | 'competition' | 'conference' | 'community' | 'meetup';

export type VerificationStatus = 'verified' | 'unverified' | 'demo_data';

// ==========================================
// 2. Models
// ==========================================

/**
 * Skill Definition
 */
export interface Skill {
  id: string;
  name: string;
  normalizedName: string;
  category: SkillCategory;
  description?: string;
  aliases?: string[];
  recommendedResourcesCount?: number;
}

/**
 * Skill Evidence linking a skill to user artifacts
 */
export interface SkillEvidence {
  skillId: string;
  skillName: string;
  sourceType: 'resume' | 'github_repo' | 'linkedin' | 'user_text' | 'self_assessment' | 'project_proof';
  sourceTitle?: string;
  sourceUrl?: string;
  confidenceScore: number; // 0.0 - 1.0
  snippetOrEvidenceText: string;
  verifiedAt: string; // ISO 8601
}

/**
 * Learning Preferences provided by user during onboarding
 */
export interface LearningPreferences {
  learningPace: LearningPace;
  hoursPerWeek: number;
  budget: number;
  currency: string; // default "INR"
  targetWeeks: number;
  preferredLearningFormats: ResourceType[];
  preferredLocation: string; // "Remote", "Bengaluru", "Hybrid", etc.
}

/**
 * User Profile
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  headline?: string;
  bio?: string;
  rawProfileText?: string;
  resumeFileName?: string;
  resumeFileUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  githubStats?: {
    publicReposCount?: number;
    topLanguages?: string[];
    totalStars?: number;
    lastActiveDate?: string;
  };
  detectedSkills: SkillEvidence[];
  preferences: LearningPreferences;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

/**
 * Market Benchmark / Job Posting
 */
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string; // "0-2 years", "3-5 years", etc.
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly';
  };
  sourceUrl: string;
  sourcePlatform: string;
  collectedAt: string;
  isDemoData: boolean;
}

/**
 * Career Role specification in the Career Explorer
 */
export interface CareerRole {
  id: string;
  slug: string;
  title: string;
  domain: string; // e.g. "Web & Cloud", "Data & AI", "Cybersecurity"
  summary: string;
  overviewDescription: string;
  salaryInsight: {
    entryLevelINR: string; // e.g. "₹5,00,000 - ₹8,00,000"
    midLevelINR: string;   // e.g. "₹12,00,000 - ₹20,00,000"
    seniorLevelINR: string;// e.g. "₹25,00,000+"
    marketTrend: 'Growing Fast' | 'High Demand' | 'Stable' | 'Emerging';
    trendPercentage?: string;
    sourceCitation: string;
    isDemoData: boolean;
  };
  requiredTechnicalSkills: Array<{
    name: string;
    category: SkillCategory;
    importance: SkillImportance;
    minimumProficiency: ProficiencyLevel;
  }>;
  requiredSoftSkills: Array<{
    name: string;
    importance: SkillImportance;
    description: string;
  }>;
  coreCompetencies: string[];
  typicalRolesIncluded: string[];
  sampleJobPostings?: JobPosting[];
  isCustomRole?: boolean;
}

/**
 * Skill Gap evaluated by AI Agent
 */
export interface SkillGap {
  skillName: string;
  category: SkillCategory;
  importance: SkillImportance;
  status: SkillGapStatus;
  currentProficiency?: ProficiencyLevel;
  targetProficiency: ProficiencyLevel;
  evidenceFound?: string;
  reasoning: string;
  estimatedHoursToMaster: number;
}

/**
 * Role Readiness evaluation
 */
export interface RoleReadiness {
  overallScorePercentage: number; // 0 to 100
  ratingBand: 'Novice' | 'Developing' | 'Career-Ready Foundation' | 'Job-Market Competitive';
  scoringBreakdown: {
    coreSkillsPossessedCount: number;
    coreSkillsRequiredTotal: number;
    criticalGapsCount: number;
    partiallyCoveredCount: number;
    evidenceQualityScore: number; // 0-100
  };
  readinessSummary: string;
  topStrengths: string[];
  priorityGaps: string[];
  calculatedAt: string;
}

/**
 * Learning Resource
 */
export interface LearningResource {
  id: string;
  skillName: string;
  title: string;
  url: string;
  type: ResourceType;
  cost: ResourceCostType;
  estimatedMinutes: number;
  provider: string; // "MDN Web Docs", "freeCodeCamp", "Official Docs", etc.
  description: string;
  isDownloadableDocument: boolean;
  localCachedPath?: string;
  sourceVerification: VerificationStatus;
}

/**
 * Roadmap Item / Task
 */
export interface RoadmapItem {
  id: string;
  weekNumber: number;
  skillName: string;
  title: string;
  description: string;
  importance: SkillImportance;
  estimatedHours: number;
  learningObjectives: string[];
  resources: LearningResource[];
  practicalAssignment: {
    title: string;
    deliverable: string;
    testOrVerificationSteps: string[];
  };
  isCompleted: boolean;
  completedAt?: string;
  selfAssessmentProofUrl?: string;
}

/**
 * Personalized Roadmap
 */
export interface Roadmap {
  id: string;
  userId: string;
  targetRoleId: string;
  targetRoleTitle: string;
  createdAt: string;
  updatedAt: string;
  totalWeeks: number;
  weeklyHoursPlanned: number;
  budgetAllocated: number;
  currency: string;
  readinessAtCreation: number;
  currentReadiness: number;
  overallProgressPercentage: number;
  summaryRationale: string;
  weeklyMilestones: Array<{
    weekNumber: number;
    phaseName: string;
    goal: string;
    items: RoadmapItem[];
    isCompleted: boolean;
  }>;
  associatedWorkspaceId?: string;
}

/**
 * Learning Workspace
 * Represents the server-side directory structure AF03_Workspace/<career>/<skill>/...
 */
export interface WorkspaceFolderNode {
  name: string;
  relativePath: string;
  absolutePath?: string;
  type: 'directory' | 'file';
  subfolders?: WorkspaceFolderNode[];
  resourceMetadata?: {
    resourceId?: string;
    title?: string;
    sourceUrl?: string;
    downloadedAt?: string;
    fileSizeBytes?: number;
    mimeType?: string;
  };
}

export interface LearningWorkspace {
  id: string;
  roadmapId: string;
  targetRoleSlug: string;
  targetRoleTitle: string;
  serverRootPath: string; // e.g. "AF03_Workspace/Full_Stack_Developer"
  status: 'initialized' | 'created_on_disk' | 'sync_error';
  totalFoldersCount: number;
  totalFilesCount: number;
  diskStructure: WorkspaceFolderNode;
  createdAt: string;
  lastSyncedAt: string;
}

/**
 * Progress Record
 */
export interface ProgressRecord {
  id: string;
  roadmapId: string;
  userId: string;
  itemId: string;
  weekNumber: number;
  skillName: string;
  isCompleted: boolean;
  completedAt: string;
  verifiedProficiency?: ProficiencyLevel;
  practicalProofText?: string;
  practicalProofUrl?: string;
  impactOnReadinessScore: number; // e.g. +4%
}

/**
 * Career & Learning Opportunity
 */
export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  organization: string;
  summary: string;
  targetRoles: string[];
  relevantSkills: string[];
  location: string;
  isRemote: boolean;
  startDate: string;
  deadlineDate?: string;
  url: string;
  prizeOrPerks?: string;
  verificationStatus: VerificationStatus;
  collectedAt: string;
}

/**
 * User Inactivity / Follow-up Notification
 */
export interface Notification {
  id: string;
  userId: string;
  userEmail: string;
  type: 'email_reminder' | 'system_alert' | 'milestone_unlocked';
  subject: string;
  body: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed' | 'mocked';
  inactivityDaysDetected?: number;
  targetRoadmapId?: string;
}

// ==========================================
// 3. API Request / Response DTOs
// ==========================================

export interface AnalyzeCareerRequest {
  targetRoleId?: string;
  customRoleTitle?: string;
  fullName: string;
  email: string;
  profileText?: string;
  resumeFileName?: string;
  resumeBase64?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  preferences: LearningPreferences;
}

export interface AnalyzeCareerResponse {
  success: boolean;
  userProfile: UserProfile;
  careerRole: CareerRole;
  detectedSkills: SkillEvidence[];
  marketJobPostings: JobPosting[];
  skillGaps: SkillGap[];
  roleReadiness: RoleReadiness;
  roadmap: Roadmap;
  workspace: LearningWorkspace;
}

export interface CreateWorkspaceRequest {
  roadmapId: string;
  customFolders?: string[];
}

export interface CreateWorkspaceResponse {
  success: boolean;
  message: string;
  workspace: LearningWorkspace;
}

export interface DownloadResourceRequest {
  workspaceId: string;
  skillFolder: string;
  subfolder: string;
  resourceTitle: string;
  resourceSourceUrl: string;
}

export interface DownloadResourceResponse {
  success: boolean;
  filePath: string;
  fileName: string;
  fileSizeBytes: number;
  sourceUrl: string;
}

export interface UpdateProgressRequest {
  roadmapId: string;
  itemId: string;
  isCompleted: boolean;
  proofUrl?: string;
  proofNotes?: string;
  selfAssessedLevel?: ProficiencyLevel;
}

export interface UpdateProgressResponse {
  success: boolean;
  record: ProgressRecord;
  updatedReadinessScore: number;
  updatedOverallProgress: number;
  roadmap: Roadmap;
}

export interface EmailReminderJobResult {
  executedAt: string;
  usersChecked: number;
  inactivityThresholdDays: number;
  remindersSent: number;
  remindersMocked: number;
  details: Array<{
    userId: string;
    email: string;
    daysInactive: number;
    status: 'sent' | 'mocked' | 'skipped';
    reason?: string;
  }>;
}

