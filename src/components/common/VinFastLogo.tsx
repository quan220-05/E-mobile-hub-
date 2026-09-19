import React from 'react';

interface VinFastLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
  showSubtitle?: boolean;
}

export const VinFastLogo: React.FC<VinFastLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* VinFast Stylized V Logo */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-1.5 shadow-md shadow-blue-900/20 ring-1 ring-white/20`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
        >
          {/* VinFast Iconic V Wings */}
          <path
            d="M50 82L15 28C15 28 32 38 50 48C68 38 85 28 85 28L50 82Z"
            fill="url(#vinfast-metal)"
          />
          <path
            d="M50 70L24 32C32 37 42 42 50 42C58 42 68 37 76 32L50 70Z"
            fill="#00A651"
            opacity="0.9"
          />
          <path
            d="M50 90L8 24C8 24 30 36 50 48C70 36 92 24 92 24L50 90Z"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="vinfast-metal" x1="15" y1="28" x2="85" y2="82" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-wider text-slate-900 dark:text-white ${titleSizes[size]}`}>
            VINFAST
          </span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white tracking-widest uppercase">
            E-HUB
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-medium tracking-tight text-slate-500 dark:text-slate-400">
            Khu đô thị ĐHQG-HCM
          </span>
        )}
      </div>
    </div>
  );
};
