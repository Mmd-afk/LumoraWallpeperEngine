import React from 'react';
import { LumoraTheme } from '../types';
import { LUMORA_THEMES } from '../data/themes';
import { Check, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  currentThemeId: string;
  onSelectTheme: (theme: LumoraTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onSelectTheme,
}) => {
  return (
    <div id="lumora-theme-selector" className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lumora OS Editions</span>
        </label>
        <span className="text-[11px] text-neutral-500 font-mono">
          {LUMORA_THEMES.length} Presets
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {LUMORA_THEMES.map((theme) => {
          const isSelected = theme.id === currentThemeId;

          return (
            <button
              key={theme.id}
              id={`theme-btn-${theme.id}`}
              onClick={() => onSelectTheme(theme)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group flex flex-col justify-between ${
                isSelected
                  ? 'border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_15px_rgba(0,216,246,0.15)] ring-1 ring-cyan-500/30'
                  : 'border-white/5 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-white/15'
              }`}
            >
              {/* Color Swatch Preview Bar */}
              <div className="flex items-center space-x-1.5 mb-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: theme.accentPrimary }}
                />
                <div
                  className="w-3 h-3 rounded-full border border-white/10 opacity-80"
                  style={{ backgroundColor: theme.accentSecondary }}
                />
                <div
                  className="w-2.5 h-2.5 rounded-full border border-white/10 opacity-60"
                  style={{ backgroundColor: theme.backgroundMid }}
                />

                {isSelected && (
                  <div className="ml-auto">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-neutral-200 group-hover:text-white tracking-tight">
                  {theme.name}
                </div>
                <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                  {theme.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
