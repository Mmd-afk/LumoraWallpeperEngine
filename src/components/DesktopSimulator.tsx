import React from 'react';
import { 
  Terminal, 
  Folder, 
  Code2, 
  Globe, 
  Cpu, 
  Settings, 
  Wifi, 
  Volume2, 
  Battery, 
  HardDrive, 
  FileCode,
  Sparkles,
  Sliders
} from 'lucide-react';

interface DesktopSimulatorProps {
  visible: boolean;
}

export const DesktopSimulator: React.FC<DesktopSimulatorProps> = ({ visible }) => {
  if (!visible) return null;

  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const desktopIcons = [
    { name: 'Home', icon: Folder },
    { name: 'Projects', icon: HardDrive },
    { name: 'Kernel.ts', icon: FileCode },
    { name: 'Terminal', icon: Terminal },
    { name: 'Editor', icon: Code2 },
    { name: 'Config', icon: Settings },
  ];

  const dockApps = [
    { name: 'Files', icon: Folder, color: 'text-cyan-400' },
    { name: 'Terminal', icon: Terminal, color: 'text-emerald-400' },
    { name: 'Code', icon: Code2, color: 'text-blue-400' },
    { name: 'Browser', icon: Globe, color: 'text-violet-400' },
    { name: 'Monitor', icon: Cpu, color: 'text-amber-400' },
    { name: 'Settings', icon: Sliders, color: 'text-neutral-300' },
  ];

  return (
    <div 
      id="lumora-desktop-simulator-overlay"
      className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between select-none overflow-hidden"
    >
      {/* 1. Lumora OS Modern Top Status Bar */}
      <div className="w-full h-8 px-4 bg-neutral-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between text-xs text-neutral-300 pointer-events-auto">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 font-semibold text-cyan-400 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d8f6]" />
            <span className="font-display">LUMORA OS</span>
          </div>

          <div className="flex items-center space-x-1 bg-white/5 rounded-md px-2 py-0.5 border border-white/5 text-[11px]">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">1</span>
            <span className="px-1.5 py-0.5 text-neutral-400 hover:text-neutral-200">2</span>
            <span className="px-1.5 py-0.5 text-neutral-400 hover:text-neutral-200">3</span>
          </div>

          <span className="text-neutral-400 text-[11px] hidden sm:inline">Workspace Active</span>
        </div>

        {/* Center Clock & Date */}
        <div className="font-medium text-neutral-200 flex items-center space-x-2">
          <span>{dateString}</span>
          <span className="text-neutral-500">•</span>
          <span className="text-white font-semibold">{timeString}</span>
        </div>

        {/* Right System Tray */}
        <div className="flex items-center space-x-3 text-neutral-400">
          <Wifi className="w-3.5 h-3.5 hover:text-neutral-200" />
          <Volume2 className="w-3.5 h-3.5 hover:text-neutral-200" />
          <div className="flex items-center space-x-1">
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px]">98%</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* 2. Left Side Desktop Application Icons (Testing icon legibility) */}
      <div className="p-6 flex flex-col space-y-4 max-w-[120px] pointer-events-auto">
        {desktopIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="flex flex-col items-center group cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-cyan-300 shadow-lg group-hover:scale-105 group-hover:border-cyan-500/40 transition-all">
                <Icon className="w-5 h-5" />
              </div>
              <span className="mt-1.5 text-[11px] font-medium text-neutral-200 text-center tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-1">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Floating Modern Linux Dock at Bottom */}
      <div className="w-full pb-3 flex justify-center pointer-events-auto">
        <div className="px-3 py-2 rounded-2xl bg-neutral-950/50 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center space-x-2">
          {dockApps.map((app, idx) => {
            const Icon = app.icon;
            return (
              <button
                key={idx}
                title={app.name}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 active:scale-95 group relative"
              >
                <Icon className={`w-5 h-5 ${app.color}`} />
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
