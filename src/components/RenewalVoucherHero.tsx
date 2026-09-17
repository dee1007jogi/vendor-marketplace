import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function RenewalVoucherHero({ onClaimSuccess }: { onClaimSuccess?: (code: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Web Audio Context for haptic sound feedback
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playHapticSound = (frequency = 440, type: OscillatorType = "sine", duration = 0.04) => {
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
      // Audio fallback
    }
  };

  // Custom Cursor Following inside the viewport / card stage
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let dotPos = { x: mousePos.x, y: mousePos.y };
    let ringPos = { x: mousePos.x, y: mousePos.y };
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const renderPointer = () => {
      dotPos.x += (mousePos.x - dotPos.x) * 0.45;
      dotPos.y += (mousePos.y - dotPos.y) * 0.45;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0) translate(-50%, -50%)`;

      ringPos.x += (mousePos.x - ringPos.x) * 0.18;
      ringPos.y += (mousePos.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;

      animId = requestAnimationFrame(renderPointer);
    };

    animId = requestAnimationFrame(renderPointer);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // WebGL THREE.js Shader Pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    let width = card.clientWidth || 900;
    let height = card.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

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

    const resizeObserver = new ResizeObserver(() => {
      if (!card || !renderer) return;
      const rect = card.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        renderer.setSize(rect.width, rect.height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        uniforms.u_resolution.value.set(rect.width, rect.height);
      }
    });

    resizeObserver.observe(card);
    card.addEventListener("mousemove", handleMouseMove);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.u_time.value = clock.getElapsedTime();
      uniforms.u_mouse.value.lerp(targetMouse, 0.08);
      renderer.render(scene, camera);
    };

    animate();

    // GSAP Entrance animation with explicit fromTo and cleanup
    const tween = gsap.fromTo(
      card,
      { opacity: 0, scale: 0.94, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(card, { clearProps: "opacity,scale,y" });
        }
      }
    );

    return () => {
      tween.kill();
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      card.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // 3D Parallax Tilt with exact angles and glare coords
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

  const triggerProcurementModal = () => {
    setIsModalOpen(true);
    playHapticSound(580, "sine", 0.08);
  };

  const closeProcurementModal = () => {
    setIsModalOpen(false);
  };

  const submitRfqForm = (e: React.FormEvent) => {
    e.preventDefault();
    closeProcurementModal();
    setShowToast(true);
    playHapticSound(880, "triangle", 0.12);
    if (onClaimSuccess) onClaimSuccess("CEO50RENEW");

    setTimeout(() => {
      setShowToast(false);
    }, 3200);
  };

  return (
    <div className="w-full relative select-none font-sans my-4">
      {/* Embedded High-Fidelity Styles matching the Standalone HTML */}
      <style>{`
        .card-stage {
          perspective: 1200px;
        }

        .tilt-card {
          transform-style: preserve-3d;
          transition: transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
          will-change: transform;
          opacity: 1 !important;
        }

        .tilt-layer-base { transform: translateZ(0px); }
        .tilt-layer-mid { transform: translateZ(35px); }
        .tilt-layer-high { transform: translateZ(65px); }

        .glass-glare {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.18) 0%, transparent 65%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
          mix-blend-mode: overlay;
        }

        .tilt-card:hover .glass-glare { opacity: 1; }

        .cursor-pointer-dot {
          position: fixed;
          top: 0; left: 0;
          width: 7px; height: 7px;
          background-color: #38bdf8;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
        }

        .cursor-pointer-ring {
          position: fixed;
          top: 0; left: 0;
          width: 38px; height: 38px;
          border: 1.5px solid rgba(56, 189, 248, 0.5);
          background: rgba(56, 189, 248, 0.05);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          backdrop-filter: blur(1.5px);
          transition: width 0.25s cubic-bezier(0.2, 1, 0.5, 1), 
                      height 0.25s cubic-bezier(0.2, 1, 0.5, 1), 
                      border-color 0.25s ease,
                      background-color 0.25s ease;
        }

        .cursor-pointer-ring.is-hovering {
          width: 60px;
          height: 60px;
          border-color: #fbbf24;
          background-color: rgba(251, 191, 36, 0.12);
        }

        .ambient-glow {
          position: absolute;
          width: 120%; height: 120%;
          top: -10%; left: -10%;
          border-radius: 3.5rem;
          filter: blur(80px);
          opacity: 0.35;
          transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }

        .shadow-glow-sapphire {
          box-shadow: 0 25px 60px -15px rgba(29, 78, 216, 0.45);
        }
      `}</style>

      {/* Custom Follow Pointer Elements */}
      <div ref={cursorDotRef} className="cursor-pointer-dot hidden md:block" />
      <div
        ref={cursorRingRef}
        className={`cursor-pointer-ring hidden md:block ${isHovering ? "is-hovering" : ""}`}
      />

      {/* Main Card Container */}
      <main className="w-full max-w-5xl mx-auto card-stage relative my-auto">
        <div id="ambientGlow" className="ambient-glow bg-blue-600" />

        <div
          id="surgeHeroCard"
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="tilt-card relative w-full min-h-[350px] sm:min-h-[380px] md:min-h-[400px] rounded-[2.25rem] p-6 sm:p-8 md:p-9 text-white flex flex-col justify-between overflow-hidden shadow-glow-sapphire border border-white/15 bg-slate-950/80 backdrop-blur-md cursor-default"
        >
          {/* WebGL Canvas Shader */}
          <canvas
            id="shaderCanvas"
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none rounded-[2.25rem]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none rounded-[2.25rem]" />
          <div className="glass-glare" />

          {/* Top Header Layer */}
          <div className="flex justify-between items-start relative z-20 tilt-layer-mid">
            <div
              id="topBadge"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider flex items-center gap-2 border border-white/20 shadow-inner transition-all text-white"
            >
              <span className="text-amber-400 text-xs">★</span>
              <span className="uppercase">50% RENEWAL VOUCHER</span>
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

          {/* Mid Content Layer */}
          <div id="slideContent" className="relative z-20 my-auto py-3 sm:py-4 tilt-layer-high max-w-2xl">
            <div
              id="surgeOverline"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-blue-300 font-mono font-bold mb-1.5"
            >
              RENEWAL PASS
            </div>

            <h1
              id="surgeTitle"
              className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] tracking-tight mb-3 text-white drop-shadow-sm font-sans"
            >
              50% Renewal Voucher
            </h1>

            <p
              id="surgeDescription"
              className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal max-w-xl mb-5 drop-shadow"
            >
              Save flat 50% on all quarterly & annual vendor subscription renewals with code{" "}
              <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                CEO50RENEW
              </span>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5">
              <button
                id="ctaBtn"
                onClick={triggerProcurementModal}
                className="group relative bg-[#f59e0b] hover:bg-[#fbbf24] active:scale-95 text-slate-950 font-black py-3 px-6 rounded-full text-xs sm:text-sm flex items-center gap-2 transition duration-200 shadow-xl shadow-amber-500/25 tracking-wide cursor-pointer"
              >
                <span>Claim 50% Discount</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200/90 font-mono px-3 py-1 rounded-full bg-black/25 border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Instant Renewal Lock</span>
              </div>
            </div>
          </div>

          {/* Bottom Features Layer */}
          <div className="flex flex-wrap justify-between items-center relative z-20 pt-4 border-t border-white/15 tilt-layer-mid gap-3">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300/80 font-mono tracking-wide">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-slate-200 font-semibold">100% Escrow Protection</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">Instant Renewal Lock</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <svg className="w-3.5 h-3.5 text-sky-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
              <span>Move pointer to distort ripples</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {isModalOpen && (
        <div
          id="rfqModal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        >
          <div
            id="rfqDialog"
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={closeProcurementModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">Apply Renewal Discount</h3>
                <p className="text-xs text-slate-400">Instant code application & lock</p>
              </div>
            </div>
            <form onSubmit={submitRfqForm} className="space-y-4">
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

      {/* Toast Notification */}
      {showToast && (
        <div
          id="toastAlert"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-slate-700 text-white text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span id="toastAlertMsg">Voucher CEO50RENEW Applied Successfully!</span>
        </div>
      )}
    </div>
  );
}
