import React from 'react';
import { WallpaperSettings, LumoraTheme } from '../types';
import { ThemeSelector } from './ThemeSelector';
import { TextCustomizer } from './TextCustomizer';
import { 
  Sun, 
  Layers, 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  Sliders, 
  Compass, 
  Eye, 
  Maximize,
  Radio,
  Feather
} from 'lucide-react';
import { LUMORA_THEMES, DEFAULT_SETTINGS } from '../data/themes';

interface ControlsPanelProps {
  settings: WallpaperSettings;
  onChangeSettings: (newSettings: WallpaperSettings) => void;
  currentTheme: LumoraTheme;
  onSelectTheme: (theme: LumoraTheme) => void;
  desktopPreview: boolean;
  onToggleDesktopPreview: () => void;
  onOpenExport: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onChangeSettings,
  currentTheme,
  onSelectTheme,
  desktopPreview,
  onToggleDesktopPreview,
  onOpenExport,
}) => {
  const updateSetting = <K extends keyof WallpaperSettings>(
    key: K,
    value: WallpaperSettings[K]
  ) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleRandomize = () => {
    const randomTheme = LUMORA_THEMES[Math.floor(Math.random() * LUMORA_THEMES.length)];
    onSelectTheme(randomTheme);
    onChangeSettings({
      ...settings,
      themeId: randomTheme.id,
      lightAngle: Math.floor(Math.random() * 360),
      lightIntensity: Number((0.85 + Math.random() * 0.6).toFixed(2)),
      glassRefraction: Number((0.8 + Math.random() * 0.5).toFixed(2)),
      ribbonComplexity: Math.floor(2 + Math.random() * 3),
      depthAmount: Number((0.9 + Math.random() * 0.5).toFixed(2)),
    });
  };

  const handleReset = () => {
    onChangeSettings({
      ...DEFAULT_SETTINGS,
      themeId: currentTheme.id,
    });
  };

  return (
    <div 
      id="lumora-controls-panel"
      className="w-full lg:w-96 flex-shrink-0 bg-neutral-950/80 backdrop-blur-2xl border-l border-white/5 flex flex-col h-full overflow-y-auto p-5 space-y-6"
    >
      {/* Panel Top Heading & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white tracking-tight font-display">
              Lumora Studio
            </h2>
            <p className="text-[11px] text-neutral-400">4K Wallpaper Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            id="btn-randomize-settings"
            onClick={handleRandomize}
            title="Randomize Aesthetics"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            id="btn-reset-settings"
            onClick={handleReset}
            title="Reset to Defaults"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Theme Presets */}
      <ThemeSelector
        currentThemeId={currentTheme.id}
        onSelectTheme={(t) => {
          onSelectTheme(t);
          updateSetting('themeId', t.id);
        }}
      />

      {/* 2. Desktop Usability Simulator Toggle */}
      <div className="p-3.5 rounded-xl bg-neutral-900/50 border border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-neutral-200">
              Desktop Icon Test
            </div>
            <div className="text-[11px] text-neutral-500">
              Check UI legibility on negative space
            </div>
          </div>
        </div>

        <button
          id="btn-toggle-desktop-mockup"
          onClick={onToggleDesktopPreview}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
            desktopPreview ? 'bg-cyan-500' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              desktopPreview ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 3. Lumora Branding Text & Customizer (Position, Color, Typography) */}
      <TextCustomizer
        settings={settings}
        onChangeSettings={onChangeSettings}
        currentTheme={currentTheme}
      />

      {/* 4. Lighting & Optics Customization */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Sun className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lighting & Glass Optics</span>
        </label>

        {/* Light Angle Dial Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 flex items-center space-x-1">
              <Compass className="w-3 h-3 text-neutral-500" />
              <span>Light Incident Angle</span>
            </span>
            <span className="font-mono text-neutral-300">{settings.lightAngle}°</span>
          </div>
          <input
            id="slider-light-angle"
            type="range"
            min="0"
            max="360"
            step="1"
            value={settings.lightAngle}
            onChange={(e) => updateSetting('lightAngle', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Light Intensity Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Glow & Specular Intensity</span>
            <span className="font-mono text-neutral-300">
              {Math.round(settings.lightIntensity * 100)}%
            </span>
          </div>
          <input
            id="slider-light-intensity"
            type="range"
            min="0.5"
            max="1.8"
            step="0.05"
            value={settings.lightIntensity}
            onChange={(e) => updateSetting('lightIntensity', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* 3D Glass Depth & Bevels */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Glass Bevel & Depth</span>
            <span className="font-mono text-neutral-300">
              {Math.round(settings.depthAmount * 100)}%
            </span>
          </div>
          <input
            id="slider-depth-amount"
            type="range"
            min="0.4"
            max="1.8"
            step="0.05"
            value={settings.depthAmount}
            onChange={(e) => updateSetting('depthAmount', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* 4. Geometry & Composition */}
      <div className="space-y-4">
        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Architectural Geometry</span>
        </label>

        {/* Ribbon Wave Complexity */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Flowing Ribbon Layers</span>
            <span className="font-mono text-neutral-300">
              {settings.ribbonComplexity} Waves
            </span>
          </div>
          <input
            id="slider-ribbon-complexity"
            type="range"
            min="1"
            max="5"
            step="1"
            value={settings.ribbonComplexity}
            onChange={(e) => updateSetting('ribbonComplexity', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Central L Scale */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Lumora 'L' Scale</span>
            <span className="font-mono text-neutral-300">
              {Math.round(settings.letterScale * 100)}%
            </span>
          </div>
          <input
            id="slider-letter-scale"
            type="range"
            min="0.8"
            max="1.25"
            step="0.02"
            value={settings.letterScale}
            onChange={(e) => updateSetting('letterScale', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Subtle Ambient Bokeh Density */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Ambient Bokeh Dust</span>
            <span className="font-mono text-neutral-300">
              {settings.particleDensity > 0 ? `${Math.round(settings.particleDensity * 100)}%` : 'Off'}
            </span>
          </div>
          <input
            id="slider-particle-density"
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value={settings.particleDensity}
            onChange={(e) => updateSetting('particleDensity', Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Interactive Mouse Parallax Toggle */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-neutral-400">Interactive Cursor Parallax</span>
          <input
            id="checkbox-mouse-parallax"
            type="checkbox"
            checked={settings.mouseParallax}
            onChange={(e) => updateSetting('mouseParallax', e.target.checked)}
            className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Export Action Button in Sidebar */}
      <div className="pt-2">
        <button
          id="btn-open-export-modal"
          onClick={onOpenExport}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-semibold text-sm shadow-[0_0_20px_rgba(0,216,246,0.3)] transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Export 4K Wallpaper</span>
        </button>
      </div>
    </div>
  );
};
