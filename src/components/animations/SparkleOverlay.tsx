import React, { useMemo } from 'react';
import { Sparkles, Star } from 'lucide-react';

interface SparkleParticle {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
  type: 'sparkle' | 'star';
}

export const SparkleOverlay: React.FC<{ count?: number }> = React.memo(({ count = 12 }) => {
  const particles = useMemo<SparkleParticle[]>(() => {
    const colors = [
      'text-amber-400/80',
      'text-sky-400/80',
      'text-yellow-300/80',
      'text-white/80',
      'text-cyan-300/80',
    ];

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 92)}%`,
      left: `${Math.floor(Math.random() * 95)}%`,
      size: Math.floor(Math.random() * 10) + 10, // 10px to 20px
      delay: `${(Math.random() * 6).toFixed(1)}s`,
      duration: `${(Math.random() * 3 + 4).toFixed(1)}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: i % 2 === 0 ? 'sparkle' : 'star',
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="sparkle-particle"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.type === 'sparkle' ? (
            <Sparkles className={`${p.color}`} style={{ width: p.size, height: p.size }} />
          ) : (
            <Star className={`${p.color} fill-amber-300/30`} style={{ width: p.size, height: p.size }} />
          )}
        </div>
      ))}
    </div>
  );
});

export default SparkleOverlay;

