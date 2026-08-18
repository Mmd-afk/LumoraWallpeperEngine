import React from 'react';
import { WallpaperSettings, LumoraTheme } from '../types';
import { ThemeSelector } from './ThemeSelector';
import { ThemeColorStudio } from './ThemeColorStudio';
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
  EyeOff,
  Maximize,
  Radio,
  Feather,
  Move,
  Target,
  Grid,
  Droplets
} from 'lucide-react';
import { LUMORA_THEMES, DEFAULT_SETTINGS } from '../data/themes';

interface ControlsPanelProps {
  settings: WallpaperSettings;
  onChangeSettings: (newSettings: WallpaperSettings) => void;
  currentTheme: LumoraTheme;
  onSelectTheme: (theme: LumoraTheme) => void;
  onChangeTheme: (theme: LumoraTheme) => void;
  desktopPreview: boolean;
  onToggleDesktopPreview: () => void;
  onOpenExport: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  settings,
  onChangeSettings,
  currentTheme,
  onSelectTheme,
  onChangeTheme,
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

  const posX = settings.letterCenterX !== undefined ? settings.letterCenterX : 50;
  const posY = settings.letterCenterY !== undefined ? settings.letterCenterY : 50;

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

      {/* 2. Custom Color Studio for the Edition */}
      <ThemeColorStudio
        currentTheme={currentTheme}
        onChangeTheme={onChangeTheme}
      />

      {/* 3. Central "L" Emblem Visibility & Positioning */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Central 'L' Emblem</span>
          </label>

          {/* Master Emblem Visibility Toggle */}
          <button
            id="btn-toggle-emblem-visibility"
            onClick={() => updateSetting('showEmblem', settings.showEmblem === false ? true : false)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
              settings.showEmblem !== false
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,216,246,0.15)]'
                : 'bg-neutral-800 border-white/10 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            {settings.showEmblem !== false ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{settings.showEmblem !== false ? 'Visible' : 'Hidden'}</span>
          </button>
        </div>

        {settings.showEmblem !== false ? (
          <div className="space-y-3 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400 flex items-center space-x-1">
                <Move className="w-3 h-3 text-cyan-400" />
                <span>Emblem Position (X / Y)</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400">
                  X:{Math.round(posX)}% Y:{Math.round(posY)}%
                </span>
                {(posX !== 50 || posY !== 50) && (
                  <button
                    id="btn-reset-l-position"
                    onClick={() => {
                      updateSetting('letterCenterX', 50);
                      updateSetting('letterCenterY', 50);
                    }}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900"
                  >
                    Center
                  </button>
                )}
              </div>
            </div>

            {/* Quick Position Preset Anchors (3x3 Grid) */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Top Left', x: 28, y: 30 },
                { label: 'Top Center', x: 50, y: 32 },
                { label: 'Top Right', x: 72, y: 30 },
                { label: 'Center Left', x: 30, y: 50 },
                { label: 'Centered (Default)', x: 50, y: 50 },
                { label: 'Center Right', x: 70, y: 50 },
                { label: 'Bottom Left', x: 28, y: 70 },
                { label: 'Bottom Center', x: 50, y: 68 },
                { label: 'Bottom Right', x: 72, y: 70 },
              ].map((anchor) => {
                const isMatch = Math.abs(posX - anchor.x) < 3 && Math.abs(posY - anchor.y) < 3;
                return (
                  <button
                    key={anchor.label}
                    id={`btn-anchor-${anchor.label.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      updateSetting('letterCenterX', anchor.x);
                      updateSetting('letterCenterY', anchor.y);
                    }}
                    className={`py-1 px-1.5 rounded-lg border text-[10px] truncate transition-all text-center ${
                      isMatch
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold shadow-sm'
                        : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    {anchor.label}
                  </button>
                );
              })}
            </div>

            {/* Horizontal Position (X) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">Horizontal Offset (X)</span>
                <span className="font-mono text-neutral-300">{Math.round(posX)}%</span>
              </div>
              <input
                id="slider-letter-center-x"
                type="range"
                min="15"
                max="85"
                step="0.5"
                value={posX}
                onChange={(e) => updateSetting('letterCenterX', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Vertical Position (Y) */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">Vertical Offset (Y)</span>
                <span className="font-mono text-neutral-300">{Math.round(posY)}%</span>
              </div>
              <input
                id="slider-letter-center-y"
                type="range"
                min="15"
                max="85"
                step="0.5"
                value={posY}
                onChange={(e) => updateSetting('letterCenterY', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Central L Scale */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">Emblem Scale</span>
                <span className="font-mono text-neutral-300">{Math.round(settings.letterScale * 100)}%</span>
              </div>
              <input
                id="slider-letter-scale"
                type="range"
                min="0.7"
                max="1.3"
                step="0.02"
                value={settings.letterScale}
                onChange={(e) => updateSetting('letterScale', Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-dashed border-white/10 text-center space-y-2.5">
            <p className="text-xs text-neutral-400 leading-relaxed">
              The central 'L' emblem is completely removed. Pure abstract flowing glass ribbons and luminous ambient lighting are rendered.
            </p>
            <button
              id="btn-restore-emblem"
              onClick={() => updateSetting('showEmblem', true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-colors"
            >
              Restore Central 'L'
            </button>
          </div>
        )}
      </div>

      {/* 4. Wallpaper Blur Studio */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Wallpaper Blur</span>
          </label>
          
          {/* Master Blur Toggle */}
          <button
            id="btn-toggle-blur"
            onClick={() => {
              const willEnable = !settings.enableBlur;
              onChangeSettings({
                ...settings,
                enableBlur: willEnable,
                blurAmount: willEnable && (!settings.blurAmount || settings.blurAmount === 0) ? 16 : settings.blurAmount || 16,
              });
            }}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
              settings.enableBlur
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,216,246,0.15)]'
                : 'bg-neutral-800 border-white/10 text-neutral-400 hover:bg-neutral-700 hover:text-white'
            }`}
          >
            <span>{settings.enableBlur ? 'Blur: ON' : 'Blur: OFF'}</span>
          </button>
        </div>

        {/* Blur Amount Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-neutral-400">Blur Radius / Intensity</span>
            <span className="font-mono text-cyan-300">
              {settings.enableBlur ? `${settings.blurAmount || 0}px` : '0px (Crisp)'}
            </span>
          </div>
          <input
            id="slider-wallpaper-blur"
            type="range"
            min="0"
            max="50"
            step="1"
            value={settings.enableBlur ? (settings.blurAmount || 0) : 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChangeSettings({
                ...settings,
                enableBlur: val > 0,
                blurAmount: val,
              });
            }}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Quick Blur Intensity Presets */}
        <div className="space-y-1 pt-1">
          <div className="text-[10px] text-neutral-400">Quick Blur Presets</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: 'Crisp', val: 0, enable: false },
              { label: 'Subtle', val: 8, enable: true },
              { label: 'Soft', val: 18, enable: true },
              { label: 'Deep', val: 36, enable: true },
            ].map((preset) => {
              const isMatch = preset.enable 
                ? (settings.enableBlur && settings.blurAmount === preset.val)
                : (!settings.enableBlur || settings.blurAmount === 0);
              return (
                <button
                  key={preset.label}
                  id={`btn-blur-${preset.label.toLowerCase()}`}
                  onClick={() => {
                    onChangeSettings({
                      ...settings,
                      enableBlur: preset.enable,
                      blurAmount: preset.val,
                    });
                  }}
                  className={`py-1 px-1.5 rounded-lg border text-[10px] transition-all text-center ${
                    isMatch
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-semibold shadow-sm'
                      : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Desktop Usability Simulator Toggle */}
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

      {/* 5. Lumora Branding Text & Customizer (Position, Color, Typography) */}
      <TextCustomizer
        settings={settings}
        onChangeSettings={onChangeSettings}
        currentTheme={currentTheme}
      />

      {/* 6. Lighting & Optics Customization */}
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

      {/* 7. Geometry & Composition */}
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

