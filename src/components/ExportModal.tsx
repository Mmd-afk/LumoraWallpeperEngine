import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LumoraTheme, WallpaperSettings, ExportResolution } from '../types';
import { RESOLUTION_PRESETS } from '../data/themes';
import { renderLumoraWallpaper } from '../utils/renderer';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Monitor, 
  Smartphone,
  Image as ImageIcon, 
  Loader2,
  FileDown,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Clock,
  Battery,
  Wifi,
  HardDrive,
  Type
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: LumoraTheme;
  settings: WallpaperSettings;
  onChangeSettings?: (settings: WallpaperSettings) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  theme,
  settings,
  onChangeSettings,
}) => {
  const [selectedRes, setSelectedRes] = useState<ExportResolution>(RESOLUTION_PRESETS[0]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Preview Controls
  const [previewZoom, setPreviewZoom] = useState<'fit' | '100%'>('fit');
  const [previewMockup, setPreviewMockup] = useState<'none' | 'os' | 'mobile'>('none');
  const [magnifierPos, setMagnifierPos] = useState({ x: 50, y: 50 });
  const [isHoveringPreview, setIsHoveringPreview] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);

  // Render the high-fidelity preview into the modal canvas
  const updatePreviewCanvas = useCallback(() => {
    if (!previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine preview render resolution (scaled down proportionally for crisp preview performance)
    const aspectParts = selectedRes.aspect.split(':').map(Number);
    const aspect = aspectParts.length === 2 ? aspectParts[0] / aspectParts[1] : 16 / 9;

    const maxPreviewWidth = 1280;
    let pw = maxPreviewWidth;
    let ph = Math.round(pw / aspect);

    if (ph > 720) {
      ph = 720;
      pw = Math.round(ph * aspect);
    }

    // Set internal canvas resolution
    canvas.width = pw;
    canvas.height = ph;

    // Render wallpaper to preview canvas
    renderLumoraWallpaper(ctx, {
      width: pw,
      height: ph,
      theme,
      settings,
      parallaxX: 0,
      parallaxY: 0,
      time: 0,
    });
  }, [selectedRes, theme, settings]);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure DOM container is measured
      const timer = setTimeout(() => {
        updatePreviewCanvas();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, updatePreviewCanvas]);

  // Adjust preview mockup based on resolution selection
  useEffect(() => {
    if (selectedRes.aspect === '9:16') {
      setPreviewMockup('mobile');
    } else if (previewMockup === 'mobile') {
      setPreviewMockup('none');
    }
  }, [selectedRes]);

  if (!isOpen) return null;

  const generateHighResCanvas = (): HTMLCanvasElement => {
    const offscreen = document.createElement('canvas');
    offscreen.width = selectedRes.width;
    offscreen.height = selectedRes.height;
    const ctx = offscreen.getContext('2d');

    if (ctx) {
      renderLumoraWallpaper(ctx, {
        width: selectedRes.width,
        height: selectedRes.height,
        theme,
        settings,
        parallaxX: 0,
        parallaxY: 0,
        time: 0,
      });
    }

    return offscreen;
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      // Allow UI thread to show loader
      await new Promise((r) => setTimeout(r, 100));

      const canvas = generateHighResCanvas();
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'jpeg' ? 0.96 : undefined;

      const dataUrl = canvas.toDataURL(mimeType, quality);
      const link = document.createElement('a');
      const filename = `lumora-os-${theme.id}-${selectedRes.width}x${selectedRes.height}.${format}`;
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Trigger celebratory aesthetic confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#00d8f6', '#4f8cff', '#00ffa3', '#ffffff', '#a855f7'],
      });

      setTimeout(() => {
        setIsExporting(false);
      }, 600);
    } catch (err) {
      console.error('Download error:', err);
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      const canvas = generateHighResCanvas();
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsExporting(false);
          return;
        }

        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch (clipErr) {
          console.warn('Clipboard write failed', clipErr);
        } finally {
          setIsExporting(false);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error:', err);
      setIsExporting(false);
    }
  };

  // Estimated file size calculation
  const isPortrait = selectedRes.aspect === '9:16';
  const totalPixels = selectedRes.width * selectedRes.height;
  const estimatedMB = format === 'png' 
    ? (totalPixels * 0.00000085).toFixed(1) 
    : (totalPixels * 0.00000016).toFixed(1);

  const handlePreviewMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMagnifierPos({ x, y });
  };

  return (
    <div 
      id="lumora-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/85 backdrop-blur-2xl animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="lumora-export-modal-container"
        className="w-full max-w-5xl bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 relative my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-neutral-950/60 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-semibold text-sm sm:text-base text-white tracking-tight">
                  Export & 4K Master Preview
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                  {selectedRes.label}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Inspect final wallpaper render before downloading high-res file
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-close-export-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Dual Panel (Preview Left, Settings Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto">
          
          {/* LEFT: Master Live Wallpaper Preview & Inspector */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col space-y-3 bg-neutral-950/60 border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Preview Toolbar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Master Preview</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {selectedRes.width} × {selectedRes.height} ({selectedRes.aspect})
                </span>
              </div>

              {/* Inspector View Mode Toggles */}
              <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-lg border border-white/5 text-[11px]">
                <button
                  onClick={() => setPreviewZoom('fit')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    previewZoom === 'fit'
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Fit whole canvas in frame"
                >
                  Fit View
                </button>
                <button
                  onClick={() => setPreviewZoom('100%')}
                  className={`px-2 py-0.5 rounded transition-all flex items-center space-x-1 ${
                    previewZoom === '100%'
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Inspect 100% 4K micro-texture"
                >
                  <ZoomIn className="w-3 h-3" />
                  <span>100% Lens</span>
                </button>
                
                {/* Mockup Frame Selector */}
                <div className="w-[1px] h-3.5 bg-white/10 mx-0.5" />
                <button
                  onClick={() => setPreviewMockup(previewMockup === 'none' ? (isPortrait ? 'mobile' : 'os') : 'none')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    previewMockup !== 'none'
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Toggle OS desktop or phone mockup overlay"
                >
                  {previewMockup !== 'none' ? 'Hide UI' : 'Test UI'}
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas Frame */}
            <div 
              ref={previewContainerRef}
              id="export-preview-viewport"
              onMouseMove={handlePreviewMouseMove}
              onMouseEnter={() => setIsHoveringPreview(true)}
              onMouseLeave={() => setIsHoveringPreview(false)}
              className="relative flex-1 min-h-[260px] sm:min-h-[340px] rounded-xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center shadow-inner group select-none"
            >
              {/* Canvas element with dynamic scaling */}
              <div 
                className="relative transition-transform duration-200 ease-out origin-center flex items-center justify-center"
                style={{
                  transform: previewZoom === '100%' 
                    ? `scale(2.2) translate(${(50 - magnifierPos.x) * 0.4}%, ${(50 - magnifierPos.y) * 0.4}%)`
                    : 'scale(1)',
                }}
              >
                <canvas
                  ref={previewCanvasRef}
                  id="lumora-export-preview-canvas"
                  className="max-w-full max-h-[340px] rounded-lg shadow-2xl object-contain"
                />

                {/* Optional UI Mockup Overlays */}
                {previewMockup === 'os' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
                    {/* Simulated Top Menu Bar */}
                    <div className="h-4 w-full bg-black/40 backdrop-blur-md rounded px-2 flex items-center justify-between text-[8px] text-white/80 border border-white/5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">LUMORA OS</span>
                        <span className="text-white/60">File</span>
                        <span className="text-white/60">Edit</span>
                        <span className="text-white/60">View</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[7px] text-white/70">
                        <Wifi className="w-2 h-2" />
                        <Battery className="w-2 h-2" />
                        <span>12:45 PM</span>
                      </div>
                    </div>

                    {/* Simulated Desktop Icons on Left */}
                    <div className="space-y-3 py-2 px-1">
                      <div className="flex flex-col items-center w-7 space-y-0.5">
                        <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 text-[8px] backdrop-blur-sm shadow">
                          <HardDrive className="w-3 h-3" />
                        </div>
                        <span className="text-[7px] text-white/90 font-medium">Macintosh</span>
                      </div>
                      <div className="flex flex-col items-center w-7 space-y-0.5">
                        <div className="w-6 h-6 rounded-md bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-[8px] backdrop-blur-sm shadow">
                          <ImageIcon className="w-3 h-3" />
                        </div>
                        <span className="text-[7px] text-white/90 font-medium">Photos</span>
                      </div>
                    </div>

                    {/* Simulated Floating Bottom Dock */}
                    <div className="self-center mb-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center space-x-2 shadow-2xl">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-4 rounded-md bg-white/20 border border-white/30" />
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulated Phone Lockscreen Mockup */}
                {previewMockup === 'mobile' && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center py-6 px-4">
                    <div className="flex flex-col items-center text-white space-y-0.5">
                      <div className="text-[9px] uppercase tracking-widest text-white/80 font-medium">Sunday, Aug 16</div>
                      <div className="text-3xl font-display font-bold tracking-tight text-white drop-shadow-md">09:41</div>
                    </div>

                    <div className="w-full flex justify-between px-3 text-white/80">
                      <div className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-[9px]">
                        Flash
                      </div>
                      <div className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/10 text-[9px]">
                        Camera
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 100% Zoom Helper Hint */}
              {previewZoom === '100%' && (
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-cyan-500/30 text-[10px] text-cyan-300 flex items-center space-x-1.5 shadow-lg">
                  <Eye className="w-3 h-3" />
                  <span>Inspecting 4K Frosted Edge & Micro-Grain (Move mouse to pan)</span>
                </div>
              )}
            </div>

            {/* Aesthetic Spec Sheet Summary */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-neutral-500 block">Output Format</span>
                <span className="font-semibold text-neutral-200">
                  {format.toUpperCase()} ({format === 'png' ? '32-Bit Lossless' : '96% Quality'})
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-neutral-500 block">Estimated Size</span>
                <span className="font-semibold text-cyan-300 font-mono">
                  ~{estimatedMB} MB
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-white/5">
                <span className="text-[10px] text-neutral-500 block">Theme Edition</span>
                <span className="font-semibold text-neutral-200 truncate block">
                  {theme.name}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Resolution & Export Action Controls */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-5 bg-neutral-900/40">
            <div className="space-y-4">
              
              {/* 1. Target Resolution Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Choose Target Resolution</span>
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {RESOLUTION_PRESETS.map((res, i) => {
                    const isSelected = res.width === selectedRes.width && res.height === selectedRes.height;
                    return (
                      <button
                        key={i}
                        id={`btn-res-${res.width}x${res.height}`}
                        onClick={() => setSelectedRes(res)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/40 text-white shadow-[0_0_12px_rgba(0,216,246,0.2)]'
                            : 'border-white/5 bg-neutral-950/40 text-neutral-300 hover:bg-neutral-800/60 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">{res.label}</span>
                          {res.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 font-semibold">
                              {res.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {res.width} × {res.height} ({res.aspect})
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. File Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Encoding Format</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-format-png"
                    onClick={() => setFormat('png')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      format === 'png'
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">PNG (Master 4K)</div>
                      <div className="text-[10px] text-neutral-400">Zero compression loss</div>
                    </div>
                    {format === 'png' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    id="btn-format-jpeg"
                    onClick={() => setFormat('jpeg')}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      format === 'jpeg'
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">JPEG (96% High-Q)</div>
                      <div className="text-[10px] text-neutral-400">Smaller file footprint</div>
                    </div>
                    {format === 'jpeg' && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>

              {/* 3. Text Branding & Clean Wallpaper Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <Type className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Branding Typography</span>
                  </label>
                  {onChangeSettings && (
                    <button
                      id="export-modal-toggle-text-btn"
                      onClick={() => onChangeSettings({ ...settings, enableText: !settings.enableText })}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded transition-all flex items-center space-x-1 ${
                        settings.enableText 
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-neutral-800 text-neutral-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <span>{settings.enableText ? 'Text Enabled' : 'Text Disabled (Clean)'}</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-export-text-enabled"
                    onClick={() => onChangeSettings && onChangeSettings({ ...settings, enableText: true })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      settings.enableText
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">Include Text</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[130px]">"{settings.textString}"</div>
                    </div>
                    {settings.enableText && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    id="btn-export-text-disabled"
                    onClick={() => onChangeSettings && onChangeSettings({ ...settings, enableText: false })}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      !settings.enableText
                        ? 'border-cyan-500 bg-cyan-950/30 text-white'
                        : 'border-white/5 bg-neutral-950/40 text-neutral-400 hover:bg-neutral-800/50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">Clean Minimal</div>
                      <div className="text-[10px] text-neutral-400">Pure wallpaper, no text</div>
                    </div>
                    {!settings.enableText && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Export Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-white/5">
              <button
                id="btn-confirm-download"
                onClick={handleDownload}
                disabled={isExporting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 font-bold text-sm shadow-[0_0_25px_rgba(0,216,246,0.35)] transition-all flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering Ultra-HD Master...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download {selectedRes.width === 3840 ? '4K Ultra HD' : selectedRes.label}</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-copy-clipboard"
                  onClick={handleCopyToClipboard}
                  disabled={isExporting}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 border border-white/10 active:scale-95 disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copy Image Bitmap</span>
                    </>
                  )}
                </button>

                <button
                  id="btn-cancel-modal"
                  onClick={onClose}
                  className="py-2 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-medium transition-colors border border-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
