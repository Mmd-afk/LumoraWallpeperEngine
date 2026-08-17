import React, { useState } from 'react';
import { WallpaperSettings, LumoraTheme, TextPlacement } from '../types';
import { 
  Type, 
  AlignJustify, 
  Palette, 
  SlidersHorizontal, 
  Sparkles, 
  Move, 
  Check, 
  ChevronDown, 
  ChevronUp,
  LayoutGrid
} from 'lucide-react';

interface TextCustomizerProps {
  settings: WallpaperSettings;
  onChangeSettings: (newSettings: WallpaperSettings) => void;
  currentTheme: LumoraTheme;
}

const COLOR_PRESETS = [
  { name: 'Cyan Glow', color: '#00d8f6' },
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Electric Emerald', color: '#05f7a0' },
  { name: 'Celestial Violet', color: '#a855f7' },
  { name: 'Solar Amber', color: '#ff8800' },
  { name: 'Cobalt Blue', color: '#38bdf8' },
  { name: 'Rose Quartz', color: '#f43f5e' },
  { name: 'Titanium Ice', color: '#cbd5e1' },
];

const POSITION_PRESETS: { id: TextPlacement; label: string; iconPos: string }[] = [
  { id: 'bottom-center', label: 'Bottom Center', iconPos: 'bottom-center' },
  { id: 'center-below-l', label: 'Below Sculpted L', iconPos: 'center' },
  { id: 'bottom-right', label: 'Bottom Right', iconPos: 'bottom-right' },
  { id: 'bottom-left', label: 'Bottom Left', iconPos: 'bottom-left' },
  { id: 'top-left', label: 'Top Left', iconPos: 'top-left' },
  { id: 'top-right', label: 'Top Right', iconPos: 'top-right' },
  { id: 'custom', label: 'Custom Drag/XY', iconPos: 'custom' },
];

export const TextCustomizer: React.FC<TextCustomizerProps> = ({
  settings,
  onChangeSettings,
  currentTheme,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSetting = <K extends keyof WallpaperSettings>(
    key: K,
    value: WallpaperSettings[K]
  ) => {
    onChangeSettings({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div id="lumora-text-customizer-section" className="space-y-4 pt-2 border-t border-white/5">
      {/* 1. Main Header with Enable Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Type className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider block">
              Lumora Branding Text
            </span>
            <span className="text-[10px] text-neutral-500">
              Customize title, location & color
            </span>
          </div>
        </div>

        <button
          id="btn-toggle-enable-text"
          onClick={() => updateSetting('enableText', !settings.enableText)}
          className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
            settings.enableText ? 'bg-cyan-500' : 'bg-neutral-800'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              settings.enableText ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {settings.enableText && (
        <div className="space-y-4 animate-fadeIn">
          {/* 2. Text Input String */}
          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400">Branding Text</label>
            <input
              id="input-text-string"
              type="text"
              value={settings.textString}
              onChange={(e) => updateSetting('textString', e.target.value)}
              placeholder="LUMORA"
              maxLength={30}
              className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          {/* 3. Placement Selection Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium flex items-center space-x-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Text Placement</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {POSITION_PRESETS.find((p) => p.id === settings.textPosition)?.label || 'Custom'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {POSITION_PRESETS.map((preset) => {
                const isSelected = settings.textPosition === preset.id;
                return (
                  <button
                    key={preset.id}
                    id={`btn-pos-${preset.id}`}
                    onClick={() => updateSetting('textPosition', preset.id)}
                    className={`px-2.5 py-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-500/80 bg-cyan-950/30 text-white font-medium shadow-[0_0_10px_rgba(0,216,246,0.15)]'
                        : 'border-white/5 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 hover:border-white/10'
                    }`}
                  >
                    <span className="truncate text-[11px]">{preset.label}</span>
                    {isSelected && <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Coordinates Sliders if 'custom' is active */}
            {settings.textPosition === 'custom' && (
              <div className="p-3 rounded-xl bg-neutral-900/60 border border-cyan-500/20 space-y-2 mt-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-300">
                  <span className="flex items-center space-x-1">
                    <Move className="w-3 h-3" />
                    <span>Freeform Coordinates (Or drag on canvas)</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Horizontal Position (X)</span>
                    <span className="font-mono">{Math.round(settings.textCustomX)}%</span>
                  </div>
                  <input
                    id="slider-text-custom-x"
                    type="range"
                    min="5"
                    max="95"
                    step="1"
                    value={settings.textCustomX}
                    onChange={(e) => updateSetting('textCustomX', Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>Vertical Position (Y)</span>
                    <span className="font-mono">{Math.round(settings.textCustomY)}%</span>
                  </div>
                  <input
                    id="slider-text-custom-y"
                    type="range"
                    min="5"
                    max="95"
                    step="1"
                    value={settings.textCustomY}
                    onChange={(e) => updateSetting('textCustomY', Number(e.target.value))}
                    className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. Text Color & Optics */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Text Color & Material</span>
              </span>
            </div>

            {/* Mode Selectors */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-900 rounded-lg border border-white/5 text-[11px]">
              <button
                id="btn-color-mode-accent"
                onClick={() => updateSetting('textColorMode', 'accent')}
                className={`py-1 rounded text-center transition-all ${
                  settings.textColorMode === 'accent'
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Theme
              </button>
              <button
                id="btn-color-mode-white"
                onClick={() => updateSetting('textColorMode', 'white')}
                className={`py-1 rounded text-center transition-all ${
                  settings.textColorMode === 'white'
                    ? 'bg-white/20 text-white font-medium border border-white/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                White
              </button>
              <button
                id="btn-color-mode-glass"
                onClick={() => {
                  updateSetting('textColorMode', 'custom');
                  updateSetting('textStyle', 'glass');
                }}
                className={`py-1 rounded text-center transition-all ${
                  settings.textStyle === 'glass'
                    ? 'bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Glass
              </button>
              <button
                id="btn-color-mode-custom"
                onClick={() => {
                  updateSetting('textColorMode', 'custom');
                  if (settings.textStyle === 'glass') updateSetting('textStyle', 'syne');
                }}
                className={`py-1 rounded text-center transition-all ${
                  settings.textColorMode === 'custom' && settings.textStyle !== 'glass'
                    ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Color Swatch Presets + Native Color Picker */}
            {settings.textColorMode === 'custom' && (
              <div className="space-y-2 p-2.5 rounded-xl bg-neutral-900/50 border border-white/5 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Palette Swatches</span>
                  {/* Native Color Input */}
                  <div className="flex items-center space-x-1.5">
                    <input
                      id="input-text-color-hex"
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => updateSetting('textColor', e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 p-0"
                    />
                    <span className="font-mono text-[10px] text-neutral-300 uppercase">
                      {settings.textColor}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = settings.textColor.toLowerCase() === preset.color.toLowerCase();
                    return (
                      <button
                        key={preset.color}
                        onClick={() => updateSetting('textColor', preset.color)}
                        title={preset.name}
                        className={`h-7 rounded-lg border flex items-center justify-center space-x-1 transition-all ${
                          isSelected
                            ? 'border-white ring-1 ring-white/50 scale-105 shadow-md'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                        style={{ backgroundColor: preset.color + '25' }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: preset.color }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. Collapsible Advanced Typography Controls */}
          <div className="border-t border-white/5 pt-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-[11px] text-neutral-400 hover:text-neutral-200 py-1"
            >
              <span className="flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
                <span>Typography & Glow Optics</span>
              </span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="space-y-3 pt-2 text-xs animate-fadeIn">
                {/* Font Style Selection */}
                <div className="space-y-1">
                  <label className="text-[11px] text-neutral-400">Typography Archetype</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => updateSetting('textStyle', 'syne')}
                      className={`py-1 rounded text-center text-[10px] font-semibold tracking-wider ${
                        settings.textStyle === 'syne'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-neutral-900 border border-white/5 text-neutral-400'
                      }`}
                    >
                      Syne Display
                    </button>
                    <button
                      onClick={() => updateSetting('textStyle', 'outfit')}
                      className={`py-1 rounded text-center text-[10px] ${
                        settings.textStyle === 'outfit'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-neutral-900 border border-white/5 text-neutral-400'
                      }`}
                    >
                      Outfit Pure
                    </button>
                    <button
                      onClick={() => updateSetting('textStyle', 'mono')}
                      className={`py-1 rounded text-center text-[10px] font-mono ${
                        settings.textStyle === 'mono'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-neutral-900 border border-white/5 text-neutral-400'
                      }`}
                    >
                      Terminal
                    </button>
                  </div>
                </div>

                {/* Text Size Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Text Scale</span>
                    <span className="font-mono">{Math.round(settings.textSize * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="2.0"
                    step="0.05"
                    value={settings.textSize}
                    onChange={(e) => updateSetting('textSize', Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Letter Spacing / Tracking Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>Letter Spacing (Tracking)</span>
                    <span className="font-mono">{settings.textTracking}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="32"
                    step="1"
                    value={settings.textTracking}
                    onChange={(e) => updateSetting('textTracking', Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Glow & Opacity */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Luminous Glow Effect</span>
                  <input
                    type="checkbox"
                    checked={settings.textGlow}
                    onChange={(e) => updateSetting('textGlow', e.target.checked)}
                    className="w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>

                {settings.textGlow && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Glow Bloom Radius</span>
                      <span className="font-mono">{Math.round(settings.textGlowIntensity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.3"
                      max="2.0"
                      step="0.1"
                      value={settings.textGlowIntensity}
                      onChange={(e) => updateSetting('textGlowIntensity', Number(e.target.value))}
                      className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
