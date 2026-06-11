'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { TIMES } from '@/lib/config';
import styles from './TimePicker.module.css';

export default function TimePicker({ activity, onConfirm }) {
  const [selected, setSelected] = useState(null);

  return (
    <section className="page fade-in">
      <Card>
        <h1>
          ¿A qué hora
          <br />
          puedes estar lista? <span className="heart">✦</span>
        </h1>

        {activity && (
          <div style={{
            textAlign: 'center', marginBottom: '16px',
            background: 'var(--red-faint)', border: '1px solid var(--red)',
            borderRadius: '8px', padding: '10px 16px', fontSize: '0.85rem', color: 'var(--red)',
          }}>
            <div style={{ fontWeight: 600 }}>{activity.category}</div>
            <div style={{ marginTop: 4 }}>{activity.text}</div>
          </div>
        )}

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
