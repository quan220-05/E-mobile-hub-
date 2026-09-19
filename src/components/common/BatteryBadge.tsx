import React from 'react';
import { Zap } from 'lucide-react';

interface BatteryBadgeProps {
  level: number;
  isCharging?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BatteryBadge: React.FC<BatteryBadgeProps> = ({
  level,
  isCharging = false,
  size = 'md',
  showText = true,
}) => {
  // Determine color threshold
  let colorClass = 'bg-emerald-500 text-emerald-700 dark:text-emerald-400';
  let barClass = 'bg-emerald-500';
  let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';

  if (level < 20) {
    colorClass = 'bg-rose-500 text-rose-700 dark:text-rose-400';
    barClass = 'bg-rose-500';
    badgeBg = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60';
  } else if (level < 50) {
    colorClass = 'bg-amber-500 text-amber-700 dark:text-amber-400';
    barClass = 'bg-amber-500';
    badgeBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${badgeBg} ${sizes[size]} select-none`}
      title={`Mức pin hiện tại: ${level}% ${isCharging ? '(Đang sạc)' : ''}`}
    >
      {/* Battery Graphic */}
      <div className="relative flex items-center">
        <div className="w-5 h-2.5 rounded-sm border border-slate-400 dark:border-slate-500 p-0.5 flex items-center">
          <div
            className={`h-full rounded-[1px] transition-all duration-300 ${barClass}`}
            style={{ width: `${Math.min(100, Math.max(8, level))}%` }}
          />
        </div>
        <div className="w-0.5 h-1 bg-slate-400 dark:border-slate-500 rounded-r-sm -ml-[0.5px]" />
      </div>

      {isCharging && (
        <Zap className="w-3 h-3 text-amber-500 animate-pulse fill-amber-500" />
      )}

      {showText && (
        <span className={colorClass}>
          {level}%
        </span>
      )}
    </div>
  );
};
