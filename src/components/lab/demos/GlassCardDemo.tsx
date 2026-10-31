import React, { useState, useRef } from 'react';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export default function GlassCardDemo() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [blurAmount, setBlurAmount] = useState(16);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -15; // Max 15deg tilt
    const rY = ((x - centerX) / centerX) * 15;

    setRotateX(rX);
    setRotateY(rY);

    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative w-full h-[450px] rounded-xl overflow-hidden bg-space-950 flex flex-col items-center justify-center p-6 border border-border-subtle perspective-[1000px]">
      {/* Background ambient light */}
      <div className="absolute w-72 h-72 bg-cosmic-cyan/15 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
      <div className="absolute w-72 h-72 bg-cosmic-violet/15 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />

      {/* Control bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-space-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-border-hover text-xs font-mono">
        <span className="text-text-muted">Blur:</span>
        <input
          type="range"
          min={4}
          max={32}
          value={blurAmount}
          onChange={(e) => setBlurAmount(Number(e.target.value))}
          className="w-24 accent-cosmic-cyan cursor-pointer"
          aria-label="Adjust Glass Blur"
        />
        <span className="text-cosmic-cyan">{blurAmount}px</span>
      </div>

      {/* 3D Glass Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
        }}
        className="relative w-full max-w-sm rounded-2xl bg-space-900/40 border border-white/10 p-7 shadow-2xl cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-glow-cyan/20"
      >
        {/* Dynamic Glare Reflection */}
        <div
          style={{
            background: `radial-gradient(circle 250px at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 70%)`,
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Card Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cosmic-cyan font-bold px-2 py-0.5 rounded bg-cosmic-cyan/10 border border-cosmic-cyan/30">
              Interactive 3D UI
            </span>
            <Sparkles className="w-4 h-4 text-cosmic-cyan animate-pulse" />
          </div>

          <h3 className="text-2xl font-heading font-extrabold text-white tracking-tight mb-2">
            Cyberpunk Terminal OS
          </h3>

          <p className="text-xs text-text-secondary leading-relaxed mb-6">
            Hardware-accelerated perspective matrix calculations with real-time vector glare reflections.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mb-6">
            <div className="p-2 rounded bg-space-950/60 border border-white/5">
              <span className="text-text-muted block">Pitch (X):</span>
              <span className="text-cosmic-cyan font-semibold">{rotateX.toFixed(1)}&deg;</span>
            </div>
            <div className="p-2 rounded bg-space-950/60 border border-white/5">
              <span className="text-text-muted block">Yaw (Y):</span>
              <span className="text-cosmic-violet font-semibold">{rotateY.toFixed(1)}&deg;</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
            <span className="text-text-muted">60 FPS Hardware Render</span>
            <span className="text-cosmic-emerald font-semibold flex items-center gap-1">
              Active <Shield className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-text-muted bg-space-950/60 px-2 py-1 rounded">
        Hover & Move Cursor to Tilt Card in 3D Space
      </div>
    </div>
  );
}
