import React from 'react';
import { SkillGapStatus, SkillImportance } from '@af03/contracts';
import { CheckCircle2, AlertCircle, Clock, HelpCircle } from 'lucide-react';

interface SkillBadgeProps {
  status?: SkillGapStatus;
  importance?: SkillImportance;
  label?: string;
  showIcon?: boolean;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  status,
  importance,
  label,
  showIcon = true,
}) => {
  if (importance) {
    const config = {
      critical: { bg: 'bg-rose-50 text-rose-700 border-rose-200', text: 'Critical' },
      high: { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: 'High' },
      medium: { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: 'Medium' },
      nice_to_have: { bg: 'bg-slate-50 text-slate-600 border-slate-200', text: 'Nice to have' },
    }[importance];

    return (
      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${config.bg}`}>
        {label || config.text}
      </span>
    );
  }

  if (status) {
    const config = {
      already_possessed: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'Possessed',
        icon: CheckCircle2,
      },
      partially_developed: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'Partially Developed',
        icon: Clock,
      },
      missing: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        text: 'Missing Gap',
        icon: AlertCircle,
      },
      needs_verification: {
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        text: 'Needs Verification',
        icon: HelpCircle,
      },
    }[status];

    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${config.bg}`}>
        {showIcon && <Icon className="w-3.5 h-3.5" />}
        {label || config.text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
      {label}
    </span>
  );
};

