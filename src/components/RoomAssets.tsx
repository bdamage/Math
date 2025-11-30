import React from 'react';
import { getSprite } from '../config/assetMapping';

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
  // New prop to force a specific sprite avatar
  variant?: 'boy' | 'girl'; 
}

// --- Colors & Styles ---
// Toca Boca inspired palette - Vibrant and Playful
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
    purple: '#7209B7',
  }
};

// --- Avatar Component ---
export const Avatar: React.FC<AvatarProps> = ({ skinColor, hairStyle, hairColor, outfit, accessory, className, variant }) => {
  
  // Check for sprite variant
  if (variant) {
    const spriteId = variant === 'boy' ? 'avatar_boy' : 'avatar_girl';
    const sprite = getSprite(spriteId);
    if (sprite) {
      return (
        <div
          className={className}
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src={sprite.sheet}
            alt={variant}
            style={{
              position: 'absolute',
              maxWidth: 'none',
              width: `${(sprite.sheetWidth / sprite.width) * 100}%`,
              height: `${(sprite.sheetHeight / sprite.height) * 100}%`,
              left: `-${(sprite.x / sprite.width) * 100}%`,
              top: `-${(sprite.y / sprite.height) * 100}%`,
              objectFit: 'fill'
            }}
          />
        </div>
      );
    }
  }

  const Defs = () => (
    <defs>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
        <feOffset in="blur" dx="1" dy="2" result="offsetBlur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="offsetBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={skinColor} style={{ stopOpacity: 1 }} />
        <stop offset="100%" stopColor={skinColor} style={{ stopOpacity: 1 }} /> 
        {/* Could add subtle shading here if we had a darker variant calculated */}
      </linearGradient>
    </defs>
  );

  const Skin = () => (
    <g filter="url(#softShadow)">
      {/* Legs */}
      <path d="M38 70 L38 92 Q38 95 41 95 L44 95 Q47 95 47 92 L47 70" fill={skinColor} />
      <path d="M53 70 L53 92 Q53 95 56 95 L59 95 Q62 95 62 92 L62 70" fill={skinColor} />
      
      {/* Arms - slightly curved for natural look */}
      <path d="M25 52 Q 15 60 12 70" stroke={skinColor} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M75 52 Q 85 60 88 70" stroke={skinColor} strokeWidth="7" strokeLinecap="round" fill="none" />
      
      {/* Head */}
      <ellipse cx="50" cy="32" rx="20" ry="22" fill={skinColor} />
      {/* Ears */}
      <circle cx="30" cy="32" r="4" fill={skinColor} />
      <circle cx="70" cy="32" r="4" fill={skinColor} />
    </g>
  );

  const Face = () => (
    <g>
      {/* Eyes */}
      <ellipse cx="43" cy="32" rx="2.5" ry="3.5" fill="#333" />
      <ellipse cx="57" cy="32" rx="2.5" ry="3.5" fill="#333" />
      {/* Eye highlights */}
      <circle cx="44" cy="31" r="1" fill="white" opacity="0.7" />
      <circle cx="58" cy="31" r="1" fill="white" opacity="0.7" />
      
      {/* Cheeks */}
      <circle cx="38" cy="38" r="3.5" fill="#FF9999" opacity="0.4" />
      <circle cx="62" cy="38" r="3.5" fill="#FF9999" opacity="0.4" />
      
      {/* Mouth - cute smile */}
      <path d="M46 40 Q 50 43 54 40" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Nose */}
      <path d="M50 35 Q 50 37 49 37" fill="none" stroke="#CCA585" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </g>
  );

  const Hair = () => {
    switch (hairStyle) {
      case 'pigtails':
        return (
          <g fill={hairColor} filter="url(#softShadow)">
            {/* Back hair */}
            <path d="M25 25 Q 15 35 20 50 Q 25 40 30 30" />
            <path d="M75 25 Q 85 35 80 50 Q 75 40 70 30" />
            {/* Main hair - Wider and lower to cover forehead */}
            <path d="M22 35 C 22 10, 78 10, 78 35 C 78 45, 72 45, 72 35 C 72 25, 60 25, 50 25 C 40 25, 28 25, 28 35 C 28 45, 22 45, 22 35 Z" />
            {/* Bangs - Filled shape now */}
            <path d="M30 25 Q 50 35 70 25 Q 60 32 50 32 Q 40 32 30 25 Z" />
            {/* Ties */}
            <circle cx="20" cy="38" r="3" fill={PALETTE.clothes.pink} />
            <circle cx="80" cy="38" r="3" fill={PALETTE.clothes.pink} />
          </g>
        );
      case 'spiky':
        return (
          <g fill={hairColor} filter="url(#softShadow)">
            {/* Main Spikes - Lower and wider */}
            <path d="M22 35 L 20 20 L 30 28 L 35 10 L 50 25 L 65 10 L 70 28 L 80 20 L 78 35 Q 50 42 22 35 Z" />
            {/* Sideburns */}
            <path d="M22 35 L 22 45 L 28 40 L 28 35 Z" />
            <path d="M78 35 L 78 45 L 72 40 L 72 35 Z" />
          </g>
        );
      case 'bob':
      default:
        return (
          <g fill={hairColor} filter="url(#softShadow)">
            {/* Main Bob - Wider and covers top better */}
            <path d="M24 50 L 24 25 Q 50 0 76 25 L 76 50 L 68 50 L 68 32 Q 50 26 32 32 L 32 50 Z" />
            {/* Bangs/Fringe detail */}
            <path d="M32 28 Q 50 35 68 28" fill="none" stroke={hairColor} strokeWidth="0" /> 
          </g>
        );
    }
  };

  const Outfit = () => {
    switch (outfit) {
      case 'dress':
        return (
          <g filter="url(#softShadow)">
            <path d="M32 50 L 20 85 Q 50 90 80 85 L 68 50 Q 50 55 32 50 Z" fill={PALETTE.clothes.pink} />
            <path d="M32 50 Q 50 55 68 50 L 68 45 Q 50 40 32 45 Z" fill={PALETTE.clothes.pink} />
            {/* Collar */}
            <path d="M40 48 Q 50 55 60 48" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
            {/* Polka dots */}
            <circle cx="40" cy="70" r="2" fill="white" opacity="0.6" />
            <circle cx="60" cy="70" r="2" fill="white" opacity="0.6" />
            <circle cx="50" cy="60" r="2" fill="white" opacity="0.6" />
          </g>
        );
      case 'overalls':
        return (
          <g filter="url(#softShadow)">
             {/* Shirt underneath */}
             <rect x="30" y="48" width="40" height="25" rx="4" fill="white" />
             {/* Overalls */}
             <rect x="32" y="55" width="36" height="25" rx="2" fill={PALETTE.clothes.blue} />
             {/* Straps */}
             <rect x="35" y="48" width="4" height="10" fill={PALETTE.clothes.blue} />
             <rect x="61" y="48" width="4" height="10" fill={PALETTE.clothes.blue} />
             {/* Pocket */}
             <path d="M42 62 L 58 62 L 56 72 L 44 72 Z" fill="#3A9CC0" />
             {/* Buttons */}
             <circle cx="37" cy="56" r="1.5" fill="#F4D35E" />
             <circle cx="63" cy="56" r="1.5" fill="#F4D35E" />
          </g>
        );
      case 'tshirt':
      default:
        return (
          <g filter="url(#softShadow)">
            <rect x="28" y="48" width="44" height="28" rx="4" fill={PALETTE.clothes.yellow} />
            {/* Stripes */}
            <rect x="28" y="58" width="44" height="4" fill="white" opacity="0.4" />
            <rect x="28" y="66" width="44" height="4" fill="white" opacity="0.4" />
            {/* Pants */}
            <path d="M32 75 L 32 90 L 46 90 L 46 75" fill="#333" />
            <path d="M54 75 L 54 90 L 68 90 L 68 75" fill="#333" />
          </g>
        );
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} style={{ overflow: 'visible' }}>
      <Defs />
      <Skin />
      <Outfit />
      <Face />
      <Hair />
      {accessory === 'glasses' && (
        <g stroke="#333" strokeWidth="1.5" fill="none" filter="url(#softShadow)">
          <circle cx="43" cy="32" r="7" stroke="black" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" />
          <circle cx="57" cy="32" r="7" stroke="black" strokeWidth="1.5" fill="rgba(255,255,255,0.2)" />
          <line x1="50" y1="32" x2="50" y2="32" strokeWidth="2" /> {/* Bridge */}
          <path d="M36 32 L 28 30" />
          <path d="M64 32 L 72 30" />
        </g>
      )}
    </svg>
  );
};

// --- Furniture & Items ---
export const RoomItem: React.FC<RoomAssetProps> = ({ id, className, style }) => {
  const sprite = getSprite(id);

  if (sprite) {
    return (
      <div
        className={className}
        style={{
          ...style,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={sprite.sheet}
          alt={id}
          style={{
            position: 'absolute',
            maxWidth: 'none', // Prevent max-width constraints
            width: `${(sprite.sheetWidth / sprite.width) * 100}%`,
            height: `${(sprite.sheetHeight / sprite.height) * 100}%`,
            left: `-${(sprite.x / sprite.width) * 100}%`, // Use left instead of margin for absolute positioning
            top: `-${(sprite.y / sprite.height) * 100}%`,
            objectFit: 'fill' // Ensure the sheet stretches if dimensions don't match aspect ratio exactly (though we set w/h)
          }}
        />
      </div>
    );
  }

  // Fallback to SVG if no sprite found
  const FURNITURE_STYLE = {
    outline: '#2C1810', // Dark brown outline
    strokeWidth: 2,
    wood: '#C18E58',
    woodDark: '#A07242',
    woodLight: '#DDB685',
    teal: '#458F87',
    tealDark: '#326B65',
    blue: '#93C5D3',
    blueDark: '#76A5B3',
    white: '#FDFBF7',
  };

  const Defs = () => (
    <defs>
      <filter id="itemShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
        <feOffset in="blur" dx="1" dy="2" result="offsetBlur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.2"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode in="offsetBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38BDF8" />
        <stop offset="100%" stopColor="#0EA5E9" />
      </linearGradient>
    </defs>
  );

  const renderContent = () => {
    const { outline, strokeWidth, wood, woodDark, woodLight, teal, tealDark, blue, blueDark, white } = FURNITURE_STYLE;

    switch (id) {
      case 'bed':
        return (
          <g filter="url(#itemShadow)">
             {/* Headboard */}
             <path d="M15 30 L 15 70 L 10 70 L 10 25 Q 10 20 15 20 L 85 20 Q 90 20 90 25 L 90 70 L 85 70 L 85 30 Z" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <rect x="20" y="25" width="60" height="20" rx="2" fill={woodDark} opacity="0.3" />
             {/* Footboard/Frame */}
             <path d="M10 60 L 90 60 L 90 85 Q 90 90 85 90 L 85 95 L 80 95 L 80 90 L 20 90 L 20 95 L 15 95 L 15 90 Q 10 90 10 85 Z" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Mattress/Bedding */}
             <path d="M12 60 L 88 60 L 88 80 Q 88 85 83 85 L 17 85 Q 12 85 12 80 Z" fill={blue} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M12 65 L 88 65" stroke={blueDark} strokeWidth="1" fill="none" />
             {/* Pillow */}
             <rect x="25" y="50" width="50" height="15" rx="3" fill={white} stroke={outline} strokeWidth={strokeWidth} />
          </g>
        );
      case 'sofa':
        return (
          <g filter="url(#itemShadow)">
             {/* Legs */}
             <path d="M20 80 L 20 90 Q 20 95 22 95 L 25 95 L 25 80" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M75 80 L 75 95 L 78 95 Q 80 95 80 90 L 80 80" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Backrest */}
             <rect x="15" y="35" width="70" height="40" rx="5" fill={teal} stroke={outline} strokeWidth={strokeWidth} />
             {/* Buttons */}
             <circle cx="35" cy="50" r="2" fill={tealDark} />
             <circle cx="65" cy="50" r="2" fill={tealDark} />
             {/* Armrests */}
             <path d="M10 55 L 20 55 L 20 80 L 10 80 Q 5 80 5 75 L 5 60 Q 5 55 10 55 Z" fill={teal} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M80 55 L 90 55 Q 95 55 95 60 L 95 75 Q 95 80 90 80 L 80 80 Z" fill={teal} stroke={outline} strokeWidth={strokeWidth} />
             {/* Seat Cushions */}
             <rect x="20" y="65" width="30" height="15" rx="2" fill={teal} stroke={outline} strokeWidth={strokeWidth} />
             <rect x="50" y="65" width="30" height="15" rx="2" fill={teal} stroke={outline} strokeWidth={strokeWidth} />
          </g>
        );
      case 'wardrobe':
        return (
          <g filter="url(#itemShadow)">
             {/* Main Body */}
             <rect x="20" y="15" width="60" height="80" rx="2" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Top Cornice */}
             <rect x="18" y="15" width="64" height="5" rx="1" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Doors */}
             <rect x="22" y="22" width="27" height="50" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <rect x="51" y="22" width="27" height="50" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             {/* Knobs */}
             <circle cx="45" cy="47" r="2" fill={woodDark} stroke={outline} strokeWidth={1} />
             <circle cx="55" cy="47" r="2" fill={woodDark} stroke={outline} strokeWidth={1} />
             {/* Drawers */}
             <rect x="22" y="75" width="27" height="15" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <rect x="51" y="75" width="27" height="15" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <circle cx="35.5" cy="82.5" r="2" fill={woodDark} />
             <circle cx="64.5" cy="82.5" r="2" fill={woodDark} />
             {/* Legs */}
             <path d="M22 95 L 22 98 L 26 98 L 26 95" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M74 95 L 74 98 L 78 98 L 78 95" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
          </g>
        );
      case 'shelf':
        return (
          <g filter="url(#itemShadow)">
             {/* Vertical Supports */}
             <rect x="25" y="20" width="5" height="60" rx="2" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <rect x="70" y="20" width="5" height="60" rx="2" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Shelves */}
             <path d="M15 35 L 85 35 L 85 40 Q 85 42 80 42 L 20 42 Q 15 42 15 40 Z" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M15 65 L 85 65 L 85 70 Q 85 72 80 72 L 20 72 Q 15 72 15 70 Z" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             {/* Brackets */}
             <path d="M25 42 L 30 50 L 30 42" fill={wood} stroke={outline} strokeWidth={1} />
             <path d="M75 42 L 70 50 L 70 42" fill={wood} stroke={outline} strokeWidth={1} />
          </g>
        );
      case 'table':
        return (
          <g filter="url(#itemShadow)">
             {/* Legs */}
             <path d="M30 60 L 25 90 Q 24 92 26 92 L 30 92 L 35 60" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M70 60 L 75 90 Q 76 92 74 92 L 70 92 L 65 60" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Top */}
             <ellipse cx="50" cy="55" rx="35" ry="10" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M15 55 Q 15 65 50 65 Q 85 65 85 55" fill="none" stroke={outline} strokeWidth={strokeWidth} />
             <path d="M15 55 L 15 60 Q 15 70 50 70 Q 85 70 85 60 L 85 55" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
          </g>
        );
      case 'nightstand':
        return (
          <g filter="url(#itemShadow)">
             {/* Body */}
             <rect x="30" y="50" width="40" height="40" rx="2" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Top */}
             <rect x="28" y="48" width="44" height="5" rx="1" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             {/* Drawer */}
             <rect x="32" y="55" width="36" height="12" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             <circle cx="50" cy="61" r="2" fill={woodDark} />
             {/* Open Shelf */}
             <rect x="32" y="70" width="36" height="15" fill={woodDark} opacity="0.5" />
             {/* Legs */}
             <path d="M30 90 L 30 95 L 34 95 L 34 90" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M66 90 L 66 95 L 70 95 L 70 90" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
          </g>
        );
      case 'chair':
        return (
          <g filter="url(#itemShadow)">
             {/* Back Legs/Backrest Frame */}
             <path d="M35 30 L 35 90" fill="none" stroke={wood} strokeWidth="4" strokeLinecap="round" />
             <path d="M65 30 L 65 90" fill="none" stroke={wood} strokeWidth="4" strokeLinecap="round" />
             <path d="M35 30 Q 50 25 65 30" fill="none" stroke={wood} strokeWidth="4" strokeLinecap="round" />
             {/* Slats */}
             <path d="M42 32 L 40 60" fill="none" stroke={wood} strokeWidth="3" />
             <path d="M50 32 L 50 60" fill="none" stroke={wood} strokeWidth="3" />
             <path d="M58 32 L 60 60" fill="none" stroke={wood} strokeWidth="3" />
             {/* Seat */}
             <ellipse cx="50" cy="60" rx="20" ry="8" fill={woodLight} stroke={outline} strokeWidth={strokeWidth} />
             {/* Front Legs */}
             <path d="M38 65 L 38 90" fill="none" stroke={wood} strokeWidth="4" strokeLinecap="round" />
             <path d="M62 65 L 62 90" fill="none" stroke={wood} strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'lamp':
        return (
          <g filter="url(#itemShadow)">
             {/* Base */}
             <ellipse cx="50" cy="85" rx="10" ry="5" fill={woodDark} stroke={outline} strokeWidth={strokeWidth} />
             {/* Stem */}
             <rect x="48" y="60" width="4" height="25" fill={wood} stroke={outline} strokeWidth={strokeWidth} />
             {/* Shade */}
             <path d="M35 60 L 65 60 L 58 35 L 42 35 Z" fill={white} stroke={outline} strokeWidth={strokeWidth} />
             <path d="M35 60 Q 50 65 65 60" fill="none" stroke={outline} strokeWidth={1} opacity="0.5" />
          </g>
        );
      case 'plant':
        return (
          <g filter="url(#itemShadow)">
            {/* Pot */}
            <path d="M40 70 L 60 70 L 58 90 L 42 90 Z" fill="#D65A31" />
            <rect x="38" y="70" width="24" height="4" fill="#9A3412" rx="1" />
            {/* Leaves */}
            <path d="M50 70 Q 30 40 50 20 Q 70 40 50 70" fill="#4895EF" />
            <path d="M50 70 Q 20 50 30 30" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 70 Q 80 50 70 30" fill="none" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
            <path d="M50 70 Q 50 40 50 25" fill="none" stroke="#34D399" strokeWidth="6" strokeLinecap="round" />
            {/* Leaf details */}
            <circle cx="30" cy="30" r="10" fill="#10B981" />
            <circle cx="70" cy="30" r="10" fill="#10B981" />
            <circle cx="50" cy="25" r="10" fill="#34D399" />
          </g>
        );
      case 'desk':
        return (
          <g filter="url(#itemShadow)">
            {/* Legs */}
            <rect x="15" y="50" width="6" height="40" fill="#6F421B" rx="2" />
            <rect x="79" y="50" width="6" height="40" fill="#6F421B" rx="2" />
            {/* Top */}
            <rect x="10" y="40" width="80" height="12" fill="#8D5524" rx="2" />
            <rect x="10" y="40" width="80" height="6" fill="#A06332" rx="2" /> {/* Highlight */}
            {/* Drawers */}
            <rect x="60" y="52" width="25" height="25" fill="#8D5524" rx="2" />
            <rect x="62" y="54" width="21" height="9" fill="#6F421B" rx="1" opacity="0.3" />
            <rect x="62" y="66" width="21" height="9" fill="#6F421B" rx="1" opacity="0.3" />
            <circle cx="72.5" cy="58.5" r="1.5" fill="#F4D35E" />
            <circle cx="72.5" cy="70.5" r="1.5" fill="#F4D35E" />
          </g>
        );
      case 'rug':
        return (
          <g>
            <ellipse cx="50" cy="50" rx="45" ry="25" fill="#FF99C8" />
            <ellipse cx="50" cy="50" rx="35" ry="18" fill="none" stroke="#F72585" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="8" fill="#F72585" opacity="0.5" />
          </g>
        );
      case 'poster':
        return (
          <g filter="url(#itemShadow)">
            <rect x="20" y="20" width="60" height="80" fill="#FFF" stroke="#333" strokeWidth="2" />
            {/* Art inside */}
            <rect x="25" y="25" width="50" height="50" fill="#E0F2FE" />
            <circle cx="50" cy="50" r="15" fill="#F4D35E" />
            <path d="M25 75 L 35 60 L 45 75 L 55 55 L 75 75" fill="#4ADE80" />
            {/* Hanging string */}
            <path d="M50 20 L 50 10 L 45 15 M 50 10 L 55 15" stroke="#333" strokeWidth="1" />
            <circle cx="50" cy="10" r="2" fill="#333" />
          </g>
        );
      case 'cat':
        return (
          <g filter="url(#itemShadow)">
            {/* Tail */}
            <path d="M70 80 Q 90 70 85 50" stroke="#333" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Body */}
            <path d="M30 70 Q 50 60 70 70 L 70 90 L 30 90 Z" fill="#333" />
            {/* Head */}
            <circle cx="50" cy="60" r="18" fill="#333" />
            {/* Ears */}
            <path d="M35 50 L 30 35 L 45 45" fill="#333" />
            <path d="M65 50 L 70 35 L 55 45" fill="#333" />
            {/* Face */}
            <circle cx="44" cy="60" r="2" fill="#FFF" />
            <circle cx="56" cy="60" r="2" fill="#FFF" />
            <path d="M48 64 L 50 66 L 52 64" stroke="#FFF" strokeWidth="1" fill="none" />
            {/* Whiskers */}
            <path d="M35 62 L 25 60 M 35 64 L 25 66" stroke="#FFF" strokeWidth="0.5" />
            <path d="M65 62 L 75 60 M 65 64 L 75 66" stroke="#FFF" strokeWidth="0.5" />
          </g>
        );
      case 'dog':
        return (
          <g filter="url(#itemShadow)">
            {/* Body */}
            <ellipse cx="50" cy="75" rx="25" ry="15" fill="#D97706" />
            {/* Head */}
            <circle cx="50" cy="55" r="18" fill="#D97706" />
            {/* Ears */}
            <path d="M35 50 Q 25 60 30 70" stroke="#D97706" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M65 50 Q 75 60 70 70" stroke="#D97706" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Face */}
            <circle cx="44" cy="52" r="2" fill="#333" />
            <circle cx="56" cy="52" r="2" fill="#333" />
            <ellipse cx="50" cy="58" rx="4" ry="3" fill="#333" />
            <path d="M50 61 L 50 65" stroke="#333" strokeWidth="1" />
            {/* Spot */}
            <circle cx="60" cy="75" r="5" fill="#92400E" opacity="0.6" />
          </g>
        );
      case 'fish':
        return (
          <g filter="url(#itemShadow)">
            {/* Bowl */}
            <path d="M30 40 Q 20 60 30 80 Q 50 90 70 80 Q 80 60 70 40 Q 50 30 30 40" fill="#A5F3FC" opacity="0.6" stroke="#22D3EE" strokeWidth="1" />
            <ellipse cx="50" cy="40" rx="20" ry="5" fill="#CFFAFE" opacity="0.8" />
            {/* Water level */}
            <path d="M32 45 Q 50 50 68 45" stroke="#22D3EE" strokeWidth="1" fill="none" />
            {/* Fish */}
            <path d="M45 60 Q 55 55 60 60 Q 55 65 45 60" fill="#F97316" />
            <path d="M60 60 L 65 55 L 65 65 Z" fill="#F97316" />
            <circle cx="48" cy="59" r="1" fill="black" />
          </g>
        );
      case 'computer':
        return (
          <g filter="url(#itemShadow)">
            {/* Monitor Stand */}
            <rect x="45" y="70" width="10" height="10" fill="#94A3B8" />
            <rect x="35" y="80" width="30" height="4" fill="#64748B" rx="1" />
            {/* Screen Bezel */}
            <rect x="20" y="30" width="60" height="40" fill="#334155" rx="2" />
            {/* Screen */}
            <rect x="24" y="34" width="52" height="32" fill="url(#screenGradient)" />
            {/* Code lines */}
            <rect x="28" y="40" width="20" height="2" fill="white" opacity="0.5" />
            <rect x="28" y="44" width="30" height="2" fill="white" opacity="0.5" />
            <rect x="28" y="48" width="25" height="2" fill="white" opacity="0.5" />
          </g>
        );
      case 'tablet':
        return (
          <g filter="url(#itemShadow)">
            <rect x="30" y="20" width="40" height="60" rx="4" fill="#333" />
            <rect x="34" y="24" width="32" height="52" rx="1" fill="url(#screenGradient)" />
            <circle cx="50" cy="75" r="2" fill="#555" />
            {/* App Icons */}
            <rect x="38" y="30" width="8" height="8" rx="2" fill="#F472B6" />
            <rect x="54" y="30" width="8" height="8" rx="2" fill="#4ADE80" />
            <rect x="38" y="42" width="8" height="8" rx="2" fill="#FACC15" />
            <rect x="54" y="42" width="8" height="8" rx="2" fill="#60A5FA" />
          </g>
        );
      case 'clock':
        return (
          <g filter="url(#itemShadow)">
            <circle cx="50" cy="50" r="25" fill="white" stroke="#333" strokeWidth="3" />
            <circle cx="50" cy="50" r="2" fill="#333" />
            {/* Hands */}
            <line x1="50" y1="50" x2="50" y2="35" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="50" x2="60" y2="50" stroke="#333" strokeWidth="2" strokeLinecap="round" />
            {/* Ticks */}
            <line x1="50" y1="30" x2="50" y2="28" stroke="#999" strokeWidth="2" />
            <line x1="70" y1="50" x2="72" y2="50" stroke="#999" strokeWidth="2" />
            <line x1="50" y1="70" x2="50" y2="72" stroke="#999" strokeWidth="2" />
            <line x1="30" y1="50" x2="28" y2="50" stroke="#999" strokeWidth="2" />
          </g>
        );
      case 'trophy':
        return (
          <g filter="url(#itemShadow)">
            <path d="M35 35 L65 35 L58 55 L42 55 Z" fill="url(#goldGradient)" />
            <path d="M45 55 L45 65 L55 65 L55 55" fill="#F59E0B" />
            <rect x="35" y="65" width="30" height="5" fill="#78350F" rx="1" />
            {/* Handles */}
            <path d="M35 40 C 25 40, 25 50, 38 52" fill="none" stroke="#F59E0B" strokeWidth="3" />
            <path d="M65 40 C 75 40, 75 50, 62 52" fill="none" stroke="#F59E0B" strokeWidth="3" />
            {/* Shine */}
            <path d="M40 35 L 45 55 L 50 35" fill="white" opacity="0.3" />
          </g>
        );
      case 'globe':
        return (
          <g filter="url(#itemShadow)">
            <circle cx="50" cy="45" r="20" fill="#38BDF8" />
            {/* Continents */}
            <path d="M40 35 Q 45 30 50 35 Q 55 40 50 45 Q 45 50 40 45 Z" fill="#4ADE80" />
            <path d="M60 40 Q 65 35 68 40 Q 65 50 60 45 Z" fill="#4ADE80" />
            {/* Stand */}
            <path d="M30 45 A 22 22 0 0 0 70 45" fill="none" stroke="#94A3B8" strokeWidth="3" />
            <rect x="48" y="67" width="4" height="10" fill="#64748B" />
            <rect x="40" y="77" width="20" height="4" fill="#475569" rx="2" />
          </g>
        );
      default:
        return <rect x="25" y="25" width="50" height="50" fill="#ccc" rx="5" />;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      <Defs />
      {renderContent()}
    </svg>
  );
};

// --- Backgrounds ---
export const RoomBackground: React.FC<{ variant: string; className?: string }> = ({ variant, className }) => {
  const colors = {
    default: { wall: '#E0F2FE', floor: '#BAE6FD', windowFrame: '#FFF', outside: '#7DD3FC' },
    pink: { wall: '#FCE7F3', floor: '#FBCFE8', windowFrame: '#FFF', outside: '#BAE6FD' },
    green: { wall: '#DCFCE7', floor: '#BBF7D0', windowFrame: '#FFF', outside: '#7DD3FC' },
    space: { wall: '#1E293B', floor: '#334155', windowFrame: '#475569', outside: '#0F172A' },
  };
  
  const theme = colors[variant as keyof typeof colors] || colors.default;

  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
           <pattern id="wallPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="black" opacity="0.03" />
           </pattern>
           <pattern id="floorPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 20 L 40 0" stroke="black" strokeWidth="1" opacity="0.05" />
           </pattern>
           <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.outside} />
              <stop offset="100%" stopColor="white" stopOpacity="0.5" />
           </linearGradient>
        </defs>
        
        {/* Wall */}
        <rect x="0" y="0" width="100%" height="70%" fill={theme.wall} />
        <rect x="0" y="0" width="100%" height="70%" fill="url(#wallPattern)" />
        
        {/* Floor */}
        <rect x="0" y="70%" width="100%" height="30%" fill={theme.floor} />
        <rect x="0" y="70%" width="100%" height="30%" fill="url(#floorPattern)" />
        
        {/* Baseboard */}
        <rect x="0" y="68%" width="100%" height="2%" fill="white" opacity="0.6" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="black" strokeOpacity="0.1" strokeWidth="1" />

        {/* Window (Centered on wall) */}
        {variant !== 'space' && (
             <svg x="20%" y="15%" width="25%" height="40%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Frame */}
                <rect x="0" y="0" width="100" height="100" fill={theme.windowFrame} rx="2" stroke="#CBD5E1" strokeWidth="2" />
                {/* Glass/Outside */}
                <rect x="5" y="5" width="90" height="90" fill="url(#skyGradient)" />
                {/* Clouds */}
                <circle cx="20" cy="30" r="10" fill="white" opacity="0.6" />
                <circle cx="40" cy="20" r="15" fill="white" opacity="0.6" />
                <circle cx="70" cy="35" r="12" fill="white" opacity="0.6" />
                {/* Pane Dividers */}
                <rect x="48" y="5" width="4" height="90" fill={theme.windowFrame} />
                <rect x="5" y="48" width="90" height="4" fill={theme.windowFrame} />
                {/* Reflection */}
                <path d="M10 80 L 30 60" stroke="white" strokeWidth="2" opacity="0.3" />
                <path d="M15 85 L 35 65" stroke="white" strokeWidth="2" opacity="0.3" />
             </svg>
        )}
        
        {/* Space Window (Porthole) */}
        {variant === 'space' && (
             <svg x="35%" y="15%" width="30%" height="40%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <circle cx="50" cy="50" r="45" fill="#334155" stroke="#475569" strokeWidth="4" />
                <circle cx="50" cy="50" r="40" fill="#0F172A" />
                {/* Stars */}
                <circle cx="30" cy="30" r="1" fill="white" />
                <circle cx="70" cy="40" r="1" fill="white" />
                <circle cx="50" cy="70" r="1" fill="white" />
                <circle cx="20" cy="60" r="0.5" fill="white" />
                <circle cx="80" cy="20" r="0.5" fill="white" />
                {/* Planet */}
                <circle cx="70" cy="70" r="10" fill="#6366F1" opacity="0.8" />
                {/* Reflection */}
                <path d="M30 30 A 30 30 0 0 0 30 70" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
             </svg>
        )}
      </svg>
    </div>
  );
};
