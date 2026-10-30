import React, { useState } from 'react';
import { IconSettings, IconCheckCircle } from '../components/career-agent/Icons';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { userProfile } = useApp();
  const [profileName, setProfileName] = useState(userProfile?.fullName || 'Alex Rivera');
  const [targetTrack, setTargetTrack] = useState('Cloud Solutions Architect');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="ca-page-container ca-settings-page max-w-4xl mx-auto px-4 py-8">
      <div className="settings-page-header">
        <span className="page-badge">Configuration</span>
        <h1 className="page-title">Account & Platform Settings</h1>
        <p className="page-subtitle">Manage your profile, target role preferences, and notification defaults.</p>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon-box">
            <IconSettings className="w-5 h-5 text-blue" />
          </div>
          <div>
            <h2 className="settings-section-title">Profile Preferences</h2>
            <p className="settings-section-desc">Personalize your resume parsing and career roadmap matching.</p>
          </div>
        </div>

        {savedSuccess && (
          <div className="settings-success-alert">
            <IconCheckCircle className="w-4 h-4 text-emerald" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="settings-form">
          <div className="form-group">
            <label htmlFor="pref-name" className="form-label">Display Name</label>
            <input
              id="pref-name"
              type="text"
              className="form-input"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pref-track" className="form-label">Primary Career Track</label>
            <input
              id="pref-track"
              type="text"
              className="form-input"
              value={targetTrack}
              onChange={(e) => setTargetTrack(e.target.value)}
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span>Receive weekly learning milestone reminders</span>
            </label>
          </div>

          <div className="form-actions mt-6">
            <button type="submit" className="btn-primary-cta">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

