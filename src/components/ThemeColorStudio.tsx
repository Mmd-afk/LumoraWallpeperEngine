import React, { useState } from 'react';
import { LumoraTheme } from '../types';
import { LUMORA_THEMES } from '../data/themes';
import { 
  Palette, 
  RotateCcw, 
  Sparkles, 
  Shuffle, 
  Layers, 
  Sun, 
  Compass, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Wand2
} from 'lucide-react';

interface ThemeColorStudioProps {
  currentTheme: LumoraTheme;
  onChangeTheme: (newTheme: LumoraTheme) => void;
}

// Preset color harmony templates for instant custom palette styling
const PALETTE_TEMPLATES = [
  {
    name: 'Cyberpunk Neon',
    accentPrimary: '#00f0ff',
    accentSecondary: '#ff007f',
    accentTertiary: '#7000ff',
    rimLight: 'rgba(230, 245, 255, 0.98)',
    glassTint: 'rgba(20, 10, 45, 0.45)',
    glowColor: 'rgba(0, 240, 255, 0.38)',
    backgroundStart: '#06040d',
    backgroundMid: '#120824',
    backgroundEnd: '#030206',
  },
  {
    name: 'Solar Plasma',
    accentPrimary: '#ff9100',
    accentSecondary: '#ff3d00',
    accentTertiary: '#ffd600',
    rimLight: 'rgba(255, 240, 210, 0.95)',
    glassTint: 'rgba(45, 20, 10, 0.45)',
    glowColor: 'rgba(255, 145, 0, 0.35)',
    backgroundStart: '#0d0603',
    backgroundMid: '#240f06',
    backgroundEnd: '#060201',
  },
  {
    name: 'Emerald Matrix',
    accentPrimary: '#00ff88',
    accentSecondary: '#00e5ff',
    accentTertiary: '#76ff03',
    rimLight: 'rgba(215, 255, 235, 0.95)',
    glassTint: 'rgba(10, 45, 30, 0.45)',
    glowColor: 'rgba(0, 255, 136, 0.35)',
    backgroundStart: '#030c07',
    backgroundMid: '#082215',
    backgroundEnd: '#010503',
  },
  {
    name: 'Nebula Violet',
    accentPrimary: '#c084fc',
    accentSecondary: '#818cf8',
    accentTertiary: '#f472b6',
    rimLight: 'rgba(245, 235, 255, 0.98)',
    glassTint: 'rgba(35, 15, 55, 0.45)',
    glowColor: 'rgba(192, 132, 252, 0.35)',
    backgroundStart: '#090514',
    backgroundMid: '#170c30',
    backgroundEnd: '#04020a',
  },
  {
    name: 'Polar Titanium',
    accentPrimary: '#f8fafc',
    accentSecondary: '#94a3b8',
    accentTertiary: '#38bdf8',
    rimLight: 'rgba(255, 255, 255, 0.98)',
    glassTint: 'rgba(30, 41, 59, 0.45)',
    glowColor: 'rgba(248, 250, 252, 0.25)',
    backgroundStart: '#090b0e',
    backgroundMid: '#151922',
    backgroundEnd: '#060709',
  },
  {
    name: 'Rose Gold Luxe',
    accentPrimary: '#fb7185',
    accentSecondary: '#f59e0b',
    accentTertiary: '#fda4af',
    rimLight: 'rgba(255, 235, 240, 0.95)',
    glassTint: 'rgba(50, 20, 30, 0.45)',
    glowColor: 'rgba(251, 113, 133, 0.35)',
    backgroundStart: '#100508',
    backgroundMid: '#240b15',
    backgroundEnd: '#080204',
  }
];

export const ThemeColorStudio: React.FC<ThemeColorStudioProps> = ({
  currentTheme,
  onChangeTheme,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'ribbons' | 'glass' | 'atmosphere'>('ribbons');

  // Find original preset to compare/reset
  const originalPreset = LUMORA_THEMES.find((t) => t.id === currentTheme.id) || LUMORA_THEMES[0];

  // Helper to safely extract 6-digit hex from hex/rgb/rgba strings for <input type="color">
  const toHex6 = (colorStr: string): string => {
    if (!colorStr) return '#00d8f6';
    if (colorStr.startsWith('#')) {
      if (colorStr.length === 7) return colorStr;
      if (colorStr.length === 4) {
        return `#${colorStr[1]}${colorStr[1]}${colorStr[2]}${colorStr[2]}${colorStr[3]}${colorStr[3]}`;
      }
      return colorStr.slice(0, 7);
    }
    if (colorStr.startsWith('rgb')) {
      const nums = colorStr.match(/\d+/g);
      if (nums && nums.length >= 3) {
        const r = parseInt(nums[0]).toString(16).padStart(2, '0');
        const g = parseInt(nums[1]).toString(16).padStart(2, '0');
        const b = parseInt(nums[2]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    return '#00d8f6';
  };

  // Helper to extract alpha or default
  const getAlphaFromRgba = (rgbaStr: string, defaultAlpha: number = 0.5): number => {
    if (rgbaStr.startsWith('rgba')) {
      const match = rgbaStr.match(/[\d.]+/g);
      if (match && match.length >= 4) {
        return parseFloat(match[3]);
      }
    }
    return defaultAlpha;
  };

  // Update a single theme field
  const updateColor = (key: keyof LumoraTheme, value: string | number) => {
    onChangeTheme({
      ...currentTheme,
      [key]: value,
    });
  };

  // Update an RGBA property with new hex color preserving its opacity
  const updateRgbaColor = (key: keyof LumoraTheme, newHex: string, defaultAlpha: number) => {
    const currentAlpha = getAlphaFromRgba(String(currentTheme[key]), defaultAlpha);
    const nums = newHex.replace('#', '');
    const r = parseInt(nums.substring(0, 2), 16) || 0;
    const g = parseInt(nums.substring(2, 4), 16) || 0;
    const b = parseInt(nums.substring(4, 6), 16) || 0;
    const rgba = `rgba(${r}, ${g}, ${b}, ${currentAlpha.toFixed(2)})`;
    updateColor(key, rgba);
  };

  // Harmonize all colors around the active Primary Accent
  const handleHarmonizePalette = () => {
    const primaryHex = toHex6(currentTheme.accentPrimary);
    const r = parseInt(primaryHex.substring(1, 3), 16);
    const g = parseInt(primaryHex.substring(3, 5), 16);
    const b = parseInt(primaryHex.substring(5, 7), 16);

    // Shift hue for secondary & tertiary
    const secR = Math.min(255, Math.max(0, Math.round(g * 0.8 + b * 0.4)));
    const secG = Math.min(255, Math.max(0, Math.round(b * 0.8 + r * 0.3)));
    const secB = Math.min(255, Math.max(0, Math.round(r * 0.9 + g * 0.3)));
    const secHex = `#${secR.toString(16).padStart(2, '0')}${secG.toString(16).padStart(2, '0')}${secB.toString(16).padStart(2, '0')}`;

    const tertR = Math.min(255, Math.max(0, Math.round(b * 0.9 + r * 0.2)));
    const tertG = Math.min(255, Math.max(0, Math.round(r * 0.8 + g * 0.4)));
    const tertB = Math.min(255, Math.max(0, Math.round(g * 0.9 + b * 0.2)));
    const tertHex = `#${tertR.toString(16).padStart(2, '0')}${tertG.toString(16).padStart(2, '0')}${tertB.toString(16).padStart(2, '0')}`;

    // Background atmosphere deep tint
    const bgR = Math.round(r * 0.05).toString(16).padStart(2, '0');
    const bgG = Math.round(g * 0.05).toString(16).padStart(2, '0');
    const bgB = Math.round(b * 0.05).toString(16).padStart(2, '0');

    const midR = Math.round(r * 0.12).toString(16).padStart(2, '0');
    const midG = Math.round(g * 0.12).toString(16).padStart(2, '0');
    const midB = Math.round(b * 0.12).toString(16).padStart(2, '0');

    onChangeTheme({
      ...currentTheme,
      accentSecondary: secHex,
      accentTertiary: tertHex,
      glowColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
      glassTint: `rgba(${Math.round(r * 0.2)}, ${Math.round(g * 0.2)}, ${Math.round(b * 0.2)}, 0.45)`,
      backgroundStart: `#${bgR}${bgG}${bgB}`,
      backgroundMid: `#${midR}${midG}${midB}`,
    });
  };

  // Randomize full custom color matrix
  const handleRandomize = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const hslToHex = (h: number, s: number, l: number): string => {
      l /= 100;
      const a = (s * Math.min(l, 1 - l)) / 100;
      const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
      };
      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const prim = hslToHex(randomHue, 95, 55);
    const sec = hslToHex((randomHue + 40) % 360, 90, 60);
    const tert = hslToHex((randomHue + 120) % 360, 90, 65);
    const bgStart = hslToHex(randomHue, 60, 3);
    const bgMid = hslToHex(randomHue, 70, 7);
    const bgEnd = hslToHex(randomHue, 50, 2);

    const primR = parseInt(prim.slice(1, 3), 16);
    const primG = parseInt(prim.slice(3, 5), 16);
    const primB = parseInt(prim.slice(5, 7), 16);

    onChangeTheme({
      ...currentTheme,
      accentPrimary: prim,
      accentSecondary: sec,
      accentTertiary: tert,
      glowColor: `rgba(${primR}, ${primG}, ${primB}, 0.35)`,
      glassTint: `rgba(${Math.round(primR * 0.2)}, ${Math.round(primG * 0.2)}, ${Math.round(primB * 0.2)}, 0.45)`,
      rimLight: `rgba(235, 245, 255, 0.96)`,
      backgroundStart: bgStart,
      backgroundMid: bgMid,
      backgroundEnd: bgEnd,
    });
  };

  // Reset to original preset values
  const handleResetToPreset = () => {
    onChangeTheme({
      ...originalPreset,
    });
  };

  return (
    <div id="lumora-theme-color-studio" className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white flex items-center space-x-1.5">
              <span>Edition Custom Color Studio</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
                LIVE
              </span>
            </h3>
            <p className="text-[10px] text-neutral-400">
              Granular RGB & Hex customization for {currentTheme.name}
            </p>
          </div>
        </div>

        <button
          id="btn-toggle-color-studio-accordion"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-fadeIn">
          {/* Quick Color Harmonization Actions */}
          <div className="flex items-center space-x-1.5">
            <button
              id="btn-harmonize-palette"
              onClick={handleHarmonizePalette}
              title="Auto-harmonize all accent ribbons with primary color"
              className="flex-1 px-2 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/50 text-[11px] font-medium flex items-center justify-center space-x-1 transition-all"
            >
              <Wand2 className="w-3 h-3 text-cyan-400" />
              <span>Harmonize</span>
            </button>

            <button
              id="btn-randomize-palette"
              onClick={handleRandomize}
              title="Generate vibrant random color harmony"
              className="flex-1 px-2 py-1.5 rounded-lg bg-neutral-800/80 border border-white/10 text-neutral-200 hover:bg-neutral-800 hover:text-white text-[11px] font-medium flex items-center justify-center space-x-1 transition-all"
            >
              <Shuffle className="w-3 h-3 text-purple-400" />
              <span>Randomize</span>
            </button>

            <button
              id="btn-reset-edition-colors"
              onClick={handleResetToPreset}
              title="Reset to original edition colors"
              className="p-1.5 rounded-lg bg-neutral-800/80 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preset Harmony Swatches */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Instant Custom Palettes
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {PALETTE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  id={`btn-palette-tmpl-${tmpl.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    onChangeTheme({
                      ...currentTheme,
                      accentPrimary: tmpl.accentPrimary,
                      accentSecondary: tmpl.accentSecondary,
                      accentTertiary: tmpl.accentTertiary,
                      rimLight: tmpl.rimLight,
                      glassTint: tmpl.glassTint,
                      glowColor: tmpl.glowColor,
                      backgroundStart: tmpl.backgroundStart,
                      backgroundMid: tmpl.backgroundMid,
                      backgroundEnd: tmpl.backgroundEnd,
                    });
                  }}
                  className="p-1.5 rounded-lg bg-neutral-950/60 border border-white/5 hover:border-white/20 text-left transition-all group flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.accentPrimary }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tmpl.accentSecondary }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tmpl.accentTertiary }} />
                  </div>
                  <span className="text-[10px] text-neutral-300 group-hover:text-white truncate font-medium">
                    {tmpl.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex p-0.5 rounded-xl bg-neutral-950/80 border border-white/10 text-[11px]">
            <button
              id="tab-colors-ribbons"
              onClick={() => setActiveTab('ribbons')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'ribbons'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Accents & Glow
            </button>
            <button
              id="tab-colors-glass"
              onClick={() => setActiveTab('glass')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'glass'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              3D Glass & Rim
            </button>
            <button
              id="tab-colors-atmosphere"
              onClick={() => setActiveTab('atmosphere')}
              className={`flex-1 py-1 rounded-lg font-medium transition-all ${
                activeTab === 'atmosphere'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Atmosphere
            </button>
          </div>

          {/* TAB 1: ACCENTS & GLOW */}
          {activeTab === 'ribbons' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Primary Accent */}
              <ColorField
                id="color-accent-primary"
                label="Primary Neon Accent"
                description="Core ribbon curve & focal light"
                valueHex={toHex6(currentTheme.accentPrimary)}
                onChangeHex={(hex) => updateColor('accentPrimary', hex)}
              />

              {/* Secondary Accent */}
              <ColorField
                id="color-accent-secondary"
                label="Secondary Fluid Wave"
                description="Complementary flowing ribbon layer"
                valueHex={toHex6(currentTheme.accentSecondary)}
                onChangeHex={(hex) => updateColor('accentSecondary', hex)}
              />

              {/* Tertiary Accent */}
              <ColorField
                id="color-accent-tertiary"
                label="Prism Core Highlight"
                description="Inner reflective shards & caustics"
                valueHex={toHex6(currentTheme.accentTertiary)}
                onChangeHex={(hex) => updateColor('accentTertiary', hex)}
              />

              {/* Volumetric Glow Bloom */}
              <ColorField
                id="color-glow"
                label="Volumetric Atmosphere Glow"
                description="Soft ambient bloom surrounding central L"
                valueHex={toHex6(currentTheme.glowColor)}
                onChangeHex={(hex) => updateRgbaColor('glowColor', hex, 0.35)}
              />
            </div>
          )}

          {/* TAB 2: 3D GLASS & SPECULAR RIM */}
          {activeTab === 'glass' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Specular Rim Light */}
              <ColorField
                id="color-rim-light"
                label="Specular Rim Highlight"
                description="Crisp edge reflection on the sculpted L"
                valueHex={toHex6(currentTheme.rimLight)}
                onChangeHex={(hex) => updateRgbaColor('rimLight', hex, 0.95)}
              />

              {/* Glass Refractive Tint */}
              <ColorField
                id="color-glass-tint"
                label="Translucent Glass Tint"
                description="Refractive internal body prism color"
                valueHex={toHex6(currentTheme.glassTint)}
                onChangeHex={(hex) => updateRgbaColor('glassTint', hex, 0.45)}
              />

              {/* Deep 3D Shadow Color */}
              <ColorField
                id="color-shadow"
                label="3D Occlusion Shadow"
                description="Depth occlusion behind sculpted curves"
                valueHex={toHex6(currentTheme.shadowColor)}
                onChangeHex={(hex) => updateRgbaColor('shadowColor', hex, 0.85)}
              />
            </div>
          )}

          {/* TAB 3: ATMOSPHERE & BACKGROUND */}
          {activeTab === 'atmosphere' && (
            <div className="space-y-3 animate-fadeIn">
              {/* Center Atmosphere Glow */}
              <ColorField
                id="color-bg-mid"
                label="Center Atmosphere Glow"
                description="Radial ambient illumination behind the emblem"
                valueHex={toHex6(currentTheme.backgroundMid)}
                onChangeHex={(hex) => updateColor('backgroundMid', hex)}
              />

              {/* Deep Void Canvas Backdrop */}
              <ColorField
                id="color-bg-start"
                label="Deep Void Canvas Backdrop"
                description="Primary dark background canvas"
                valueHex={toHex6(currentTheme.backgroundStart)}
                onChangeHex={(hex) => updateColor('backgroundStart', hex)}
              />

              {/* Outer Vignette Edge */}
              <ColorField
                id="color-bg-end"
                label="Outer Vignette Edge"
                description="Deep corner falloff and frame contrast"
                valueHex={toHex6(currentTheme.backgroundEnd)}
                onChangeHex={(hex) => updateColor('backgroundEnd', hex)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Reusable micro-component for each color row
interface ColorFieldProps {
  id: string;
  label: string;
  description: string;
  valueHex: string;
  onChangeHex: (hex: string) => void;
}

const ColorField: React.FC<ColorFieldProps> = ({
  id,
  label,
  description,
  valueHex,
  onChangeHex,
}) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 border border-white/5 hover:border-white/10 transition-all">
      <div className="space-y-0.5 max-w-[180px]">
        <div className="text-xs font-semibold text-neutral-200">{label}</div>
        <div className="text-[10px] text-neutral-500 truncate">{description}</div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Hex Text Box */}
        <input
          id={`input-hex-${id}`}
          type="text"
          value={valueHex.toUpperCase()}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
              const formatted = val.startsWith('#') ? val : `#${val}`;
              if (formatted.length === 7) {
                onChangeHex(formatted);
              }
            }
          }}
          className="w-18 px-1.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-[11px] font-mono text-center text-white focus:outline-none focus:border-cyan-500"
        />

        {/* Live Color Picker Circle */}
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/30 shadow-inner flex items-center justify-center cursor-pointer group">
          <div
            className="w-full h-full"
            style={{ backgroundColor: valueHex }}
          />
          <input
            id={`picker-${id}`}
            type="color"
            value={valueHex}
            onChange={(e) => onChangeHex(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
