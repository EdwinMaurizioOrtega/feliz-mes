'use client';

import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01+-=><{}[]';
const FONT_SIZE = 13;

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let drops = [];

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      drops = Array(cols).fill(1);
    }

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e05555';
      ctx.font = `${FONT_SIZE}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        ctx.fillText(
          CHARS[Math.floor(Math.random() * CHARS.length)],
          i * FONT_SIZE,
          drops[i] * FONT_SIZE
        );
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }

    init();
    const interval = setInterval(draw, 50);
    window.addEventListener('resize', init);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.28,
        pointerEvents: 'none',
      }}
    />
  );
}
