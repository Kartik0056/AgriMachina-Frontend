import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Tag, Package } from 'lucide-react';

// Common synonyms and aliases mapping to Lucide icon component names or emojis
const ICON_ALIASES = {
  // Machinery & Agro
  tractor: 'Tractor',
  droplets: 'Droplets',
  droplet: 'Droplets',
  sparkles: 'Sparkles',
  sparkle: 'Sparkles',
  scissors: 'Scissors',
  checkcircle: 'CheckCircle2',
  checkcircle2: 'CheckCircle2',
  check: 'CheckCircle2',
  zap: 'Zap',
  layers: 'Layers',
  layer: 'Layers',
  sprout: 'Sprout',
  wheat: 'Wheat',
  tree: 'Trees',
  trees: 'Trees',
  cog: 'Cog',
  cogs: 'Cog',
  settings: 'Settings',
  shield: 'ShieldCheck',
  shieldcheck: 'ShieldCheck',
  wrench: 'Wrench',
  hammer: 'Hammer',
  flame: 'Flame',
  sun: 'Sun',
  axe: 'Axe',

  // Spices, Food & Groceries
  spice: 'Utensils',
  spices: 'Utensils',
  masala: 'Utensils',
  grocery: 'ShoppingBag',
  groceries: 'ShoppingBag',
  food: 'Utensils',
  utensils: 'Utensils',
  cooking: 'CookingPot',
  leaf: 'Leaf',
  apple: 'Apple',
  carrot: 'Carrot',
  milk: 'Milk',
  coffee: 'Coffee',
  egg: 'Egg',
  fish: 'Fish',
  box: 'Package',
  boxes: 'Boxes',
  bag: 'ShoppingBag',
  store: 'Store',

  // Electronics & Appliances
  electronics: 'Cpu',
  electronic: 'Cpu',
  cpu: 'Cpu',
  chip: 'Cpu',
  tv: 'Tv',
  monitor: 'Tv',
  phone: 'Smartphone',
  smartphone: 'Smartphone',
  laptop: 'Laptop',
  tablet: 'Tablet',
  radio: 'Radio',
  camera: 'Camera',
  watch: 'Watch',
  battery: 'BatteryMedium',
  plug: 'PlugZap',
  fan: 'Fan',
  refrigerator: 'Refrigerator',
  headphones: 'Headphones',
  speaker: 'Speaker',

  // Fashion & Apparel
  fashion: 'Shirt',
  clothing: 'Shirt',
  shirt: 'Shirt',
  apparel: 'Shirt',
  dress: 'Shirt',
  gem: 'Gem',
  glasses: 'Glasses',
  footwear: 'Footprints',

  // Hardware, General & Commerce
  hardware: 'Wrench',
  tools: 'Wrench',
  package: 'Package',
  tag: 'Tag',
  truck: 'Truck',
  award: 'Award',
  star: 'Star',
  gift: 'Gift',
  cart: 'ShoppingCart',
  compass: 'Compass'
};

// Check if string contains emoji
const isEmojiString = (str) => {
  if (!str) return false;
  try {
    const emojiRegex = /\p{Extended_Pictographic}/u;
    return emojiRegex.test(str);
  } catch (e) {
    return str.charCodeAt(0) > 255;
  }
};

// Check if string is an image URL
const isImageUrl = (str) => {
  if (!str) return false;
  const s = str.trim().toLowerCase();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/images/') ||
    s.startsWith('data:image/') ||
    s.endsWith('.jpg') ||
    s.endsWith('.jpeg') ||
    s.endsWith('.png') ||
    s.endsWith('.webp') ||
    s.endsWith('.svg')
  );
};

// Formats PascalCase lookup name
const toPascalCase = (str) => {
  if (!str) return '';
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

/**
 * Universal CategoryIcon Component
 * Handles:
 * 1. Lucide icon names (e.g., 'Droplets', 'Sparkles', 'Scissors', 'Tractor', 'Cpu', 'Utensils')
 * 2. Emojis (e.g., '🌱', '🌶️', '🚜', '🌾', '💻', '🧂', '👕')
 * 3. Image URLs (e.g., '/images/machinery/power_weeder.jpg', 'https://...')
 * 4. Aliases and case-insensitive matching
 */
const CategoryIcon = ({
  icon,
  size = 20,
  color = 'currentColor',
  className = '',
  style = {},
  fallback = null
}) => {
  if (!icon) {
    return fallback || <Tag size={size} color={color} className={className} style={style} />;
  }

  const trimmed = typeof icon === 'string' ? icon.trim() : '';

  // 1. If it's an Image URL
  if (isImageUrl(trimmed)) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${size + 4}px`,
          height: `${size + 4}px`,
          flexShrink: 0,
          borderRadius: '6px',
          overflow: 'hidden',
          ...style
        }}
        className={className}
      >
        <img
          src={trimmed}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </span>
    );
  }

  // 2. If it is an Emoji
  if (isEmojiString(trimmed)) {
    return (
      <span
        style={{
          fontSize: `${size}px`,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          userSelect: 'none',
          ...style
        }}
        className={className}
      >
        {trimmed}
      </span>
    );
  }

  // 3. Lucide Icon lookup by alias or direct name
  const cleanKey = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
  const aliasTarget = ICON_ALIASES[cleanKey];

  let Component = null;

  // Try alias first
  if (aliasTarget && LucideIcons[aliasTarget]) {
    Component = LucideIcons[aliasTarget];
  }

  // Try direct PascalCase
  if (!Component) {
    const pascal = toPascalCase(trimmed);
    if (LucideIcons[pascal]) {
      Component = LucideIcons[pascal];
    }
  }

  // Try case-insensitive scan of LucideIcons keys
  if (!Component) {
    const foundKey = Object.keys(LucideIcons).find(
      (k) => k.toLowerCase() === cleanKey
    );
    if (foundKey && LucideIcons[foundKey]) {
      Component = LucideIcons[foundKey];
    }
  }

  if (Component) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          lineHeight: 1,
          ...style
        }}
        className={className}
      >
        <Component size={size} color={color} />
      </span>
    );
  }

  // 4. Fallback if not found
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
      className={className}
    >
      {fallback || <Package size={size} color={color} />}
    </span>
  );
};

export default CategoryIcon;
