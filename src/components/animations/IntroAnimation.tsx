import React, { useState, useEffect, useRef } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  targetX: number;
  targetY: number;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 150;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: 0,
        targetX: centerX + (Math.random() - 0.5) * 200,
        targetY: centerY + (Math.random() - 0.5) * 100,
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      if (phase === 0 && frame > 30) {
        setPhase(1);
      }

      if (phase >= 1) {
        particles.forEach((p) => {
          if (phase === 1) {
            p.alpha = Math.min(p.alpha + 0.02, 0.8);
          }

          if (phase === 2) {
            const targetAlpha = frame < 120 ? 0 : Math.min((frame - 120) * 0.02, 0.6);
            p.alpha = targetAlpha;
            p.x += (p.targetX - p.x) * 0.02;
            p.y += (p.targetY - p.y) * 0.02;
          }

          if (phase === 3) {
            p.alpha = Math.max(p.alpha - 0.05, 0);
          }

          if (p.alpha > 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 190, 200, ${p.alpha})`;
            ctx.fill();
          }
        });

        if (phase === 2) {
          particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
              const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
              if (dist < 80) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / 80)})`;
                ctx.stroke();
              }
            });
          });

          ctx.font = 'bold 72px Inter, sans-serif';
          ctx.fillStyle = `rgba(200, 200, 205, ${Math.min((frame - 90) * 0.02, 0.8)})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('AXIOMX', centerX, centerY);
        }
      }

      if (frame < 200) {
        animationId = requestAnimationFrame(animate);
      } else {
        setPhase(4);
        setTimeout(onComplete, 500);
      }
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default IntroAnimation;