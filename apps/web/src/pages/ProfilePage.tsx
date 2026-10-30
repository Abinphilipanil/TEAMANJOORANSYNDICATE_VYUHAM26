import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { Notification, EmailReminderJobResult } from '@af03/contracts';
import { 
  UserCircle2, 
  Mail, 
  Github, 
  Linkedin, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Terminal,
  IndianRupee,
  Layers
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { userProfile, roadmap } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [runningJob, setRunningJob] = useState(false);
  const [jobResult, setJobResult] = useState<EmailReminderJobResult | null>(null);

  useEffect(() => {
    loadNotificationLogs();
  }, []);

  const loadNotificationLogs = async () => {
    try {
      const logs = await apiClient.getNotificationLogs();
      setNotifications(logs);
    } catch (err) {
      console.error('Failed to load notification logs:', err);
    }
  };

  const handleTriggerEmailJob = async () => {
    try {
      setRunningJob(true);
      // Run with threshold 0 days for immediate demonstration in test environment
      const result = await apiClient.triggerEmailReminders(0);
      setJobResult(result);
      await loadNotificationLogs();
    } catch (err) {
      console.error('Failed to trigger email reminders:', err);
    } finally {
      setRunningJob(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {userProfile?.fullName || 'Candidate Profile'}
              </h2>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{userProfile?.email || 'developer@af03-skillgapper.local'}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700">
                  Target: {roadmap?.targetRoleTitle || 'Not selected'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {userProfile?.githubUrl && (
              <a
                href={userProfile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {userProfile?.linkedInUrl && (
              <a
                href={userProfile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-blue-600 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Learning Preferences Snapshot */}
        {userProfile?.preferences && (
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Learning Pace</span>
              <div className="font-bold text-slate-800 capitalize mt-0.5">{userProfile.preferences.learningPace}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Weekly Hours</span>
              <div className="font-bold text-slate-800 font-mono mt-0.5">{userProfile.preferences.hoursPerWeek} hrs/wk</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Target Weeks</span>
              <div className="font-bold text-slate-800 font-mono mt-0.5">{userProfile.preferences.targetWeeks} Weeks</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Budget</span>
              <div className="font-bold text-slate-800 font-mono mt-0.5">₹{userProfile.preferences.budget} INR</div>
            </div>
          </div>
        )}
      </div>

      {/* Detected Skills from Profile */}
      {userProfile?.detectedSkills && userProfile.detectedSkills.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Extracted Skills & Verified Evidence</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {userProfile.detectedSkills.map((ev, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-bold text-slate-800">{ev.skillName}</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ev.snippetOrEvidenceText}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                    Source: {ev.sourceType}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 font-mono">
                    {Math.round(ev.confidenceScore * 100)}% Conf
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part 8: Scheduled Inactivity Email Reminders Engine */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Automated 7-Day Inactivity Email Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Monitors candidate learning velocity. If no checklist updates are recorded within 7 days, a polite follow-up is dispatched with roadmap links.
            </p>
          </div>

          <button
            onClick={handleTriggerEmailJob}
            disabled={runningJob}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{runningJob ? 'Scanning...' : 'Test Inactivity Trigger Now'}</span>
          </button>
        </div>

        {/* Adapter Notice */}
        <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Zero-Config Mock / SMTP Adapter: </span>
            When SMTP credentials are not set in <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code>, the system automatically uses the verified Mock Email Adapter, recording structured logs and audit records without throwing unhandled network errors.
          </div>
        </div>

        {/* Job Execution Output */}
        {jobResult && (
          <div className="mt-5 p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono space-y-2">
            <div className="text-brand-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Inactivity Job Execution Output</span>
            </div>
            <div>Executed At: {jobResult.executedAt}</div>
            <div>Users Checked: {jobResult.usersChecked}</div>
            <div>Reminders Mocked: {jobResult.remindersMocked} | Dispatched: {jobResult.remindersSent}</div>
            {jobResult.details.map((d, i) => (
              <div key={i} className="text-slate-400 border-t border-slate-800 pt-1">
                &gt; User: {d.email} • Status: <span className="text-amber-400 font-bold">{d.status}</span> ({d.reason})
              </div>
            ))}
          </div>
        )}

        {/* Notification Logs Audit Table */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Dispatched Notification Audit History
          </h4>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No email reminders dispatched yet. Click "Test Inactivity Trigger Now" above.</p>
          ) : (
            <div className="space-y-2.5">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800">{notif.subject}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">To: {notif.userEmail}</div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold uppercase">
                      {notif.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.sentAt || '').toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

