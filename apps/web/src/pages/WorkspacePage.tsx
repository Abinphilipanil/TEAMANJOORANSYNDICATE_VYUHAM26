import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/client';
import { WorkspaceFolderNode, LearningResource } from '@af03/contracts';
import { FolderTree } from '../components/FolderTree';
import { 
  FolderKanban, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Folder,
  Layers,
  Sparkles,
  Award
} from 'lucide-react';

export const WorkspacePage: React.FC = () => {
  const { roadmap, workspace, setWorkspace, refreshWorkspace } = useApp();
  const [selectedNode, setSelectedNode] = useState<WorkspaceFolderNode | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Custom subfolder modal state
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [skillFolderName, setSkillFolderName] = useState('');
  const [newSubfolderName, setNewSubfolderName] = useState('');

  useEffect(() => {
    if (workspace?.diskStructure) {
      setSelectedNode(workspace.diskStructure);
    }
  }, [workspace]);

  if (!roadmap) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm">
        <FolderKanban className="w-12 h-12 text-brand-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900">No Learning Workspace Active</h3>
        <p className="text-xs text-slate-500 mt-2">
          Please complete career onboarding to create your dedicated server-side learning workspace.
        </p>
      </div>
    );
  }

  const handleSyncWorkspace = async () => {
    try {
      setSyncing(true);
      setStatusMessage('Creating actual folders on server storage...');
      const res = await apiClient.syncWorkspace(roadmap.id);
      setWorkspace(res.workspace);
      setSelectedNode(res.workspace.diskStructure);
      setStatusMessage('Workspace folders synchronized successfully on disk.');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateCustomFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubfolderName.trim() || !workspace) return;

    try {
      setStatusMessage('Creating custom workspace directory...');
      const updated = await apiClient.addCustomFolder({
        roleSlug: workspace.targetRoleSlug,
        skillFolder: skillFolderName || 'General_Resources',
        subfolderName: newSubfolderName,
      });
      setWorkspace(updated);
      setSelectedNode(updated.diskStructure);
      setIsFolderModalOpen(false);
      setNewSubfolderName('');
      setStatusMessage('Subfolder created on server storage.');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage(`Folder creation error: ${err.message}`);
    }
  };

  const handleDownloadDoc = async (skill: string, title: string, url: string) => {
    if (!workspace) return;
    try {
      setDownloading(true);
      setStatusMessage(`Safely downloading study document for ${skill}...`);
      const res = await apiClient.downloadResource({
        workspaceId: workspace.targetRoleSlug,
        skillFolder: skill.replace(/[^a-zA-Z0-9_-]/g, '_'),
        subfolder: 'Learning_Resources',
        resourceTitle: title,
        resourceSourceUrl: url,
      });
      setStatusMessage(`Saved non-executable guide to: ${res.filePath} (${res.fileSizeBytes} bytes)`);
      await refreshWorkspace();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setStatusMessage(`Download failed: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Find roadmap milestone items matching the selected folder
  const currentSkillMatch = selectedNode
    ? roadmap.weeklyMilestones.flatMap(m => m.items).find(i => 
        selectedNode.relativePath.toLowerCase().includes(i.skillName.toLowerCase().replace(/[^a-z0-9]/g, '_')) ||
        i.skillName.toLowerCase().includes(selectedNode.name.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-mono">
              Server Storage: {workspace ? workspace.serverRootPath : `AF03_Workspace/${roadmap.targetRoleTitle}`}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Sandboxed Filesystem
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Learning Workspace & Local Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized hierarchy of skill folders, study documents, official references, and hands-on projects.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsFolderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>New Subfolder</span>
          </button>

          <button
            onClick={handleSyncWorkspace}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Disk Folders'}</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="p-3 bg-brand-50 text-brand-800 rounded-xl text-xs font-medium border border-brand-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left Pane: Server File Tree Explorer */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>Workspace Directory Tree</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {workspace?.totalFoldersCount || 0} Folders
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {workspace?.diskStructure ? (
              <FolderTree
                node={workspace.diskStructure}
                onSelectNode={(node) => setSelectedNode(node)}
                selectedPath={selectedNode?.relativePath}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Click "Sync Disk Folders" to materialize directory structure.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Selected Node & Learning Resources Inspector */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono uppercase font-semibold text-slate-400">
                  {selectedNode?.type === 'file' ? 'Inspecting Document' : 'Inspecting Folder'}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedNode?.name || 'Select a folder or file to inspect'}
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Path: {selectedNode?.relativePath || 'Root'}
                </p>
              </div>

              {selectedNode?.type === 'file' && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono">
                  {selectedNode.resourceMetadata?.fileSizeBytes || 0} Bytes
                </span>
              )}
            </div>

            {/* Folder Objectives and Practical Assignment */}
            {currentSkillMatch && (
              <div className="mt-5 space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-brand-600" />
                    <span>Learning Objectives for {currentSkillMatch.skillName}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {currentSkillMatch.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Practical Milestone Project */}
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Practical Project Assignment</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Deliverable
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 mt-2">
                    {currentSkillMatch.practicalAssignment.title}
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentSkillMatch.practicalAssignment.deliverable}
                  </p>
                  <div className="mt-2.5 space-y-1">
                    {currentSkillMatch.practicalAssignment.testOrVerificationSteps.map((step, idx) => (
                      <div key={idx} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resources list with Safe Download CTA */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Curated Learning Resources & Documentation
                  </h4>
                  <div className="space-y-2.5">
                    {currentSkillMatch.resources.map((res) => (
                      <div
                        key={res.id}
                        className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-900 flex items-center gap-2">
                            <span>{res.title}</span>
                            <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.2 rounded">
                              {res.provider}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {res.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {res.isDownloadableDocument && (
                            <button
                              onClick={() => handleDownloadDoc(currentSkillMatch.skillName, res.title, res.url)}
                              disabled={downloading}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              <span>Save Guide</span>
                            </button>
                          )}
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <span>Open Source</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!currentSkillMatch && (
              <div className="py-12 text-center text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-xs">
                  {selectedNode?.type === 'file'
                    ? `File: ${selectedNode.name}`
                    : 'Select a specific skill folder to inspect tailored resources, study guides, and assignments.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer notice */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Server Root: {workspace?.serverRootPath}</span>
            <span>Security: Read & Write Confined to AF03_Workspace</span>
          </div>
        </div>
      </div>

      {/* Create Custom Subfolder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-brand-600" />
              <span>Create Custom Workspace Subfolder</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add a specialized directory on the server filesystem for project assets or study notes.
            </p>

            <form onSubmit={handleCreateCustomFolder} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Skill Folder
                </label>
                <input
                  type="text"
                  placeholder="e.g. JavaScript, React, Docker..."
                  value={skillFolderName}
                  onChange={(e) => setSkillFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subfolder Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cheat_Sheets, Microservices_POC..."
                  value={newSubfolderName}
                  onChange={(e) => setNewSubfolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
                >
                  Create Folder on Disk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

