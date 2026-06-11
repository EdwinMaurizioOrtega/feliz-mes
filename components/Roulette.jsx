'use client';

import { useEffect, useRef, useState } from 'react';
import Card from '@/components/Card';
import { OPTIONS, START_DATE } from '@/lib/config';
import styles from './Roulette.module.css';

const ITEM_H = 64;
const WIN_H = 192; // visible height = 3 items
const REPEATS = 8; // pool size to allow long spins without running out
const START_INDEX = OPTIONS.length * 2;

const POOL = Array.from({ length: REPEATS }, () => OPTIONS).flat();

function getMonthsPassed() {
  const today = new Date();
  let months = (today.getFullYear() - START_DATE.getFullYear()) * 12;
  months += today.getMonth() - START_DATE.getMonth();
  months = Math.max(0, months);
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  let result = '';
  if (years > 0) {
    result += `${years} año${years > 1 ? 's' : ''} `;
  }
  if (remainingMonths > 0) {
    result += `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
  }
  
  return result.trim();
}

function getDaysUntilNext() {
  const today = new Date();
  const nextDate = new Date(today.getFullYear(), today.getMonth(), START_DATE.getDate());
  
  // Si ya pasó la fecha del mes actual, ir al próximo mes
  if (nextDate <= today) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function isCorrectDate() {
  const today = new Date();
  return today.getDate() === START_DATE.getDate();
}

function offsetFor(index) {
  return index * ITEM_H - (WIN_H / 2 - ITEM_H / 2);
}

export default function Roulette({ onConfirm }) {
  const trackRef = useRef(null);
  const timersRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(START_INDEX);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // initial position, no animation
    const track = trackRef.current;
    track.style.transition = 'none';
    track.style.transform = `translateY(-${offsetFor(START_INDEX)}px)`;
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const track = trackRef.current;

    // reset to start position without animation
    track.style.transition = 'none';
    track.style.transform = `translateY(-${offsetFor(START_INDEX)}px)`;
    setCurrentIndex(START_INDEX);

    const loops = 4 + Math.floor(Math.random() * 2);
    const extra = Math.floor(Math.random() * OPTIONS.length);
    const targetIndex = START_INDEX + OPTIONS.length * loops + extra;
    const spinDuration = 3.0 + Math.random() * 0.8;

    // two rAF calls ensure the transition applies after the reset paints
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = `transform ${spinDuration}s cubic-bezier(0.12, 0.8, 0.3, 1.0)`;
        track.style.transform = `translateY(-${offsetFor(targetIndex)}px)`;
        setCurrentIndex(targetIndex);

        timersRef.current.push(
          setTimeout(() => {
            setSpinning(false);
            setResult(OPTIONS[targetIndex % OPTIONS.length]);
          }, spinDuration * 1000 + 50)
        );
      });
    });
  }

  function confirm() {
    if (!result) return;
    setConfirmed(true);
    timersRef.current.push(setTimeout(onConfirm, 900));
  }

  return (
    <section className="page fade-in">
      <Card>
        <div className="big-text">Faltan {getDaysUntilNext()} días para {getMonthsPassed()} 🥳 y haremos...</div>

        <div className="divider" />

        <div className={styles.wrap}>
          <div className={styles.window}>
            <div className={styles.centerLineTop} />
            <div className={styles.centerLineBottom} />
            <div 
              ref={trackRef} 
              className={[
                styles.track,
                !isCorrectDate() ? styles.blur : ''
              ].join(' ')}
            >
              {POOL.map((option, i) => (
                <div
                  key={i}
                  className={[
                    styles.item,
                    i === currentIndex ? styles.selected : '',
                    Math.abs(i - currentIndex) === 1 ? styles.near : '',
                  ].join(' ')}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.btnRow}>
            <button 
              className="btn" 
              onClick={spin} 
              disabled={spinning || !isCorrectDate()}
              title={!isCorrectDate() ? `Solo puedes girar el 14` : ''}
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

          {!isCorrectDate() && (
            <div className="divider" />
          )}
          {!isCorrectDate() && (
            <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '16px' }}>
              ¡Espera al 14 para girar! Faltan {getDaysUntilNext()} días 🎉
            </p>
          )}
        </div>

        {confirmed && (
          <div>
            <div className={styles.resultBadge}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>{' '}
              {result}
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
