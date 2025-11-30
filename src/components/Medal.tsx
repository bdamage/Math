import React from 'react';

export type MedalVariant = 'star' | 'trophy' | 'crown' | 'target' | 'lightning' | 'book' | 'palette';
export type MedalTier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface MedalProps {
  variant: MedalVariant;
  tier?: MedalTier;
  unlocked: boolean;
  className?: string;
}

export const Medal: React.FC<MedalProps> = ({ variant, tier = 'gold', unlocked, className = '' }) => {
  // Base colors for the medal parts when unlocked
  const colors = {
    gold: {
      main: '#FCD34D', // amber-300
      shadow: '#F59E0B', // amber-500
      highlight: '#FEF3C7', // amber-100
      ribbon: '#EF4444', // red-500
    },
    silver: {
      main: '#E5E7EB', // gray-200
      shadow: '#9CA3AF', // gray-400
      highlight: '#F9FAFB', // gray-50
      ribbon: '#3B82F6', // blue-500
    },
    bronze: {
      main: '#FDBA74', // orange-300
      shadow: '#EA580C', // orange-600
      highlight: '#FFEDD5', // orange-100
      ribbon: '#10B981', // emerald-500
    },
    platinum: {
      main: '#E0F2FE', // sky-100
      shadow: '#7DD3FC', // sky-300
      highlight: '#F0F9FF', // sky-50
      ribbon: '#8B5CF6', // violet-500
    }
  };

  const theme = colors[tier];

  // If locked, override with greyscale values
  const fillMain = unlocked ? theme.main : '#E2E8F0'; // slate-200
  const fillShadow = unlocked ? theme.shadow : '#94A3B8'; // slate-400
  const fillHighlight = unlocked ? theme.highlight : '#F1F5F9'; // slate-100
  const fillRibbon = unlocked ? theme.ribbon : '#CBD5E1'; // slate-300

  // Common SVG parts
  const Ribbon = () => (
    <path d="M30 10 L30 45 L50 35 L70 45 L70 10 Z" fill={fillRibbon} stroke={fillShadow} strokeWidth="2" />
  );
  
  // We'll use a standard round medal shape for consistency, but change the inner icon
  const MedalBase = () => (
    <g>
      {/* Ribbon behind */}
      <path d="M35 0 L65 0 L65 40 L50 30 L35 40 Z" fill={fillRibbon} />
      
      {/* Outer Ring */}
      <circle cx="50" cy="50" r="35" fill={fillShadow} />
      {/* Inner Circle */}
      <circle cx="50" cy="50" r="30" fill={fillMain} />
      {/* Shine/Highlight */}
      <path d="M50 20 A 30 30 0 0 0 20 50 A 30 30 0 0 0 23 60 A 25 25 0 0 1 45 25 A 25 25 0 0 1 50 20" fill={fillHighlight} opacity="0.6" />
    </g>
  );

  const Icon = () => {
    switch (variant) {
      case 'star':
        return <path d="M50 35 L54 46 L66 46 L56 54 L60 66 L50 58 L40 66 L44 54 L34 46 L46 46 Z" fill={fillHighlight} stroke={fillShadow} strokeWidth="1.5" strokeLinejoin="round" />;
      case 'trophy':
        return <path d="M35 35 L65 35 L58 55 L42 55 Z M45 55 L45 60 L55 60 L55 55 M40 65 L60 65" fill={fillHighlight} stroke={fillShadow} strokeWidth="1.5" strokeLinejoin="round" />;
      case 'crown':
        return <path d="M35 45 L35 60 L65 60 L65 45 L57 50 L50 35 L43 50 Z" fill={fillHighlight} stroke={fillShadow} strokeWidth="1.5" strokeLinejoin="round" />;
      case 'lightning':
        return <path d="M55 30 L40 50 L50 50 L45 70 L60 50 L50 50 Z" fill={fillHighlight} stroke={fillShadow} strokeWidth="1.5" strokeLinejoin="round" />;
      case 'target':
        return (
          <g>
            <circle cx="50" cy="50" r="12" fill="none" stroke={fillHighlight} strokeWidth="2" />
            <circle cx="50" cy="50" r="6" fill={fillHighlight} />
          </g>
        );
      case 'book':
        return <path d="M35 40 L50 45 L65 40 L65 60 L50 65 L35 60 Z M50 45 L50 65" fill="none" stroke={fillHighlight} strokeWidth="2" strokeLinejoin="round" />;
      case 'palette':
        return <path d="M35 45 Q 35 35 50 35 Q 65 35 65 45 Q 65 65 50 65 Q 35 65 35 45" fill={fillHighlight} stroke={fillShadow} strokeWidth="1.5" />;
      default:
        return <circle cx="50" cy="50" r="10" fill={fillHighlight} />;
    }
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`w-20 h-20 drop-shadow-md transition-all duration-500 ${unlocked ? 'scale-100 rotate-0' : 'scale-95 opacity-80 grayscale'} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <MedalBase />
      <Icon />
    </svg>
  );
};
