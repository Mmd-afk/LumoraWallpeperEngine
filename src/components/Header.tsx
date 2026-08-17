import React from 'react';
import { Sparkles, Download, Eye, Maximize, Sliders, Type } from 'lucide-react';
import { LumoraTheme, WallpaperSettings } from '../types';

interface HeaderProps {
  theme: LumoraTheme;
  settings: WallpaperSettings;
  onChangeSettings: (settings: WallpaperSettings) => void;
  desktopPreview: boolean;
  onToggleDesktopPreview: () => void;
  onOpenExport: () => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  settings,
  onChangeSettings,
  desktopPreview,
  onToggleDesktopPreview,
  onOpenExport,
  onFullscreenToggle,
  isFullscreen,
}) => {
  if (isFullscreen) return null;

  return (
    <header 
      id="lumora-app-header"
      className="w-full h-14 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0"
    >
      {/* Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(0,216,246,0.2)]">
          <span className="font-display font-black text-cyan-400 text-base leading-none">L</span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-white tracking-tight font-display">
              Lumora OS
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
              4K UHD 16:9
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 hidden sm:block">
            Official Minimalist Glass Wallpaper
          </p>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center space-x-2">
        {/* Quick Text / Clean Toggle Button */}
        <button
          id="header-btn-toggle-text"
          onClick={() => onChangeSettings({ ...settings, enableText: !settings.enableText })}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
            settings.enableText
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(0,216,246,0.1)]'
              : 'bg-neutral-900 border-white/10 text-neutral-400 hover:bg-neutral-800 hover:text-white'
          }`}
          title={settings.enableText ? 'Click to hide branding text for clean wallpaper' : 'Click to show branding text'}
        >
          <Type className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{settings.enableText ? 'Text: ON' : 'Text: OFF (Clean)'}</span>
        </button>

        <button
          id="header-btn-toggle-desktop"
          onClick={onToggleDesktopPreview}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center space-x-1.5 ${
            desktopPreview
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,216,246,0.15)]'
              : 'bg-neutral-900 border-white/10 text-neutral-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Desktop Simulator</span>
        </button>

        <button
          id="header-btn-fullscreen"
          onClick={onFullscreenToggle}
          title="Fullscreen View"
          className="p-2 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>

        <button
          id="header-btn-download-4k"
          onClick={onOpenExport}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,216,246,0.25)] flex items-center space-x-1.5 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download 4K</span>
        </button>
      </div>
    </header>
  );
};
