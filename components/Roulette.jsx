'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import Card from '@/components/Card';
import { CATEGORIES, START_DATE } from '@/lib/config';
import styles from './Roulette.module.css';

// ── helpers ──────────────────────────────────────────────

function getAllOptions() {
  return CATEGORIES.flatMap(cat =>
    cat.options.map(opt => ({ text: opt, category: cat.name }))
  );
}

const ALL_OPTIONS = getAllOptions();
const N = ALL_OPTIONS.length; // 28
const SEG_ANGLE = 360 / N;

// Colores pastel por categoría
const CAT_COLORS = [
  '#FFB07C', // 🍻 Pura Farra — naranja pastel
  '#FF8FA3', // 🍲 Más Rica — rosado pastel
  '#FFD166', // 🏛️ Culturoso — dorado pastel
  '#7EC8E3', // 💆 Tranqui — celeste pastel
  '#A8E6CF', // 🌿 Pachamama — verde pastel
  '#C3AED6', // 🎨 Manito — violeta pastel
  '#F8A5C2', // 🏩 Cajear — magenta pastel
];

function getCategoryIndex(optionIndex) {
  for (let i = 0, total = 0; i < CATEGORIES.length; i++) {
    total += CATEGORIES[i].options.length;
    if (optionIndex < total) return i;
  }
  return 0;
}

// ── SVG helpers ──────────────────────────────────────────

function polar(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

function segmentPath(index, r) {
  const a1 = index * SEG_ANGLE;
  const a2 = a1 + SEG_ANGLE;
  const p1 = polar(a1, r);
  const p2 = polar(a2, r);
  const large = SEG_ANGLE > 180 ? 1 : 0;
  return [
    `M 0 0`,
    `L ${p1.x} ${p1.y}`,
    `A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`,
    `Z`,
  ].join(' ');
}

// ── helpers fecha ────────────────────────────────────────

function getMonthsPassed() {
  const today = new Date();
  let months = (today.getFullYear() - START_DATE.getFullYear()) * 12;
  months += today.getMonth() - START_DATE.getMonth();
  months = Math.max(0, months);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  let r = '';
  if (years > 0) r += `${years} año${years > 1 ? 's' : ''} `;
  if (rem > 0) r += `${rem} mes${rem > 1 ? 'es' : ''}`;
  return r.trim();
}

function getDaysUntilNext() {
  const today = new Date();
  const n = new Date(today.getFullYear(), today.getMonth(), START_DATE.getDate());
  if (n <= today) n.setMonth(n.getMonth() + 1);
  return Math.ceil((n - today) / (1000 * 60 * 60 * 24));
}

function isCorrectDate() {
  return new Date().getDate() === START_DATE.getDate();
}

function getHeaderText() {
  const label = getMonthsPassed();
  if (!isCorrectDate()) {
    return <>Faltan {getDaysUntilNext()} días para {label} 🥳 y haremos...</>;
  }
  const today = new Date();
  const months = (today.getFullYear() - START_DATE.getFullYear()) * 12 + today.getMonth() - START_DATE.getMonth();
  if (months % 12 === 0) {
    const y = months / 12;
    return <>Feliz aniversario {y} año{y > 1 ? 's' : ''} 🥳 y haremos...</>;
  }
  return <>Feliz {label} 🥳 y haremos...</>;
}

// ── componente ───────────────────────────────────────────

const R = 140;
const PADDING = 24;
const VIEW = (R + PADDING) * 2;
const CENTER = VIEW / 2;

export default function Roulette({ onConfirm }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [duration, setDuration] = useState(4);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const randomSeg = Math.floor(Math.random() * N);
    const segCenter = randomSeg * SEG_ANGLE + SEG_ANGLE / 2;
    const totalAngle = extraSpins * 360 + (360 - segCenter);
    const finalRotation = rotation + totalAngle;
    const d = 3.5 + Math.random() * 0.8;
    setDuration(d);
    setRotation(finalRotation);

    timersRef.current.push(
      setTimeout(() => {
        setSpinning(false);
        setResult(ALL_OPTIONS[randomSeg]);
      }, d * 1000 + 100)
    );
  }

  function confirm() {
    if (!result) return;
    setConfirmed(true);
    timersRef.current.push(setTimeout(onConfirm, 900));
  }

  const segments = useMemo(() => {
    const items = [];
    for (let i = 0; i < N; i++) {
      const catIdx = getCategoryIndex(i);
      const color = CAT_COLORS[catIdx % CAT_COLORS.length];
      const midAngle = i * SEG_ANGLE + SEG_ANGLE / 2;
      const p = polar(midAngle, R * 0.65);
      const raw = ALL_OPTIONS[i].text;
      const label = raw.length > 22 ? raw.slice(0, 21) + '…' : raw;
      items.push({ i, path: segmentPath(i, R), color, midAngle, tx: p.x, ty: p.y, label });
    }
    return items;
  }, []);

  return (
    <section className="page fade-in">
      <Card>
        <div className="big-text">{getHeaderText()}</div>
        <div className="divider" />

        <div className={styles.wrap}>
          <div className={styles.wheelContainer}>
            <div className={styles.needle} />

            <svg
              viewBox={`0 0 ${VIEW} ${VIEW}`}
              className={`${styles.wheel} ${!isCorrectDate() ? styles.blur : ''}`}
            >
              <g
                transform={`translate(${CENTER},${CENTER}) rotate(${rotation})`}
                style={{
                  transition: spinning
                    ? `transform ${duration}s cubic-bezier(0.15, 0.8, 0.25, 1.0)`
                    : 'none',
                }}
              >
                {segments.map(s => (
                  <g key={s.i}>
                    <path d={s.path} fill={s.color} className={styles.segment} stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
                    <text
                      x={s.tx}
                      y={s.ty}
                      className={styles.segmentText}
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${s.midAngle},${s.tx},${s.ty})`}
                      style={{ fontSize: N > 20 ? '9px' : '11px' }}
                    >
                      {s.label}
                    </text>
                  </g>
                ))}
                <circle r="16" className={styles.centerDot} />
              </g>
            </svg>
          </div>

          <div className={styles.btnRow}>
            <button
              className="btn"
              onClick={spin}
              disabled={spinning || !isCorrectDate()}
              title={!isCorrectDate() ? 'Solo puedes girar el 14' : ''}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              girar
            </button>
            {result && !confirmed && (
              <button className="btn btn-accent" onClick={confirm}>
                elegir
              </button>
            )}
          </div>

          {!isCorrectDate() && <div className="divider" />}
          {!isCorrectDate() && (
            <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>
              ¡Espera al 14 para girar! Faltan {getDaysUntilNext()} días 🎉
            </p>
          )}
        </div>

        {confirmed && (
          <div className={styles.resultWrap}>
            <div className={styles.resultBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>{' '}
              <span style={{ fontWeight: 600 }}>{result.category}</span>
            </div>
            <div className={styles.resultBadge} style={{ marginTop: 8, fontSize: '0.95rem' }}>
              {result.text}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
