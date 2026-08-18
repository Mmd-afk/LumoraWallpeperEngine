import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LumoraTheme, WallpaperSettings } from '../types';
import { renderLumoraWallpaper, getTextCoordinates } from '../utils/renderer';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles, Move, Type, Compass, Target } from 'lucide-react';

interface WallpaperCanvasProps {
  theme: LumoraTheme;
  settings: WallpaperSettings;
  onChangeSettings?: (newSettings: WallpaperSettings) => void;
  onFullscreenToggle: () => void;
  isFullscreen: boolean;
}

export const WallpaperCanvas: React.FC<WallpaperCanvasProps> = ({
  theme,
  settings,
  onChangeSettings,
  onFullscreenToggle,
  isFullscreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isDraggingEmblem, setIsDraggingEmblem] = useState(false);
  const [interactionMode, setInteractionMode] = useState<'auto' | 'move-l' | 'move-text'>('auto');
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Handle canvas rendering
  const render = useCallback(
    (time: number = 0) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const displayWidth = rect.width;
      const displayHeight = rect.height;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Apply Zoom and Pan transformations
      if (zoom !== 1 || pan.x !== 0 || pan.y !== 0) {
        ctx.translate(displayWidth / 2 + pan.x, displayHeight / 2 + pan.y);
        ctx.scale(zoom, zoom);
        ctx.translate(-displayWidth / 2, -displayHeight / 2);
      }

      const parallaxX = settings.mouseParallax ? mousePos.x : 0;
      const parallaxY = settings.mouseParallax ? mousePos.y : 0;

      renderLumoraWallpaper(ctx, {
        width: displayWidth,
        height: displayHeight,
        theme,
        settings,
        parallaxX,
        parallaxY,
        time,
      });

      // If user is actively dragging the central L emblem, draw subtle alignment guide
      if (isDraggingEmblem && settings.showEmblem !== false) {
        const lx = ((settings.letterCenterX !== undefined ? settings.letterCenterX : 50) / 100) * displayWidth;
        const ly = ((settings.letterCenterY !== undefined ? settings.letterCenterY : 50) / 100) * displayHeight;

        ctx.strokeStyle = 'rgba(0, 216, 246, 0.65)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        // Crosshair guides through the L emblem center
        ctx.beginPath();
        ctx.moveTo(lx, 0);
        ctx.lineTo(lx, displayHeight);
        ctx.moveTo(0, ly);
        ctx.lineTo(displayWidth, ly);
        ctx.stroke();

        // Central target circle
        ctx.beginPath();
        ctx.arc(lx, ly, 16, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      // If user is actively dragging the text, draw subtle alignment guide
      if (isDraggingText && settings.enableText) {
        const cx = ((settings.letterCenterX !== undefined ? settings.letterCenterX : 50) / 100) * displayWidth + parallaxX * 28;
        const cy = ((settings.letterCenterY !== undefined ? settings.letterCenterY : 50) / 100) * displayHeight + parallaxY * 20;
        const scale = (Math.min(displayWidth, displayHeight) / 1080) * settings.letterScale;
        const coords = getTextCoordinates(displayWidth, displayHeight, cx, cy, scale, settings);

        ctx.strokeStyle = 'rgba(255, 0, 127, 0.65)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        ctx.moveTo(coords.x, 0);
        ctx.lineTo(coords.x, displayHeight);
        ctx.moveTo(0, coords.y);
        ctx.lineTo(displayWidth, coords.y);
        ctx.stroke();

        ctx.setLineDash([]);
      }

      ctx.restore();
    },
    [theme, settings, mousePos, zoom, pan, isDraggingText, isDraggingEmblem]
  );

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

    const loop = (currentTime: number) => {
      render(currentTime - startTime);
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [render]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      render(performance.now());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  // Check if click is near the text overlay
  const isNearText = (clientX: number, clientY: number): boolean => {
    if (!containerRef.current || !settings.enableText) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const scale = (Math.min(w, h) / 1080) * settings.letterScale;
    const cx = ((settings.letterCenterX !== undefined ? settings.letterCenterX : 50) / 100) * w;
    const cy = ((settings.letterCenterY !== undefined ? settings.letterCenterY : 50) / 100) * h;
    const coords = getTextCoordinates(w, h, cx, cy, scale, settings);

    const hitWidth = 240 * scale * settings.textSize;
    const hitHeight = 70 * scale * settings.textSize;

    return (
      Math.abs(clickX - coords.x) < hitWidth / 2 &&
      Math.abs(clickY - coords.y) < hitHeight / 2
    );
  };

  // Check if click is near the sculpted L emblem center
  const isNearEmblem = (clientX: number, clientY: number): boolean => {
    if (!containerRef.current || settings.showEmblem === false) return false;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const lx = ((settings.letterCenterX !== undefined ? settings.letterCenterX : 50) / 100) * w;
    const ly = ((settings.letterCenterY !== undefined ? settings.letterCenterY : 50) / 100) * h;

    const hitRadius = Math.min(w, h) * 0.22 * settings.letterScale;

    return (
      Math.abs(clickX - lx) < hitRadius &&
      Math.abs(clickY - ly) < hitRadius
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // 1. If explicit 'move-l' mode or clicked on the central emblem
    if (
      (interactionMode === 'move-l' || (interactionMode === 'auto' && isNearEmblem(e.clientX, e.clientY))) &&
      !isNearText(e.clientX, e.clientY)
    ) {
      if (onChangeSettings) {
        setIsDraggingEmblem(true);
        const normX = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
        const normY = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
        onChangeSettings({
          ...settings,
          letterCenterX: Number(normX.toFixed(1)),
          letterCenterY: Number(normY.toFixed(1)),
        });
        return;
      }
    }

    // 2. Check if dragging text
    if (
      settings.enableText &&
      (interactionMode === 'move-text' || isNearText(e.clientX, e.clientY) || settings.textPosition === 'custom')
    ) {
      if (onChangeSettings) {
        setIsDraggingText(true);
        const normX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
        const normY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
        onChangeSettings({
          ...settings,
          textPosition: 'custom',
          textCustomX: Number(normX.toFixed(1)),
          textCustomY: Number(normY.toFixed(1)),
        });
        return;
      }
    }

    // 3. Pan zoom
    if (e.button === 0 && zoom > 1) {
      setIsDraggingPan(true);
      dragStartRef.current = {
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Update central L emblem dragging position
    if (isDraggingEmblem && onChangeSettings) {
      const normX = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
      const normY = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
      onChangeSettings({
        ...settings,
        letterCenterX: Number(normX.toFixed(1)),
        letterCenterY: Number(normY.toFixed(1)),
      });
      return;
    }

    // Update text dragging position
    if (isDraggingText && onChangeSettings) {
      const normX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
      const normY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
      onChangeSettings({
        ...settings,
        textPosition: 'custom',
        textCustomX: Number(normX.toFixed(1)),
        textCustomY: Number(normY.toFixed(1)),
      });
      return;
    }

    // Update Pan
    if (isDraggingPan) {
      setPan({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
      return;
    }

    // Update Parallax
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x: nx, y: ny });
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
    setIsDraggingText(false);
    setIsDraggingEmblem(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const resetEmblemCenter = () => {
    if (onChangeSettings) {
      onChangeSettings({
        ...settings,
        letterCenterX: 50,
        letterCenterY: 50,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      id="lumora-canvas-container"
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none ${
        isDraggingEmblem || isDraggingText
          ? 'cursor-crosshair'
          : zoom > 1
          ? isDraggingPan
            ? 'cursor-grabbing'
            : 'cursor-grab'
          : 'cursor-default'
      }`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        setMousePos({ x: 0, y: 0 });
      }}
    >
      <canvas
        ref={canvasRef}
        id="lumora-wallpaper-canvas"
        className="w-full h-full object-cover block"
      />

      {/* Center "L" Position Indicator Pill */}
      {settings.showEmblem !== false && ((settings.letterCenterX !== undefined && settings.letterCenterX !== 50) || 
        (settings.letterCenterY !== undefined && settings.letterCenterY !== 50)) && (
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 p-1.5 px-2.5 rounded-xl bg-neutral-950/70 backdrop-blur-md border border-cyan-500/30 text-[11px] text-cyan-300 shadow-xl">
          <Target className="w-3.5 h-3.5 text-cyan-400" />
          <span>L Position: {Math.round(settings.letterCenterX || 50)}%, {Math.round(settings.letterCenterY || 50)}%</span>
          <button
            id="btn-recenter-l-quick"
            onClick={resetEmblemCenter}
            className="ml-1 text-[10px] underline hover:text-white"
          >
            Center
          </button>
        </div>
      )}

      {/* Floating Canvas Quick Navigation Bar */}
      <div 
        id="canvas-floating-controls"
        className={`absolute bottom-5 right-5 z-30 flex items-center space-x-1.5 p-1.5 rounded-xl bg-neutral-950/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0 hover:opacity-100' : 'opacity-90 hover:opacity-100'
        }`}
      >
        {/* Quick Drag Mode Toggle */}
        <button
          id="btn-mode-move-l"
          onClick={() => setInteractionMode(interactionMode === 'move-l' ? 'auto' : 'move-l')}
          title="Drag to Reposition Central 'L' Emblem"
          className={`p-1.5 rounded-lg text-xs flex items-center space-x-1 transition-colors ${
            interactionMode === 'move-l'
              ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
              : 'text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Move className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-medium hidden sm:inline">Move L</span>
        </button>

        <button
          id="btn-center-l-action"
          onClick={resetEmblemCenter}
          title="Center L in Middle (50%, 50%)"
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        <button
          id="btn-zoom-in"
          onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
          title="Zoom In"
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <span className="text-[11px] font-mono text-neutral-400 px-1">
          {Math.round(zoom * 100)}%
        </span>

        <button
          id="btn-zoom-out"
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {zoom !== 1 && (
          <button
            id="btn-reset-zoom"
            onClick={resetView}
            title="Reset View"
            className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <div className="w-[1px] h-4 bg-white/10 mx-0.5" />

        <button
          id="btn-toggle-fullscreen"
          onClick={onFullscreenToggle}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Immersive Fullscreen'}
          className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle 4K Native Resolution Tag */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center space-x-2">
        <div className="px-2.5 py-1 rounded-md bg-neutral-950/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300 flex items-center space-x-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-white">4K UHD</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">16:9 • 3840×2160</span>
        </div>
      </div>
    </div>
  );
};


