import React from 'react';

interface ReadinessGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  ratingBand?: string;
  showDetails?: boolean;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  ratingBand,
  showDetails = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  let color = '#ef4444'; // Red
  let band = ratingBand || 'Novice';
  if (clampedScore >= 80) {
    color = '#10b981'; // Green
    if (!ratingBand) band = 'Job-Market Competitive';
  } else if (clampedScore >= 60) {
    color = '#0284c7'; // Blue/Cyan
    if (!ratingBand) band = 'Career-Ready Foundation';
  } else if (clampedScore >= 40) {
    color = '#f59e0b'; // Amber
    if (!ratingBand) band = 'Developing';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{clampedScore}%</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Readiness</span>
        </div>
      </div>
      {showDetails && (
        <div className="mt-2 text-center">
          <span
            className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${color}15`,
              color: color,
            }}
          >
            {band}
          </span>
        </div>
      )}
    </div>
  );
};

