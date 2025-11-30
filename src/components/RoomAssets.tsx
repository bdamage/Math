import React from 'react';

// --- Types ---
export type AssetCategory = 'furniture' | 'decoration' | 'pet' | 'electronics' | 'background' | 'outfit' | 'hair' | 'accessory';

export interface RoomAssetProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface AvatarProps {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessory?: string;
  className?: string;
}

// --- Colors & Styles ---
// Toca Boca inspired palette
const PALETTE = {
  skin: {
    light: '#FFDFC4',
    medium: '#E0AC69',
    dark: '#8D5524',
  },
  hair: {
    blonde: '#FCE786',
    brown: '#8D5524',
    black: '#2D2D2D',
    red: '#D65A31',
    pink: '#FF99C8',
  },
  clothes: {
    blue: '#4CC9F0',
    pink: '#F72585',
    green: '#4895EF',
    yellow: '#F4D35E',
  }
};

// --- Avatar Component ---
export const Avatar: React.FC<AvatarProps> = ({ skinColor, hairStyle, hairColor, outfit, accessory, className }) => {
  // Simple "Toca" style avatar: big head, simple body
  
  const Skin = () => (
    <g>
      {/* Legs */}
      <path d="M35 70 L35 95 L45 95 L45 70" fill={skinColor} stroke="none" />
      <path d="M55 70 L55 95 L65 95 L65 70" fill={skinColor} stroke="none" />
      {/* Arms */}
      <path d="M20 55 L10 70" stroke={skinColor} strokeWidth="8" strokeLinecap="round" />
      <path d="M80 55 L90 70" stroke={skinColor} strokeWidth="8" strokeLinecap="round" />
      {/* Head */}
      <circle cx="50" cy="30" r="22" fill={skinColor} />
    </g>
  );

  const Face = () => (
    <g>
      <circle cx="42" cy="28" r="2" fill="#333" />
      <circle cx="58" cy="28" r="2" fill="#333" />
      <path d="M45 38 Q 50 42 55 38" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="38" cy="32" r="3" fill="#FF9999" opacity="0.4" />
      <circle cx="62" cy="32" r="3" fill="#FF9999" opacity="0.4" />
    </g>
  );

  const Hair = () => {
    switch (hairStyle) {
      case 'pigtails':
        return (
          <g fill={hairColor}>
            <circle cx="25" cy="25" r="10" />
            <circle cx="75" cy="25" r="10" />
            <path d="M28 10 Q 50 0 72 10 L 75 35 Q 50 25 25 35 Z" />
          </g>
        );
      case 'spiky':
        return (
          <path d="M25 25 L 30 10 L 40 20 L 50 5 L 60 20 L 70 10 L 75 25 Q 50 35 25 25" fill={hairColor} />
        );
      case 'bob':
      default:
        return (
          <path d="M25 45 L 25 20 Q 50 0 75 20 L 75 45 L 70 45 L 70 25 Q 50 15 30 25 L 30 45 Z" fill={hairColor} />
        );
    }
  };

  const Outfit = () => {
    switch (outfit) {
      case 'dress':
        return <path d="M30 50 L 20 80 L 80 80 L 70 50 Z" fill={PALETTE.clothes.pink} />;
      case 'overalls':
        return (
          <g>
             <rect x="30" y="50" width="40" height="30" rx="5" fill={PALETTE.clothes.blue} />
             <rect x="35" y="55" width="30" height="15" rx="2" fill="#FFF" opacity="0.3" />
          </g>
        );
      case 'tshirt':
      default:
        return (
          <g>
            <rect x="30" y="50" width="40" height="25" rx="4" fill={PALETTE.clothes.yellow} />
            <path d="M30 75 L 30 90 L 45 90 L 45 75" fill="#333" />
            <path d="M55 75 L 55 90 L 70 90 L 70 75" fill="#333" />
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <Skin />
      <Outfit />
      <Face />
      <Hair />
      {accessory === 'glasses' && (
        <g stroke="#333" strokeWidth="1.5" fill="none">
          <circle cx="42" cy="28" r="6" />
          <circle cx="58" cy="28" r="6" />
          <line x1="48" y1="28" x2="52" y2="28" />
        </g>
      )}
    </svg>
  );
};

// --- Furniture & Items ---
export const RoomItem: React.FC<RoomAssetProps> = ({ id, className, style }) => {
  const renderContent = () => {
    switch (id) {
      case 'lamp':
        return (
          <g>
            <rect x="45" y="50" width="10" height="40" fill="#8D5524" />
            <path d="M30 50 L 70 50 L 60 20 L 40 20 Z" fill="#F4D35E" />
            <ellipse cx="50" cy="90" rx="15" ry="5" fill="#8D5524" />
          </g>
        );
      case 'plant':
        return (
          <g>
            <path d="M50 70 Q 30 40 50 20 Q 70 40 50 70" fill="#4895EF" />
            <path d="M50 70 Q 20 50 30 30" fill="none" stroke="#10B981" strokeWidth="4" />
            <path d="M50 70 Q 80 50 70 30" fill="none" stroke="#10B981" strokeWidth="4" />
            <circle cx="30" cy="30" r="8" fill="#10B981" />
            <circle cx="70" cy="30" r="8" fill="#10B981" />
            <path d="M40 70 L 60 70 L 55 90 L 45 90 Z" fill="#D65A31" />
          </g>
        );
      case 'desk':
        return (
          <g>
            <rect x="10" y="40" width="80" height="10" fill="#8D5524" rx="2" />
            <rect x="15" y="50" width="5" height="40" fill="#6F421B" />
            <rect x="80" y="50" width="5" height="40" fill="#6F421B" />
            <rect x="60" y="50" width="20" height="20" fill="#6F421B" />
            <circle cx="70" cy="60" r="2" fill="#F4D35E" />
          </g>
        );
      case 'chair':
        return (
          <g>
            <rect x="30" y="60" width="40" height="5" fill="#D65A31" />
            <rect x="35" y="65" width="5" height="25" fill="#8D5524" />
            <rect x="60" y="65" width="5" height="25" fill="#8D5524" />
            <path d="M35 60 L 35 30 Q 50 25 65 30 L 65 60" fill="#D65A31" />
          </g>
        );
      case 'rug':
        return (
          <ellipse cx="50" cy="50" rx="45" ry="25" fill="#FF99C8" stroke="#F72585" strokeWidth="2" />
        );
      case 'poster':
        return (
          <g>
            <rect x="20" y="20" width="60" height="80" fill="#FFF" stroke="#333" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="#F4D35E" />
            <path d="M50 50 L 60 60" stroke="#333" strokeWidth="2" />
          </g>
        );
      case 'cat':
        return (
          <g>
            <path d="M30 70 Q 50 60 70 70 L 70 90 L 30 90 Z" fill="#333" />
            <circle cx="50" cy="60" r="15" fill="#333" />
            <path d="M40 50 L 35 40 L 45 45" fill="#333" />
            <path d="M60 50 L 65 40 L 55 45" fill="#333" />
            <circle cx="45" cy="60" r="2" fill="#FFF" />
            <circle cx="55" cy="60" r="2" fill="#FFF" />
          </g>
        );
      default:
        return <rect x="25" y="25" width="50" height="50" fill="#ccc" rx="5" />;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      {renderContent()}
    </svg>
  );
};

// --- Backgrounds ---
export const RoomBackground: React.FC<{ variant: string; className?: string }> = ({ variant, className }) => {
  const colors = {
    default: { wall: '#E0F2FE', floor: '#BAE6FD' },
    pink: { wall: '#FCE7F3', floor: '#FBCFE8' },
    green: { wall: '#DCFCE7', floor: '#BBF7D0' },
    space: { wall: '#1E293B', floor: '#334155' },
  };
  
  const theme = colors[variant as keyof typeof colors] || colors.default;

  return (
    <div className={`absolute inset-0 -z-10 flex flex-col ${className}`}>
      <div className="flex-1" style={{ backgroundColor: theme.wall }}>
        {/* Wall pattern */}
        {variant === 'space' && (
          <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        )}
      </div>
      <div className="h-1/3 border-t-4 border-black/5" style={{ backgroundColor: theme.floor }}>
        {/* Floor pattern */}
        <div className="w-full h-full opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
      </div>
    </div>
  );
};
