import { LumoraTheme, WallpaperSettings } from '../types';

export interface RenderOptions {
  width: number;
  height: number;
  theme: LumoraTheme;
  settings: WallpaperSettings;
  parallaxX?: number; // -1 to 1
  parallaxY?: number; // -1 to 1
  time?: number;
}

/**
 * High-performance 4K Procedural Wallpaper Renderer for Lumora OS
 */
export function renderLumoraWallpaper(
  ctx: CanvasRenderingContext2D,
  options: RenderOptions
) {
  const { width, height, theme, settings, parallaxX = 0, parallaxY = 0, time = 0 } = options;

  ctx.save();
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2 + parallaxX * 28;
  const cy = height / 2 + parallaxY * 20;
  const scale = (Math.min(width, height) / 1080) * settings.letterScale;

  // 1. Sophisticated Deep Dark Background with Volumetric Ambient Cones
  drawBackground(ctx, width, height, theme, settings, cx, cy);

  // 2. Deep Background Luminescence & Architectural Sweep Curves
  drawDeepArchitecture(ctx, width, height, theme, settings, cx, cy, scale, time);

  // 3. Midground Fluid Glass Ribbons & Refractive Flowing Layers
  drawFlowingGlassRibbons(ctx, width, height, theme, settings, cx, cy, scale, time);

  // 4. Central Sculpted Capital "L" with Refined Glass & Lighting
  drawSculptedLetterL(ctx, cx, cy, scale, theme, settings, time);

  // 5. Foreground Translucent Accent Shards & Specular Rim Caustics
  drawForegroundGlassAccents(ctx, width, height, theme, settings, cx, cy, scale);

  // 6. Subtle Ambient Stardust / Volumetric Bokeh Particles
  if (settings.particleDensity > 0.05) {
    drawAmbientParticles(ctx, width, height, theme, settings, scale);
  }

  // 7. Optional Lumora Typography & Branding Text Overlay
  if (settings.enableText && settings.textString.trim().length > 0) {
    drawLumoraText(ctx, width, height, theme, settings, cx, cy, scale);
  }

  // 8. Vignette & Subtle Film Micro-Grain (Anti-Banding)
  drawVignetteAndGrain(ctx, width, height, theme, settings);

  ctx.restore();
}

/**
 * 1. Deep Multi-Stop Radial & Conic Ambient Background
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  cx: number,
  cy: number
) {
  // Base dark fill
  ctx.fillStyle = theme.backgroundStart;
  ctx.fillRect(0, 0, width, height);

  // Deep ambient conic/radial glow centered behind the focal point
  const radGlow = ctx.createRadialGradient(
    cx,
    cy - height * 0.08,
    width * 0.05,
    cx,
    cy,
    Math.max(width, height) * 0.85
  );
  radGlow.addColorStop(0, theme.backgroundMid);
  radGlow.addColorStop(0.45, theme.backgroundStart);
  radGlow.addColorStop(1, theme.backgroundEnd);

  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, width, height);

  // Directional Light Beam from lightAngle
  const rad = (settings.lightAngle * Math.PI) / 180;
  const lx = cx - Math.cos(rad) * width * 0.45;
  const ly = cy - Math.sin(rad) * height * 0.45;

  const lightBeam = ctx.createRadialGradient(
    lx,
    ly,
    width * 0.02,
    lx,
    ly,
    Math.max(width, height) * 0.75
  );
  lightBeam.addColorStop(0, hexToRgba(theme.accentPrimary, 0.22 * settings.lightIntensity));
  lightBeam.addColorStop(0.3, hexToRgba(theme.accentSecondary, 0.1 * settings.lightIntensity));
  lightBeam.addColorStop(0.7, hexToRgba(theme.glowColor, 0.03));
  lightBeam.addColorStop(1, 'transparent');

  ctx.fillStyle = lightBeam;
  ctx.fillRect(0, 0, width, height);

  // Soft secondary atmospheric haze on the bottom right
  const secondaryHaze = ctx.createRadialGradient(
    cx + width * 0.28,
    cy + height * 0.25,
    width * 0.02,
    cx + width * 0.28,
    cy + height * 0.25,
    width * 0.55
  );
  secondaryHaze.addColorStop(0, hexToRgba(theme.accentTertiary, 0.09 * settings.lightIntensity));
  secondaryHaze.addColorStop(1, 'transparent');

  ctx.fillStyle = secondaryHaze;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 2. Deep Architectural Sweeps & Volumetric Waves
 */
function drawDeepArchitecture(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  cx: number,
  cy: number,
  scale: number,
  time: number
) {
  ctx.save();

  // Subtle animated breathing or static elegance
  const t = time * 0.0003;

  // Outer ambient glow ring/arc representing digital architecture
  ctx.beginPath();
  ctx.arc(cx - 30 * scale, cy + 20 * scale, 340 * scale, Math.PI * 0.75, Math.PI * 1.9);
  ctx.strokeStyle = hexToRgba(theme.accentPrimary, 0.12 * settings.glowSpread);
  ctx.lineWidth = 48 * scale;
  ctx.lineCap = 'round';
  ctx.filter = `blur(${18 * scale}px)`;
  ctx.stroke();
  ctx.filter = 'none';

  // Smooth architectural parabolic lines
  for (let i = 0; i < settings.ribbonComplexity + 1; i++) {
    const offset = (i - 2) * 55 * scale;
    const alpha = 0.06 - i * 0.01;

    ctx.beginPath();
    ctx.moveTo(cx - 580 * scale, cy + 340 * scale + offset * 0.4);
    ctx.bezierCurveTo(
      cx - 280 * scale, cy + 320 * scale + offset,
      cx - 140 * scale, cy - 260 * scale + offset,
      cx + 420 * scale + offset * 0.5, cy - 220 * scale + Math.sin(t + i) * 15
    );

    const grad = ctx.createLinearGradient(
      cx - 400 * scale, cy + 300 * scale,
      cx + 400 * scale, cy - 200 * scale
    );
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.3, hexToRgba(theme.accentSecondary, alpha * settings.lightIntensity));
    grad.addColorStop(0.7, hexToRgba(theme.accentPrimary, alpha * 1.5 * settings.lightIntensity));
    grad.addColorStop(1, 'transparent');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 14 * scale;
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 3. Midground Layered Fluid Glass Ribbons
 */
function drawFlowingGlassRibbons(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  cx: number,
  cy: number,
  scale: number,
  time: number
) {
  ctx.save();

  // Ribbon A: Sweeping from bottom-left through the base of the L into the right
  ctx.save();
  const ribbonAGrad = ctx.createLinearGradient(
    cx - 420 * scale, cy + 240 * scale,
    cx + 480 * scale, cy + 120 * scale
  );
  ribbonAGrad.addColorStop(0, 'transparent');
  ribbonAGrad.addColorStop(0.2, hexToRgba(theme.glassTint, 0.7));
  ribbonAGrad.addColorStop(0.5, hexToRgba(theme.accentPrimary, 0.25 * settings.lightIntensity));
  ribbonAGrad.addColorStop(0.8, hexToRgba(theme.accentSecondary, 0.4 * settings.lightIntensity));
  ribbonAGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(cx - 520 * scale, cy + 240 * scale);
  ctx.bezierCurveTo(
    cx - 240 * scale, cy + 260 * scale,
    cx - 60 * scale, cy + 180 * scale,
    cx + 120 * scale, cy + 190 * scale
  );
  ctx.bezierCurveTo(
    cx + 340 * scale, cy + 200 * scale,
    cx + 480 * scale, cy + 110 * scale,
    cx + 560 * scale, cy + 70 * scale
  );
  ctx.bezierCurveTo(
    cx + 460 * scale, cy + 170 * scale,
    cx + 280 * scale, cy + 260 * scale,
    cx + 80 * scale, cy + 250 * scale
  );
  ctx.bezierCurveTo(
    cx - 100 * scale, cy + 240 * scale,
    cx - 320 * scale, cy + 310 * scale,
    cx - 520 * scale, cy + 240 * scale
  );
  ctx.closePath();

  // Glass drop shadow
  ctx.shadowColor = theme.shadowColor;
  ctx.shadowBlur = 32 * scale * settings.depthAmount;
  ctx.shadowOffsetY = 16 * scale;
  ctx.fillStyle = ribbonAGrad;
  ctx.fill();

  // Specular top edge highlight on Ribbon A
  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.moveTo(cx - 480 * scale, cy + 245 * scale);
  ctx.bezierCurveTo(
    cx - 240 * scale, cy + 260 * scale,
    cx - 60 * scale, cy + 180 * scale,
    cx + 120 * scale, cy + 190 * scale
  );
  ctx.bezierCurveTo(
    cx + 340 * scale, cy + 200 * scale,
    cx + 480 * scale, cy + 110 * scale,
    cx + 560 * scale, cy + 70 * scale
  );
  
  const edgeAGrad = ctx.createLinearGradient(
    cx - 300 * scale, cy + 220 * scale,
    cx + 450 * scale, cy + 100 * scale
  );
  edgeAGrad.addColorStop(0, 'transparent');
  edgeAGrad.addColorStop(0.3, hexToRgba(theme.rimLight, 0.45));
  edgeAGrad.addColorStop(0.65, hexToRgba(theme.rimLight, 0.85 * settings.lightIntensity));
  edgeAGrad.addColorStop(1, 'transparent');

  ctx.strokeStyle = edgeAGrad;
  ctx.lineWidth = 2.2 * scale;
  ctx.stroke();
  ctx.restore();

  // Ribbon B: Vertical sweeping architectural glass fin supporting the back of the L
  ctx.save();
  const finGrad = ctx.createLinearGradient(
    cx - 190 * scale, cy - 320 * scale,
    cx - 60 * scale, cy + 220 * scale
  );
  finGrad.addColorStop(0, 'transparent');
  finGrad.addColorStop(0.3, hexToRgba(theme.glassTint, 0.6));
  finGrad.addColorStop(0.6, hexToRgba(theme.accentSecondary, 0.2 * settings.lightIntensity));
  finGrad.addColorStop(0.9, hexToRgba(theme.glassTint, 0.4));
  finGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(cx - 160 * scale, cy - 310 * scale);
  ctx.bezierCurveTo(
    cx - 190 * scale, cy - 140 * scale,
    cx - 210 * scale, cy + 40 * scale,
    cx - 140 * scale, cy + 210 * scale
  );
  ctx.bezierCurveTo(
    cx - 90 * scale, cy + 200 * scale,
    cx - 120 * scale, cy - 20 * scale,
    cx - 100 * scale, cy - 260 * scale
  );
  ctx.closePath();

  ctx.shadowColor = theme.shadowColor;
  ctx.shadowBlur = 24 * scale;
  ctx.fillStyle = finGrad;
  ctx.fill();

  // Rim highlight on fin
  ctx.shadowColor = 'transparent';
  ctx.beginPath();
  ctx.moveTo(cx - 160 * scale, cy - 310 * scale);
  ctx.bezierCurveTo(
    cx - 190 * scale, cy - 140 * scale,
    cx - 210 * scale, cy + 40 * scale,
    cx - 140 * scale, cy + 210 * scale
  );
  ctx.strokeStyle = hexToRgba(theme.rimLight, 0.6 * settings.lightIntensity);
  ctx.lineWidth = 1.8 * scale;
  ctx.stroke();
  ctx.restore();

  // Ribbon C: Ascending curved light wave wrapping behind and through
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 280 * scale, cy + 160 * scale);
  ctx.bezierCurveTo(
    cx - 120 * scale, cy + 60 * scale,
    cx + 80 * scale, cy - 80 * scale,
    cx + 260 * scale, cy - 220 * scale
  );
  ctx.bezierCurveTo(
    cx + 230 * scale, cy - 230 * scale,
    cx + 30 * scale, cy - 60 * scale,
    cx - 240 * scale, cy + 180 * scale
  );
  ctx.closePath();

  const ribbonCGrad = ctx.createLinearGradient(
    cx - 200 * scale, cy + 100 * scale,
    cx + 250 * scale, cy - 200 * scale
  );
  ribbonCGrad.addColorStop(0, hexToRgba(theme.accentPrimary, 0.15 * settings.lightIntensity));
  ribbonCGrad.addColorStop(0.5, hexToRgba(theme.accentTertiary, 0.28 * settings.lightIntensity));
  ribbonCGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = ribbonCGrad;
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

/**
 * 4. Central Sculpted Capital "L" with Refined Frosted Glass,
 * Internal Reflections, Beveled 3D Depth, and Specular Rim Lighting
 */
function drawSculptedLetterL(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  time: number
) {
  ctx.save();

  // Define geometric coordinates for the modern sculpted L
  // Stem top: (-70, -220), Stem right: (-10, -220)
  // Inner corner: (-10, 110)
  // Foot top-right: (190, 110)
  // Foot bottom-right: (220, 175)
  // Outer corner: (-70, 175)
  // We incorporate refined organic chamfers and bevel extensions
  
  const sx = cx - 25 * scale;
  const sy = cy - 10 * scale;

  // Geometry dimensions
  const stemLeft = sx - 68 * scale;
  const stemRight = sx - 10 * scale;
  const topY = sy - 230 * scale;
  const footRight = sx + 225 * scale;
  const bottomY = sy + 175 * scale;
  const innerY = sy + 112 * scale;
  const cornerRadius = 24 * scale;

  // A. Deep Ambient Shadow / Occlusion behind L
  ctx.save();
  ctx.beginPath();
  createSculptedLPath(ctx, stemLeft, stemRight, topY, footRight, bottomY, innerY, cornerRadius, scale);
  ctx.shadowColor = theme.shadowColor;
  ctx.shadowBlur = 48 * scale * settings.depthAmount;
  ctx.shadowOffsetX = -8 * scale;
  ctx.shadowOffsetY = 24 * scale * settings.depthAmount;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fill();
  ctx.restore();

  // B. 3D Volumetric Extrusion / Glass Depth Layer (Bevel edge)
  const rad = (settings.lightAngle * Math.PI) / 180;
  const depthX = Math.cos(rad) * 14 * scale * settings.depthAmount;
  const depthY = Math.sin(rad) * 14 * scale * settings.depthAmount;

  ctx.save();
  ctx.beginPath();
  createSculptedLPath(ctx, stemLeft - depthX, stemRight - depthX * 0.5, topY - depthY, footRight - depthX * 0.5, bottomY - depthY, innerY - depthY, cornerRadius, scale);
  const bevelGrad = ctx.createLinearGradient(
    stemLeft, topY,
    footRight, bottomY
  );
  bevelGrad.addColorStop(0, hexToRgba(theme.accentSecondary, 0.4 * settings.lightIntensity));
  bevelGrad.addColorStop(0.5, hexToRgba(theme.glassTint, 0.8));
  bevelGrad.addColorStop(1, hexToRgba(theme.accentPrimary, 0.5 * settings.lightIntensity));
  ctx.fillStyle = bevelGrad;
  ctx.fill();
  ctx.restore();

  // C. Main Glass Body (Frosted Crystal Acrylic Material)
  ctx.save();
  ctx.beginPath();
  createSculptedLPath(ctx, stemLeft, stemRight, topY, footRight, bottomY, innerY, cornerRadius, scale);
  
  // Glass body multi-stop gradient with chromatic depth
  const glassGrad = ctx.createLinearGradient(
    stemLeft - 40 * scale, topY - 30 * scale,
    footRight + 40 * scale, bottomY + 30 * scale
  );
  glassGrad.addColorStop(0, hexToRgba(theme.accentPrimary, 0.35 * settings.lightIntensity));
  glassGrad.addColorStop(0.2, hexToRgba(theme.glassTint, 0.75));
  glassGrad.addColorStop(0.55, hexToRgba(theme.backgroundMid, 0.6));
  glassGrad.addColorStop(0.8, hexToRgba(theme.glassTint, 0.8));
  glassGrad.addColorStop(1, hexToRgba(theme.accentSecondary, 0.45 * settings.lightIntensity));

  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Soft internal caustics and light refraction sheen
  ctx.clip(); // clip to L silhouette for internal glass physics

  // Internal Light Caustic 1 (Angular diagonal light slit)
  const caustic1 = ctx.createLinearGradient(
    stemLeft - 20 * scale, topY,
    stemRight + 60 * scale, innerY
  );
  caustic1.addColorStop(0, 'transparent');
  caustic1.addColorStop(0.48, hexToRgba(theme.rimLight, 0.05));
  caustic1.addColorStop(0.5, hexToRgba(theme.accentPrimary, 0.4 * settings.lightIntensity));
  caustic1.addColorStop(0.53, hexToRgba(theme.rimLight, 0.6 * settings.lightIntensity));
  caustic1.addColorStop(0.57, hexToRgba(theme.accentTertiary, 0.25));
  caustic1.addColorStop(0.65, 'transparent');

  ctx.fillStyle = caustic1;
  ctx.fillRect(stemLeft - 100 * scale, topY - 100 * scale, (footRight - stemLeft) + 200 * scale, (bottomY - topY) + 200 * scale);

  // Internal Light Caustic 2 (Refraction glow in the corner elbow)
  const cornerCaustic = ctx.createRadialGradient(
    stemRight + 10 * scale, innerY + 10 * scale, 5 * scale,
    stemRight + 10 * scale, innerY + 10 * scale, 120 * scale
  );
  cornerCaustic.addColorStop(0, hexToRgba(theme.accentPrimary, 0.55 * settings.lightIntensity));
  cornerCaustic.addColorStop(0.4, hexToRgba(theme.accentSecondary, 0.25 * settings.lightIntensity));
  cornerCaustic.addColorStop(1, 'transparent');

  ctx.fillStyle = cornerCaustic;
  ctx.fillRect(stemLeft - 20 * scale, innerY - 40 * scale, 180 * scale, 140 * scale);

  // Internal frosted texture streaks
  ctx.strokeStyle = hexToRgba(theme.rimLight, 0.12);
  ctx.lineWidth = 1 * scale;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(stemLeft + 12 * scale + i * 14 * scale, topY + 20 * scale);
    ctx.lineTo(stemLeft + 12 * scale + i * 14 * scale, innerY - 10 * scale);
    ctx.stroke();
  }

  ctx.restore();

  // D. Specular Rim Lighting & Refractive Glass Edges
  // Top stem rim light
  ctx.save();
  ctx.beginPath();
  createSculptedLPath(ctx, stemLeft, stemRight, topY, footRight, bottomY, innerY, cornerRadius, scale);
  
  const rimGrad = ctx.createLinearGradient(
    stemLeft - 20 * scale, topY - 20 * scale,
    footRight + 20 * scale, bottomY + 20 * scale
  );
  rimGrad.addColorStop(0, hexToRgba(theme.rimLight, 0.95 * settings.lightIntensity));
  rimGrad.addColorStop(0.3, hexToRgba(theme.accentPrimary, 0.7 * settings.lightIntensity));
  rimGrad.addColorStop(0.6, hexToRgba(theme.rimLight, 0.3));
  rimGrad.addColorStop(0.85, hexToRgba(theme.accentSecondary, 0.85 * settings.lightIntensity));
  rimGrad.addColorStop(1, hexToRgba(theme.rimLight, 0.95 * settings.lightIntensity));

  ctx.strokeStyle = rimGrad;
  ctx.lineWidth = 2.4 * scale;
  ctx.stroke();
  ctx.restore();

  // E. Intense Focal Specular Gleam on the Top-Left Glass Tip
  ctx.save();
  const tipGlow = ctx.createRadialGradient(
    stemLeft + 8 * scale, topY + 8 * scale, 1 * scale,
    stemLeft + 8 * scale, topY + 8 * scale, 48 * scale
  );
  tipGlow.addColorStop(0, '#ffffff');
  tipGlow.addColorStop(0.2, hexToRgba(theme.rimLight, 0.85));
  tipGlow.addColorStop(0.5, hexToRgba(theme.accentPrimary, 0.45 * settings.lightIntensity));
  tipGlow.addColorStop(1, 'transparent');

  ctx.fillStyle = tipGlow;
  ctx.beginPath();
  ctx.arc(stemLeft + 8 * scale, topY + 8 * scale, 48 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Horizontal Foot Endpoint Gleam
  const footGlow = ctx.createRadialGradient(
    footRight - 4 * scale, innerY + (bottomY - innerY) * 0.5, 1 * scale,
    footRight - 4 * scale, innerY + (bottomY - innerY) * 0.5, 42 * scale
  );
  footGlow.addColorStop(0, '#ffffff');
  footGlow.addColorStop(0.25, hexToRgba(theme.accentTertiary, 0.85));
  footGlow.addColorStop(0.6, hexToRgba(theme.accentPrimary, 0.35));
  footGlow.addColorStop(1, 'transparent');

  ctx.fillStyle = footGlow;
  ctx.beginPath();
  ctx.arc(footRight - 4 * scale, innerY + (bottomY - innerY) * 0.5, 42 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.restore();
}

/**
 * Creates the vector path for the stylized architectural "L"
 */
function createSculptedLPath(
  ctx: CanvasRenderingContext2D,
  stemLeft: number,
  stemRight: number,
  topY: number,
  footRight: number,
  bottomY: number,
  innerY: number,
  r: number,
  scale: number
) {
  const chamfer = 14 * scale;
  const tipRadius = 8 * scale;

  ctx.moveTo(stemLeft + tipRadius, topY);
  
  // Top stem horizontal crown
  ctx.lineTo(stemRight - tipRadius, topY);
  ctx.arcTo(stemRight, topY, stemRight, topY + tipRadius, tipRadius);
  
  // Inner vertical edge descending towards elbow
  ctx.lineTo(stemRight, innerY - r);
  
  // Smooth inner elbow curve transitioning to horizontal base
  ctx.arcTo(stemRight, innerY, stemRight + r, innerY, r);
  
  // Top horizontal foot line extending right
  ctx.lineTo(footRight - tipRadius, innerY);
  ctx.arcTo(footRight, innerY, footRight, innerY + tipRadius, tipRadius);
  
  // Rightmost tip of foot (sculpted aerodynamic taper)
  ctx.lineTo(footRight + chamfer * 0.4, innerY + (bottomY - innerY) * 0.5);
  ctx.lineTo(footRight, bottomY - tipRadius);
  ctx.arcTo(footRight, bottomY, footRight - tipRadius, bottomY, tipRadius);
  
  // Bottom horizontal base line returning left
  ctx.lineTo(stemLeft + r, bottomY);
  
  // Outer corner curve
  ctx.arcTo(stemLeft, bottomY, stemLeft, bottomY - r, r);
  
  // Outer vertical spine ascending to top
  ctx.lineTo(stemLeft, topY + tipRadius);
  ctx.arcTo(stemLeft, topY, stemLeft + tipRadius, topY, tipRadius);
  
  ctx.closePath();
}

/**
 * 5. Foreground Translucent Accent Shards & Precision Light Caustics
 */
function drawForegroundGlassAccents(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();

  // Floating crystalline light fin over the right side
  ctx.save();
  const finX = cx + 180 * scale;
  const finY = cy - 80 * scale;

  ctx.beginPath();
  ctx.moveTo(finX, finY - 140 * scale);
  ctx.bezierCurveTo(
    finX + 80 * scale, finY - 40 * scale,
    finX + 110 * scale, finY + 80 * scale,
    finX + 30 * scale, finY + 180 * scale
  );
  ctx.bezierCurveTo(
    finX + 50 * scale, finY + 70 * scale,
    finX + 40 * scale, finY - 30 * scale,
    finX, finY - 140 * scale
  );
  ctx.closePath();

  const shardGrad = ctx.createLinearGradient(
    finX, finY - 140 * scale,
    finX + 90 * scale, finY + 180 * scale
  );
  shardGrad.addColorStop(0, hexToRgba(theme.accentPrimary, 0.45 * settings.lightIntensity));
  shardGrad.addColorStop(0.5, hexToRgba(theme.glassTint, 0.3));
  shardGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = shardGrad;
  ctx.fill();

  // Shard rim
  ctx.strokeStyle = hexToRgba(theme.rimLight, 0.7 * settings.lightIntensity);
  ctx.lineWidth = 1.4 * scale;
  ctx.stroke();
  ctx.restore();

  // Secondary soft light flare across the horizontal foot of L
  ctx.save();
  const flareGrad = ctx.createRadialGradient(
    cx + 120 * scale, cy + 140 * scale, 2 * scale,
    cx + 120 * scale, cy + 140 * scale, 180 * scale
  );
  flareGrad.addColorStop(0, hexToRgba(theme.accentPrimary, 0.35 * settings.lightIntensity));
  flareGrad.addColorStop(0.3, hexToRgba(theme.accentSecondary, 0.15 * settings.lightIntensity));
  flareGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = flareGrad;
  ctx.fillRect(cx - 50 * scale, cy + 40 * scale, 360 * scale, 200 * scale);
  ctx.restore();

  ctx.restore();
}

/**
 * 6. Subtle Ambient Stardust / Volumetric Depth Bokeh
 */
function drawAmbientParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  scale: number
) {
  ctx.save();

  // Deterministic seed generation for consistent particle distribution
  const particleCount = Math.floor(40 * settings.particleDensity);
  
  for (let i = 0; i < particleCount; i++) {
    // Generate pseudorandom coordinates concentrated near the center-right luminous area
    const seedX = (Math.sin(i * 997.3) * 0.5 + 0.5);
    const seedY = (Math.cos(i * 613.7) * 0.5 + 0.5);
    const seedSize = (Math.sin(i * 331.1) * 0.5 + 0.5);
    const seedAlpha = (Math.cos(i * 157.9) * 0.5 + 0.5);

    // Keep particles out of the leftmost area so desktop icons stay 100% clean
    const px = width * (0.28 + seedX * 0.62);
    const py = height * (0.15 + seedY * 0.7);
    const pSize = (1.2 + seedSize * 2.8) * scale;
    const pAlpha = (0.12 + seedAlpha * 0.35) * settings.lightIntensity;

    const pGrad = ctx.createRadialGradient(px, py, 0, px, py, pSize * 2.5);
    pGrad.addColorStop(0, hexToRgba(theme.rimLight, pAlpha));
    pGrad.addColorStop(0.4, hexToRgba(theme.accentPrimary, pAlpha * 0.6));
    pGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(px, py, pSize * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 7. Vignette & Subtle Film Micro-Grain (Anti-Banding)
 */
function drawVignetteAndGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings
) {
  ctx.save();

  // Smooth cinematic radial vignette
  const maxDim = Math.sqrt(width * width + height * height) * 0.5;
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, maxDim * 0.45,
    width / 2, height / 2, maxDim * 1.05
  );
  vignette.addColorStop(0, 'transparent');
  vignette.addColorStop(0.7, `rgba(0, 0, 0, ${0.4 * theme.vignetteStrength})`);
  vignette.addColorStop(1, `rgba(0, 0, 0, ${0.85 * theme.vignetteStrength})`);

  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  // Micro-Grain texture to eliminate any digital 8-bit banding on dark gradients
  if (settings.grainAmount > 0.01) {
    const grainCanvas = document.createElement('canvas');
    grainCanvas.width = 128;
    grainCanvas.height = 128;
    const gCtx = grainCanvas.getContext('2d');
    if (gCtx) {
      const imgData = gCtx.createImageData(128, 128);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.random() * (settings.grainAmount * 38);
      }
      gCtx.putImageData(imgData, 0, 0);

      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }

  ctx.restore();
}

/**
 * Resolves the X, Y center position for the text overlay
 */
export function getTextCoordinates(
  width: number,
  height: number,
  cx: number,
  cy: number,
  scale: number,
  settings: WallpaperSettings
): { x: number; y: number } {
  switch (settings.textPosition) {
    case 'bottom-center':
      return { x: width * 0.5, y: height * 0.88 };
    case 'bottom-right':
      return { x: width * 0.82, y: height * 0.88 };
    case 'bottom-left':
      return { x: width * 0.18, y: height * 0.88 };
    case 'top-left':
      return { x: width * 0.18, y: height * 0.14 };
    case 'top-right':
      return { x: width * 0.82, y: height * 0.14 };
    case 'center-below-l':
      return { x: cx, y: cy + 245 * scale };
    case 'custom':
    default:
      return {
        x: width * (settings.textCustomX / 100),
        y: height * (settings.textCustomY / 100),
      };
  }
}

/**
 * 7. Draws the stylized Lumora OS branding typography with customizable placement & color
 */
function drawLumoraText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: LumoraTheme,
  settings: WallpaperSettings,
  cx: number,
  cy: number,
  scale: number
) {
  ctx.save();

  const coords = getTextCoordinates(width, height, cx, cy, scale, settings);
  const tx = coords.x;
  const ty = coords.y;

  // Determine base color
  let baseColor = settings.textColor;
  if (settings.textColorMode === 'accent') {
    baseColor = theme.accentPrimary;
  } else if (settings.textColorMode === 'rim') {
    baseColor = theme.rimLight;
  } else if (settings.textColorMode === 'white') {
    baseColor = '#ffffff';
  }

  // Determine font family
  let fontFamily = "'Syne', sans-serif";
  if (settings.textStyle === 'outfit') {
    fontFamily = "'Outfit', sans-serif";
  } else if (settings.textStyle === 'mono') {
    fontFamily = "'Plus Jakarta Sans', monospace";
  }

  const fontSize = Math.round(28 * scale * settings.textSize);
  const tracking = Math.round(settings.textTracking * scale * settings.textSize);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Optional luminous glow behind the text
  if (settings.textGlow) {
    ctx.shadowColor = hexToRgba(baseColor, 0.7 * settings.textGlowIntensity);
    ctx.shadowBlur = 24 * scale * settings.textGlowIntensity;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowColor = 'transparent';
  }

  // Draw main title text with tracking
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  
  if (settings.textStyle === 'glass') {
    // Glass gradient fill with specular stroke
    const textGrad = ctx.createLinearGradient(
      tx - 100 * scale, ty - fontSize * 0.5,
      tx + 100 * scale, ty + fontSize * 0.5
    );
    textGrad.addColorStop(0, '#ffffff');
    textGrad.addColorStop(0.5, hexToRgba(theme.accentPrimary, settings.textOpacity));
    textGrad.addColorStop(1, hexToRgba(theme.accentSecondary, settings.textOpacity * 0.8));
    ctx.fillStyle = textGrad;
  } else {
    ctx.fillStyle = hexToRgba(baseColor, settings.textOpacity);
  }

  // Render text with letter spacing
  drawSpacedText(ctx, settings.textString.toUpperCase(), tx, ty, tracking);

  // If glass style, add subtle stroke rim
  if (settings.textStyle === 'glass') {
    ctx.strokeStyle = hexToRgba(theme.rimLight, 0.85);
    ctx.lineWidth = 1.2 * scale;
    drawSpacedText(ctx, settings.textString.toUpperCase(), tx, ty, tracking, true);
  }

  // Draw Subtitle if present
  if (settings.textSubtitle && settings.textSubtitle.trim().length > 0) {
    const subFontSize = Math.round(9 * scale * settings.textSize);
    const subTracking = Math.round(tracking * 0.9 + 4 * scale);
    const subY = ty + fontSize * 0.8 + 6 * scale;

    ctx.font = `500 ${subFontSize}px 'Outfit', sans-serif`;
    ctx.shadowBlur = settings.textGlow ? 12 * scale * settings.textGlowIntensity : 0;
    ctx.fillStyle = hexToRgba(
      settings.textColorMode === 'white' ? '#ffffff' : theme.rimLight,
      settings.textOpacity * 0.75
    );

    drawSpacedText(ctx, settings.textSubtitle.toUpperCase(), tx, subY, subTracking);
  }

  ctx.restore();
}

/**
 * Helper to draw text with custom letter tracking in canvas
 */
function drawSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
  isStroke: boolean = false
) {
  if (letterSpacing === 0) {
    if (isStroke) ctx.strokeText(text, x, y);
    else ctx.fillText(text, x, y);
    return;
  }

  // Measure full width with spacing
  let totalWidth = 0;
  const chars = text.split('');
  const charWidths: number[] = [];

  for (let i = 0; i < chars.length; i++) {
    const w = ctx.measureText(chars[i]).width;
    charWidths.push(w);
    totalWidth += w + (i < chars.length - 1 ? letterSpacing : 0);
  }

  let startX = x - totalWidth / 2;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const w = charWidths[i];
    const charX = startX + w / 2;
    if (isStroke) {
      ctx.strokeText(char, charX, y);
    } else {
      ctx.fillText(char, charX, y);
    }
    startX += w + letterSpacing;
  }
}

/**
 * Helper: Converts hex color or rgb string to rgba format
 */
export function hexToRgba(hexOrRgb: string, alpha: number): string {
  if (hexOrRgb.startsWith('rgba')) {
    const parts = hexOrRgb.replace(/rgba\(|\)/g, '').split(',');
    if (parts.length >= 3) {
      return `rgba(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, ${alpha.toFixed(3)})`;
    }
  }

  if (hexOrRgb.startsWith('rgb')) {
    const parts = hexOrRgb.replace(/rgb\(|\)/g, '').split(',');
    if (parts.length >= 3) {
      return `rgba(${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}, ${alpha.toFixed(3)})`;
    }
  }

  let cleanHex = hexOrRgb.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  
  if (cleanHex.length >= 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }

  return `rgba(0, 216, 246, ${alpha.toFixed(3)})`;
}
