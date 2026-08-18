export interface LumoraTheme {
  id: string;
  name: string;
  subtitle: string;
  backgroundStart: string;
  backgroundMid: string;
  backgroundEnd: string;
  accentPrimary: string;
  accentSecondary: string;
  accentTertiary: string;
  glassTint: string;
  rimLight: string;
  shadowColor: string;
  glowColor: string;
  vignetteStrength: number;
}

export type TextPlacement = 
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-left'
  | 'top-right'
  | 'center-below-l'
  | 'custom';

export interface WallpaperSettings {
  themeId: string;
  lightAngle: number; // 0 to 360 degrees
  lightIntensity: number; // 0.2 to 2.0
  glassRefraction: number; // 0.2 to 2.0
  frostBlur: number; // 0 to 1.0
  ribbonComplexity: number; // 1 to 5
  depthAmount: number; // 0.2 to 2.0
  particleDensity: number; // 0 to 1.0
  grainAmount: number; // 0 to 0.5
  letterScale: number; // 0.7 to 1.3
  letterCenterX: number; // 0 to 100 (% of width)
  letterCenterY: number; // 0 to 100 (% of height)
  showEmblem: boolean; // toggle central sculpted 'L' emblem visibility
  enableBlur: boolean; // toggle overall wallpaper blur effect
  blurAmount: number; // 0 to 60px blur radius
  glowSpread: number; // 0.5 to 2.0
  colorShift: number; // -180 to 180
  mouseParallax: boolean;

  // Lumora Text Branding Settings
  enableText: boolean;
  textString: string;
  textColor: string;
  textColorMode: 'preset' | 'custom' | 'accent' | 'rim' | 'white';
  textPosition: TextPlacement;
  textCustomX: number; // 0 to 100 (% of width)
  textCustomY: number; // 0 to 100 (% of height)
  textSize: number; // 0.6 to 2.5 scale
  textTracking: number; // 2 to 32px letter spacing
  textGlow: boolean;
  textGlowIntensity: number; // 0.2 to 2.0
  textOpacity: number; // 0.2 to 1.0
  textStyle: 'syne' | 'outfit' | 'mono' | 'glass';
}

export type ExportResolution = {
  label: string;
  width: number;
  height: number;
  aspect: string;
  badge?: string;
};
