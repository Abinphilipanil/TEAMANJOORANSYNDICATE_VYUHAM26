import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CareerRole, 
  UserProfile, 
  Roadmap, 
  LearningWorkspace, 
  SkillGap, 
  RoleReadiness 
} from '@af03/contracts';
import { apiClient } from '../api/client';
import { ResumeAnalysisResult } from '../services/resumeAnalysisService';

interface AppContextType {
  selectedRole: CareerRole | null;
  setSelectedRole: (role: CareerRole | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  roadmap: Roadmap | null;
  setRoadmap: (roadmap: Roadmap | null) => void;
  workspace: LearningWorkspace | null;
  setWorkspace: (workspace: LearningWorkspace | null) => void;
  skillGaps: SkillGap[];
  setSkillGaps: (gaps: SkillGap[]) => void;
  roleReadiness: RoleReadiness | null;
  setRoleReadiness: (readiness: RoleReadiness | null) => void;
  resumeAnalysisResult: ResumeAnalysisResult | null;
  setResumeAnalysisResult: (res: ResumeAnalysisResult | null) => void;
  analysisResumeFile: File | null;
  setAnalysisResumeFile: (file: File | null) => void;
  analysisJobDescription: string;
  setAnalysisJobDescription: (jd: string) => void;
  refreshRoadmap: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<CareerRole | null>(() => {
    const saved = localStorage.getItem('af03_selected_role');
    return saved ? JSON.parse(saved) : null;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('af03_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [roadmap, setRoadmap] = useState<Roadmap | null>(() => {
    const saved = localStorage.getItem('af03_roadmap');
    return saved ? JSON.parse(saved) : null;
  });

  const [workspace, setWorkspace] = useState<LearningWorkspace | null>(() => {
    const saved = localStorage.getItem('af03_workspace');
    return saved ? JSON.parse(saved) : null;
  });

  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(() => {
    const saved = localStorage.getItem('af03_skill_gaps');
    return saved ? JSON.parse(saved) : [];
  });

  const [resumeAnalysisResult, setResumeAnalysisResult] = useState<ResumeAnalysisResult | null>(() => {
    const saved = localStorage.getItem('af03_resume_analysis');
    return saved ? JSON.parse(saved) : null;
  });

  const [analysisResumeFile, setAnalysisResumeFile] = useState<File | null>(null);

  const [analysisJobDescription, setAnalysisJobDescription] = useState<string>(() => {
    return localStorage.getItem('af03_analysis_job_desc') || '';
  });

  const [roleReadiness, setRoleReadiness] = useState<RoleReadiness | null>(() => {
    const saved = localStorage.getItem('af03_role_readiness');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist to local storage for seamless tab refresh
  useEffect(() => {
    if (selectedRole) localStorage.setItem('af03_selected_role', JSON.stringify(selectedRole));
    else localStorage.removeItem('af03_selected_role');
  }, [selectedRole]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('af03_user_profile', JSON.stringify(userProfile));
    else localStorage.removeItem('af03_user_profile');
  }, [userProfile]);

  useEffect(() => {
    if (roadmap) localStorage.setItem('af03_roadmap', JSON.stringify(roadmap));
    else localStorage.removeItem('af03_roadmap');
  }, [roadmap]);

  useEffect(() => {
    if (workspace) localStorage.setItem('af03_workspace', JSON.stringify(workspace));
    else localStorage.removeItem('af03_workspace');
  }, [workspace]);

  useEffect(() => {
    if (skillGaps.length > 0) localStorage.setItem('af03_skill_gaps', JSON.stringify(skillGaps));
    else localStorage.removeItem('af03_skill_gaps');
  }, [skillGaps]);

  useEffect(() => {
    if (roleReadiness) localStorage.setItem('af03_role_readiness', JSON.stringify(roleReadiness));
    else localStorage.removeItem('af03_role_readiness');
  }, [roleReadiness]);

  useEffect(() => {
    if (resumeAnalysisResult) localStorage.setItem('af03_resume_analysis', JSON.stringify(resumeAnalysisResult));
    else localStorage.removeItem('af03_resume_analysis');
  }, [resumeAnalysisResult]);

  useEffect(() => {
    if (analysisJobDescription) localStorage.setItem('af03_analysis_job_desc', analysisJobDescription);
    else localStorage.removeItem('af03_analysis_job_desc');
  }, [analysisJobDescription]);

  const refreshRoadmap = async () => {
    if (roadmap) {
      try {
        const updated = await apiClient.getRoadmap(roadmap.id);
        setRoadmap(updated);
      } catch (err) {
        console.error('Failed to refresh roadmap:', err);
      }
    }
  };

  const refreshWorkspace = async () => {
    if (roadmap) {
      try {
        const ws = await apiClient.getWorkspace(roadmap.id);
        setWorkspace(ws);
      } catch (err) {
        console.error('Failed to refresh workspace:', err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedRole,
        setSelectedRole,
        userProfile,
        setUserProfile,
        roadmap,
        setRoadmap,
        workspace,
        setWorkspace,
        skillGaps,
        setSkillGaps,
        roleReadiness,
        setRoleReadiness,
        resumeAnalysisResult,
        setResumeAnalysisResult,
        analysisResumeFile,
        setAnalysisResumeFile,
        analysisJobDescription,
        setAnalysisJobDescription,
        refreshRoadmap,
        refreshWorkspace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

