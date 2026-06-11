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
const N = ALL_OPTIONS.length;
const SEG_ANGLE = 360 / N;

const CAT_COLORS = [
  '#FFB07C','#FF8FA3','#FFD166','#7EC8E3','#A8E6CF','#C3AED6','#F8A5C2',
];

function getCategoryIndex(optionIndex) {
  for (let i = 0, t = 0; i < CATEGORIES.length; i++) {
    t += CATEGORIES[i].options.length;
    if (optionIndex < t) return i;
  }
  return 0;
}

function polar(angleDeg, radius) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: radius * Math.cos(rad), y: radius * Math.sin(rad) };
}

function segmentPath(index, r) {
  const a1 = index * SEG_ANGLE;
  const a2 = a1 + SEG_ANGLE;
  const p1 = polar(a1, r);
  const p2 = polar(a2, r);
  return `M 0 0 L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;
}

// ── helpers fecha ────────────────────────────────────────
function getMonthsPassed() {
  const today = new Date();
  let m = (today.getFullYear() - START_DATE.getFullYear()) * 12 + today.getMonth() - START_DATE.getMonth();
  m = Math.max(0, m);
  const y = Math.floor(m / 12), rem = m % 12;
  let r = '';
  if (y > 0) r += `${y} año${y > 1 ? 's' : ''} `;
  if (rem > 0) r += `${rem} mes${rem > 1 ? 'es' : ''}`;
  return r.trim();
}
function getDaysUntilNext() {
  const today = new Date();
  const n = new Date(today.getFullYear(), today.getMonth(), START_DATE.getDate());
  if (n <= today) n.setMonth(n.getMonth() + 1);
  return Math.ceil((n - today) / 86400000);
}
function isCorrectDate() { return new Date().getDate() === START_DATE.getDate(); }
function getHeaderText() {
  const label = getMonthsPassed();
  if (!isCorrectDate()) return <>Faltan {getDaysUntilNext()} días para {label} 🥳 y haremos...</>;
  const today = new Date();
  const months = (today.getFullYear() - START_DATE.getFullYear()) * 12 + today.getMonth() - START_DATE.getMonth();
  if (months % 12 === 0) {
    const y = months / 12;
    return <>Feliz aniversario {y} año{y > 1 ? 's' : ''} 🥳 y haremos...</>;
  }
  return <>Feliz {label} 🥳 y haremos...</>;
}

// ── componente ───────────────────────────────────────────
const R = 150;
const PAD = 20;
const VIEW = (R + PAD) * 2;
const CX = VIEW / 2;

export default function Roulette({ onConfirm }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [resultIdx, setResultIdx] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [duration, setDuration] = useState(4);
  const timersRef = useRef([]);
  const tableRef = useRef(null);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // scroll tabla al número ganador cuando la rueda se detiene
  useEffect(() => {
    if (resultIdx !== null && !spinning) {
      const timer = setTimeout(() => {
        const container = tableRef.current;
        if (container) {
          const row = container.querySelector('.' + styles.highlight);
          if (row) {
            container.scrollTo({ top: row.offsetTop - container.offsetHeight / 2, behavior: 'smooth' });
          }
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [resultIdx, spinning]);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResultIdx(null);
    setConfirmed(false);

    const randomSeg = Math.floor(Math.random() * N);
    const segCenter = randomSeg * SEG_ANGLE + SEG_ANGLE / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const totalAngle = extraSpins * 360 + (360 - segCenter);
    const finalRotation = rotation + totalAngle;
    const d = 3.5 + Math.random() * 0.8;
    setDuration(d);
    setRotation(finalRotation);

    timersRef.current.push(
      setTimeout(() => { setSpinning(false); setResultIdx(randomSeg); }, d * 1000 + 100)
    );
  }

  function confirm() {
    if (resultIdx === null) return;
    setConfirmed(true);
    timersRef.current.push(setTimeout(() => onConfirm(ALL_OPTIONS[resultIdx]), 900));
  }

  // ── segmentos SVG (solo números) ──
  const segments = useMemo(() => {
    const items = [];
    for (let i = 0; i < N; i++) {
      const catIdx = getCategoryIndex(i);
      const color = CAT_COLORS[catIdx % CAT_COLORS.length];
      const mid = i * SEG_ANGLE + SEG_ANGLE / 2;
      const p = polar(mid, R * 0.75);
      items.push({ i, path: segmentPath(i, R), color, mid, tx: p.x, ty: p.y });
    }
    return items;
  }, []);

  // ── datos de tabla ──
  const tableData = useMemo(() => {
    const rows = [];
    let idx = 0;
    CATEGORIES.forEach((cat) => {
      rows.push({ type: 'category', label: cat.name });
      cat.options.forEach(opt => { rows.push({ type: 'option', idx, text: opt }); idx++; });
    });
    return rows;
  }, []);

  return (
    <section className="page fade-in">
      <Card>
        <div className="big-text">{getHeaderText()}</div>
        <div className="divider" />

        <div className={styles.layout}>
          {/* Columna rueda */}
          <div className={styles.wheelCol}>
            <div className={styles.wheelContainer}>
              <div className={styles.needle} />
              <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className={`${styles.wheel} ${!isCorrectDate() ? styles.blur : ''}`}>
                <g transform={`translate(${CX},${CX}) rotate(${rotation})`}
                   style={{ transition: spinning ? `transform ${duration}s cubic-bezier(0.15,0.8,0.25,1.0)` : 'none' }}>
                  {segments.map(s => (
                    <g key={s.i}>
                      <path d={s.path} fill={s.color} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
                      <text x={s.tx} y={s.ty} className={styles.segmentText} textAnchor="middle" dominantBaseline="central"
                            transform={`rotate(${s.mid},${s.tx},${s.ty})`}>{s.i + 1}</text>
                    </g>
                  ))}
                  <circle r="16" className={styles.centerDot} />
                </g>
              </svg>
            </div>

            <div className={styles.btnRow}>
              <button className="btn" onClick={spin} disabled={spinning || !isCorrectDate()}
                      title={!isCorrectDate() ? 'Solo puedes girar el 14' : ''}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>{' '}girar
              </button>
              {resultIdx !== null && !confirmed && (
                <button className="btn btn-accent" onClick={confirm}>elegir</button>
              )}
            </div>
          </div>

          {/* Columna tabla */}
          <div className={styles.tableCol} ref={tableRef}>
            {/* Burbuja ganadora */}
            {resultIdx !== null && !spinning && (
              <div className={styles.winBubble}>
                <div className={styles.winBubbleNum}>#{resultIdx + 1}</div>
                <div className={styles.winBubbleCat}>{ALL_OPTIONS[resultIdx].category}</div>
                <div className={styles.winBubbleText}>{ALL_OPTIONS[resultIdx].text}</div>
              </div>
            )}
            <table className={styles.table}>
              <thead><tr><th>#</th><th>Actividad</th></tr></thead>
              <tbody>
                {tableData.map((row, ri) =>
                  row.type === 'category' ? (
                    <tr key={ri} className={styles.catRow}><td colSpan={2}>{row.label}</td></tr>
                  ) : (
                    row.idx !== resultIdx || spinning ? (
                      <tr key={ri} className={resultIdx === row.idx && !spinning ? styles.highlight : ''}>
                        <td className={styles.numCell}>{row.idx + 1}</td>
                        <td className={styles.optCell}>{row.text}</td>
                      </tr>
                    ) : null
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isCorrectDate() && <div className="divider" />}
        {!isCorrectDate() && (
          <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>
            ¡Espera al 14 para girar! Faltan {getDaysUntilNext()} días 🎉
          </p>
        )}

        {confirmed && resultIdx !== null && (
          <div className={styles.resultWrap}>
            <div className={styles.resultBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>{' '}
              <span style={{ fontWeight: 600 }}>{ALL_OPTIONS[resultIdx].category}</span>
            </div>
            <div className={styles.resultBadge} style={{ marginTop: 8, fontSize: '0.95rem' }}>
              {ALL_OPTIONS[resultIdx].text}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
