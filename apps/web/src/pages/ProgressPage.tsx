import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { RoadmapItem, ProgressRecord, ProficiencyLevel } from '@af03/contracts';
import { 
  CheckSquare, 
  Square, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Award, 
  TrendingUp, 
  FileText, 
  Sparkles,
  Link2,
  Calendar
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { roadmap, setRoadmap, roleReadiness, setRoleReadiness } = useApp();
  const [history, setHistory] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Evidence modal state
  const [activeItem, setActiveItem] = useState<RoadmapItem | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  const [assessedLevel, setAssessedLevel] = useState<ProficiencyLevel>('intermediate');

  useEffect(() => {
    if (roadmap) {
      loadHistory(roadmap.id);
    }
  }, [roadmap]);

  const loadHistory = async (roadmapId: string) => {
    try {
      const data = await apiClient.getProgressHistory(roadmapId);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load progress history:', err);
    }
  };

  if (!roadmap) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
        <CheckSquare className="w-12 h-12 text-brand-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900">No Roadmap Found</h3>
        <p className="text-xs text-slate-500 mt-2">
          Start onboarding to create a personalized progress checklist.
        </p>
      </div>
    );
  }

  const handleToggleItem = async (item: RoadmapItem) => {
    if (!item.isCompleted) {
      // Prompt evidence modal
      setActiveItem(item);
      setProofUrl(item.selfAssessmentProofUrl || '');
      setProofNotes('');
    } else {
      // Toggle off directly
      await submitProgressUpdate(item.id, false);
    }
  };

  const submitProgressUpdate = async (
    itemId: string,
    isCompleted: boolean,
    proofLink?: string,
    notes?: string,
    level?: ProficiencyLevel
  ) => {
    try {
      setUpdatingItemId(itemId);
      const res = await apiClient.updateProgress({
        roadmapId: roadmap.id,
        itemId,
        isCompleted,
        proofUrl: proofLink,
        proofNotes: notes,
        selfAssessedLevel: level,
      });

      setRoadmap(res.roadmap);
      if (roleReadiness) {
        setRoleReadiness({
          ...roleReadiness,
          overallScorePercentage: res.updatedReadinessScore,
        });
      }

      await loadHistory(roadmap.id);
      setActiveItem(null);
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    submitProgressUpdate(activeItem.id, true, proofUrl, proofNotes, assessedLevel);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-mono">
              Role: {roadmap.targetRoleTitle}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{roadmap.totalWeeks} Weeks Planned</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Progress Tracking & Evidence Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark checklist tasks as completed and submit practical project proof to recalculate your role readiness.
          </p>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Roadmap Progress</div>
            <div className="text-xl font-extrabold text-slate-800 font-mono">
              {roadmap.overallProgressPercentage}%
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Current Readiness</div>
            <div className="text-xl font-extrabold text-brand-600 font-mono flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{roadmap.currentReadiness}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Milestones Checklist Accordion */}
      <div className="space-y-4">
        {roadmap.weeklyMilestones.map((milestone) => (
          <div
            key={milestone.weekNumber}
            className={`bg-white rounded-2xl border transition-all ${
              milestone.isCompleted
                ? 'border-emerald-200 shadow-sm'
                : 'border-slate-200'
            }`}
          >
            {/* Milestone Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 rounded-t-2xl border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-700 bg-brand-100/60 px-2.5 py-0.5 rounded">
                    Week {milestone.weekNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    {milestone.phaseName}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{milestone.goal}</h4>
              </div>

              {milestone.isCompleted && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Week Completed</span>
                </span>
              )}
            </div>

            {/* Checklist Items */}
            <div className="p-5 divide-y divide-slate-100">
              {milestone.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleItem(item)}
                      disabled={updatingItemId === item.id}
                      className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors flex-shrink-0"
                    >
                      {item.isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-bold ${
                            item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {item.skillName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.estimatedHours} hrs est.
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Practical assignment brief */}
                      <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Deliverable: </span>
                        <span className="text-slate-600">{item.practicalAssignment.deliverable}</span>
                      </div>

                      {item.selfAssessmentProofUrl && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-600">
                          <Link2 className="w-3.5 h-3.5" />
                          <a
                            href={item.selfAssessmentProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-mono"
                          >
                            {item.selfAssessmentProofUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => handleToggleItem(item)}
                      disabled={updatingItemId === item.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        item.isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          : 'bg-brand-600 hover:bg-brand-700 text-white'
                      }`}
                    >
                      {item.isCompleted ? 'Mark Pending' : 'Verify & Complete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Audit Trail */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Verification Audit History</span>
          </h3>

          <div className="space-y-3">
            {history.slice(0, 5).map((rec) => (
              <div
                key={rec.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{rec.skillName}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span className="text-slate-600">Week {rec.weekNumber} Milestone</span>
                  {rec.practicalProofUrl && (
                    <span className="ml-2 text-brand-600 font-mono">({rec.practicalProofUrl})</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-emerald-600 font-bold">
                    +{rec.impactOnReadinessScore}% Readiness
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(rec.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proof / Self-Assessment Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Verify Milestone Completion</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Checking a task requires practical proof or self-assessment to update your role readiness score.
            </p>

            <form onSubmit={handleModalSubmit} className="mt-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400">Milestone Task</div>
                <div className="text-sm font-bold text-slate-800 mt-0.5">{activeItem.title}</div>
                <div className="text-xs text-slate-600 mt-1">{activeItem.practicalAssignment.deliverable}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Practical Deliverable Proof URL (e.g. GitHub Repository, PR, or Deployment)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project-repo"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Self-Assessed Proficiency Level
                </label>
                <select
                  value={assessedLevel}
                  onChange={(e) => setAssessedLevel(e.target.value as ProficiencyLevel)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="beginner">Beginner — Understand primitives with guidance</option>
                  <option value="intermediate">Intermediate — Implemented independently in sandbox</option>
                  <option value="advanced">Advanced — Ready for production code review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Implementation Notes / Key Takeaways (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Observed edge cases, unit test coverage, or benchmark results..."
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingItemId !== null}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  Confirm & Recalculate Readiness
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

