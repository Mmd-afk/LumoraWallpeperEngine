import React, { useState, useEffect, useMemo } from 'react';
import { LUMORA_THEMES, DEFAULT_SETTINGS } from './data/themes';
import { LumoraTheme, WallpaperSettings } from './types';
import { Header } from './components/Header';
import { WallpaperCanvas } from './components/WallpaperCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { DesktopSimulator } from './components/DesktopSimulator';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [settings, setSettings] = useState<WallpaperSettings>(DEFAULT_SETTINGS);
  const [currentTheme, setCurrentTheme] = useState<LumoraTheme>(LUMORA_THEMES[0]);
  const [desktopPreview, setDesktopPreview] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync currentTheme with settings themeId
  const handleSelectTheme = (theme: LumoraTheme) => {
    setCurrentTheme(theme);
    setSettings((prev) => ({ ...prev, themeId: theme.id }));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen((prev) => !prev);
      } else if (e.key === 'd' || e.key === 'D') {
        setDesktopPreview((prev) => !prev);
      } else if (e.key === 'e' || e.key === 'E') {
        setIsExportOpen(true);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsExportOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      id="lumora-os-app-root"
      className="w-screen h-screen flex flex-col bg-neutral-950 text-neutral-100 overflow-hidden font-sans select-none"
    >
      {/* 1. Header Navigation */}
      <Header
        theme={currentTheme}
        settings={settings}
        onChangeSettings={setSettings}
        desktopPreview={desktopPreview}
        onToggleDesktopPreview={() => setDesktopPreview((prev) => !prev)}
        onOpenExport={() => setIsExportOpen(true)}
        onFullscreenToggle={() => setIsFullscreen((prev) => !prev)}
        isFullscreen={isFullscreen}
      />

      {/* 2. Main Workspace Layout */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 relative overflow-hidden">
        {/* Canvas Display Stage (16:9 Aspect Ratio Focus) */}
        <div className="flex-1 relative flex items-center justify-center bg-black min-h-0 overflow-hidden">
          <WallpaperCanvas
            theme={currentTheme}
            settings={settings}
            onChangeSettings={setSettings}
            onFullscreenToggle={() => setIsFullscreen((prev) => !prev)}
            isFullscreen={isFullscreen}
          />

          {/* Desktop Simulator Overlay */}
          <DesktopSimulator visible={desktopPreview} />
        </div>

        {/* Customization & Settings Sidebar (Hidden in Fullscreen mode) */}
        {!isFullscreen && (
          <ControlsPanel
            settings={settings}
            onChangeSettings={setSettings}
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            desktopPreview={desktopPreview}
            onToggleDesktopPreview={() => setDesktopPreview((prev) => !prev)}
            onOpenExport={() => setIsExportOpen(true)}
          />
        )}
      </main>

      {/* 3. High-Resolution 4K Export Dialogue */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        theme={currentTheme}
        settings={settings}
        onChangeSettings={setSettings}
      />
    </div>
  );
}
