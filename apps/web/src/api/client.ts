import { 
  CareerRole, 
  AnalyzeCareerRequest, 
  AnalyzeCareerResponse, 
  Roadmap, 
  LearningWorkspace, 
  UpdateProgressRequest, 
  UpdateProgressResponse, 
  ProgressRecord, 
  Opportunity, 
  EmailReminderJobResult, 
  Notification,
  DownloadResourceResponse
} from '@af03/contracts';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const apiClient = {
  // Careers
  async getCareers(query?: string, domain?: string): Promise<CareerRole[]> {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (domain) params.append('domain', domain);
    const res = await fetch(`${API_BASE}/careers?${params.toString()}`);
    return handleResponse<CareerRole[]>(res);
  },

  async getCareerByIdOrSlug(idOrSlug: string): Promise<CareerRole> {
    const res = await fetch(`${API_BASE}/careers/${idOrSlug}`);
    return handleResponse<CareerRole>(res);
  },

  async createCustomRole(payload: { title: string; domain?: string; description?: string }): Promise<CareerRole> {
    const res = await fetch(`${API_BASE}/careers/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<CareerRole>(res);
  },

  // AI Agent Analysis
  async analyzeCareer(payload: AnalyzeCareerRequest, resumeFile?: File): Promise<AnalyzeCareerResponse> {
    if (resumeFile) {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('fullName', payload.fullName || 'Career Candidate');
      formData.append('email', payload.email || 'candidate@careeragent.ai');
      if (payload.jobDescription) formData.append('jobDescription', payload.jobDescription);
      if (payload.targetRoleId) formData.append('targetRoleId', payload.targetRoleId);
      if (payload.customRoleTitle) formData.append('customRoleTitle', payload.customRoleTitle);
      if (payload.profileText) formData.append('profileText', payload.profileText);
      if (payload.linkedInUrl) formData.append('linkedInUrl', payload.linkedInUrl);
      if (payload.githubUrl) formData.append('githubUrl', payload.githubUrl);
      if (payload.preferences) formData.append('preferences', JSON.stringify(payload.preferences));

      const res = await fetch(`${API_BASE}/agent/analyze`, {
        method: 'POST',
        body: formData,
      });
      return handleResponse<AnalyzeCareerResponse>(res);
    } else {
      const res = await fetch(`${API_BASE}/agent/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return handleResponse<AnalyzeCareerResponse>(res);
    }
  },

  // Roadmaps
  async getRoadmap(roadmapId: string): Promise<Roadmap> {
    const res = await fetch(`${API_BASE}/roadmaps/${roadmapId}`);
    return handleResponse<Roadmap>(res);
  },

  // Workspace
  async getWorkspace(roadmapId: string): Promise<LearningWorkspace> {
    const res = await fetch(`${API_BASE}/workspace/${roadmapId}`);
    return handleResponse<LearningWorkspace>(res);
  },

  async syncWorkspace(roadmapId: string): Promise<{ success: boolean; message: string; workspace: LearningWorkspace }> {
    const res = await fetch(`${API_BASE}/workspace/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roadmapId }),
    });
    return handleResponse<{ success: boolean; message: string; workspace: LearningWorkspace }>(res);
  },

  async downloadResource(payload: {
    workspaceId: string;
    skillFolder: string;
    subfolder: string;
    resourceTitle: string;
    resourceSourceUrl: string;
  }): Promise<DownloadResourceResponse> {
    const res = await fetch(`${API_BASE}/workspace/download-resource`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<DownloadResourceResponse>(res);
  },

  async addCustomFolder(payload: {
    roleSlug: string;
    skillFolder: string;
    subfolderName: string;
  }): Promise<LearningWorkspace> {
    const res = await fetch(`${API_BASE}/workspace/custom-folder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<LearningWorkspace>(res);
  },

  // Progress
  async updateProgress(payload: UpdateProgressRequest): Promise<UpdateProgressResponse> {
    const res = await fetch(`${API_BASE}/progress/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<UpdateProgressResponse>(res);
  },

  async getProgressHistory(roadmapId: string): Promise<ProgressRecord[]> {
    const res = await fetch(`${API_BASE}/progress/history/${roadmapId}`);
    return handleResponse<ProgressRecord[]>(res);
  },

  // Opportunities
  async getOpportunities(targetRole?: string, type?: string, location?: string): Promise<Opportunity[]> {
    const params = new URLSearchParams();
    if (targetRole) params.append('targetRole', targetRole);
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    const res = await fetch(`${API_BASE}/opportunities?${params.toString()}`);
    return handleResponse<Opportunity[]>(res);
  },

  // Jobs & Reminders
  async triggerEmailReminders(thresholdDays?: number): Promise<EmailReminderJobResult> {
    const res = await fetch(`${API_BASE}/jobs/trigger-reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thresholdDays }),
    });
    return handleResponse<EmailReminderJobResult>(res);
  },

  async getNotificationLogs(): Promise<Notification[]> {
    const res = await fetch(`${API_BASE}/jobs/notification-logs`);
    return handleResponse<Notification[]>(res);
  },

  // Hackathons
  async getHackathons(params?: { domain?: string; search?: string }): Promise<any> {
    const q = new URLSearchParams();
    if (params?.domain && params.domain !== 'all') q.append('domain', params.domain);
    if (params?.search && params.search.trim()) q.append('search', params.search.trim());
    const query = q.toString() ? `?${q.toString()}` : '';
    const res = await fetch(`${API_BASE}/hackathons${query}`);
    return handleResponse<any>(res);
  },

  async getHackathonSummary(): Promise<any> {
    const res = await fetch(`${API_BASE}/summary`);
    return handleResponse<any>(res);
  },
};
