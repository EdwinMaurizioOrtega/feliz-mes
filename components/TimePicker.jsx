'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { TIMES } from '@/lib/config';
import styles from './TimePicker.module.css';

export default function TimePicker({ onConfirm }) {
  const [selected, setSelected] = useState(null);

  return (
    <section className="page fade-in">
      <Card>
        <h1>
          ¿A qué hora
          <br />
          puedes estar lista? <span className="heart">✦</span>
        </h1>

        <div className={styles.options}>
          {TIMES.map((time) => (
            <button
              key={time}
              className={`${styles.option} ${selected === time ? styles.selected : ''}`}
              onClick={() => setSelected(time)}
            >
              <div className={styles.radioDot} />
              <span className={styles.label}>{time}</span>
            </button>
          ))}
        </div>

        <button
          className="btn btn-accent"
          disabled={!selected}
          onClick={() => onConfirm(selected)}
        >
          confirmar hora
        </button>
      </Card>
    </section>
  );
}
