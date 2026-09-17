import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { 
  Zap, Star, ShieldCheck, Sparkles, Volume2, VolumeX, 
  X, Check, Lock, ArrowRight, MousePointer 
} from "lucide-react";

export default function RenewalVoucherHero({ onClaimSuccess }: { onClaimSuccess?: (code: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const soundDotRef = useRef<HTMLSpanElement>(null);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Web Audio API for interactive audio feedback
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playHapticSound = (frequency = 440, type: OscillatorType = "sine", duration = 0.04) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context error fallback
    }
  };

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    playHapticSound(nextState ? 650 : 250, "triangle", 0.08);
  };

  // WebGL THREE.js Shader Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    let width = card.clientWidth;
    let height = card.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      varying vec2 vUv;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        vec2 m = u_mouse * 2.0 - 1.0;
        m.x *= u_resolution.x / u_resolution.y;
        float dist = length(p - m);

        float wave1 = sin(p.x * 3.5 + u_time * 1.3 + sin(p.y * 2.5));
        float wave2 = cos(p.y * 3.2 - u_time * 1.1 + cos(p.x * 2.2));
        float ripple = sin(dist * 22.0 - u_time * 4.8) * exp(-dist * 2.6) * 0.55;

        float combined = wave1 * 0.5 + wave2 * 0.5 + ripple;

        vec3 col = mix(u_color1, u_color2, smoothstep(-0.9, 0.9, combined));
        col += u_color3 * (ripple * 0.85);

        float crest = smoothstep(0.7, 1.0, combined);
        col += vec3(crest * 0.22);

        gl_FragColor = vec4(col, 0.96);
      }
    `;

    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_color1: { value: new THREE.Vector3(0.06, 0.28, 0.95) },
      u_color2: { value: new THREE.Vector3(0.01, 0.08, 0.42) },
      u_color3: { value: new THREE.Vector3(0.22, 0.72, 1.00) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - ((e.clientY - rect.top) / rect.height);
    };

    const handleResize = () => {
      if (!card) return;
      width = card.clientWidth;
      height = card.clientHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      uniforms.u_resolution.value.set(width, height);
    };

    card.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_mouse.value.lerp(targetMouse, 0.08);
      renderer.render(scene, camera);
    };

    animate();

    // GSAP Entrance animation
    gsap.from(card, {
      scale: 0.94,
      y: 20,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out"
    });

    return () => {
      cancelAnimationFrame(animId);
      card.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // 3D Parallax Tilt Handling
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    setIsHovering(true);
  };

  const handleCardMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    setIsHovering(false);
  };

  const triggerModal = () => {
    setIsModalOpen(true);
    playHapticSound(580, "sine", 0.08);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    setShowToast(true);
    playHapticSound(880, "triangle", 0.12);
    if (onClaimSuccess) onClaimSuccess("CEO50RENEW");

    setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-6 p-4 sm:p-6 md:p-8 rounded-[3.5rem] bg-[#0b0f19] text-white shadow-2xl font-sans select-none relative z-10 border border-slate-800/90 overflow-hidden">
      {/* Header Bar with Audio Toggle */}
      <div className="w-full flex items-center justify-between py-3 mb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white font-extrabold text-sm">
            ⚡
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight text-white">
              NEXUS<span className="text-blue-400">SURGE</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 border border-slate-700/80 px-2 py-0.5 rounded-full">
              Renewal Portal
            </span>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 hover:text-white hover:border-slate-500 transition flex items-center gap-2 shadow-sm cursor-pointer"
        >
          {soundEnabled ? <Volume2 size={13} className="text-emerald-400" /> : <VolumeX size={13} className="text-slate-500" />}
          <span>Audio: {soundEnabled ? "On" : "Off"}</span>
        </button>
      </div>

      {/* Card Stage with Perspective */}
      <div className="perspective-[1200px] relative w-full">
        {/* Ambient Glow */}
        <div className="absolute -inset-4 rounded-[3.5rem] bg-blue-600/30 blur-3xl pointer-events-none transition-all duration-700" />

        {/* 3D Tilt Card Container */}
        <div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="relative w-full min-h-[490px] sm:min-h-[520px] md:min-h-[540px] rounded-[2.5rem] p-7 sm:p-10 md:p-12 text-white flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_-15px_rgba(29,78,216,0.45)] border border-white/15 bg-slate-950 cursor-default transition-all duration-150 ease-out preserve-3d"
        >
          {/* Canvas for WebGL Ripple Shader */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none rounded-[2.5rem]" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Interactive Dynamic Glare */}
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none opacity-0 transition-opacity duration-300 mix-blend-overlay"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.18) 0%, transparent 65%)`
            }}
          />

          {/* Top Header Layer (TranslateZ 35px) */}
          <div className="flex justify-between items-start relative z-20 translate-z-[35px]">
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wider flex items-center gap-2 border border-white/20 shadow-inner transition-all">
              <span className="text-amber-400 text-xs">★</span>
              <span className="uppercase tracking-wider">50% RENEWAL VOUCHER</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md bg-black/40 border border-white/15 text-slate-300 uppercase backdrop-blur-sm">
                WEBGL 3D
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-white/10 border border-white/15 text-white">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Content Layer (TranslateZ 65px) */}
          <div className="relative z-20 my-auto py-6 sm:py-8 translate-z-[65px] max-w-2xl">
            <div className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-blue-300 font-mono font-bold mb-2">
              RENEWAL PASS
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-4 text-white drop-shadow-sm font-sans">
              50% Renewal Voucher
            </h1>

            <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed font-normal max-w-xl mb-7 drop-shadow">
              Save flat 50% on all quarterly & annual vendor subscription renewals with code{" "}
              <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                CEO50RENEW
              </span>
              .
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <button
                onClick={triggerModal}
                className="group relative bg-[#f59e0b] hover:bg-[#fbbf24] active:scale-95 text-slate-950 font-black py-3.5 px-7 rounded-full text-xs sm:text-sm flex items-center gap-2.5 transition duration-200 shadow-xl shadow-amber-500/25 tracking-wide cursor-pointer"
              >
                <span>Claim 50% Discount</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200/90 font-mono px-3 py-1.5 rounded-full bg-black/25 border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Instant Renewal Lock</span>
              </div>
            </div>
          </div>

          {/* Footer Features Layer (TranslateZ 35px) */}
          <div className="flex flex-wrap justify-between items-center relative z-20 pt-4 border-t border-white/15 translate-z-[35px] gap-3">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300/80 font-mono tracking-wide">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="text-slate-200 font-semibold">100% Escrow Protection</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">Instant Renewal Lock</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <MousePointer size={14} className="text-sky-300 animate-pulse" />
              <span>Move pointer to distort ripples</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Apply Renewal Discount</h3>
                <p class="text-xs text-slate-400">Instant code application & lock</p>
              </div>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Promo Code Applied</label>
                <input
                  type="text"
                  readOnly
                  value="CEO50RENEW (50% OFF)"
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Vendor / Account ID</label>
                <input
                  type="text"
                  required
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  placeholder="e.g. VEN-88294 or Account Email"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-xs flex items-center justify-between font-mono">
                <span className="text-blue-300">100% Escrow Protection</span>
                <span className="text-emerald-400 font-bold">Instant Renewal Lock</span>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition duration-150 active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                Apply Voucher & Secure Renewal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-700 text-white text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">Voucher CEO50RENEW Applied Successfully!</span>
        </div>
      )}
    </div>
  );
}
