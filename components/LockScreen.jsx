'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import { UNLOCK_NAME } from '@/lib/config';
import styles from './LockScreen.module.css';

export default function LockScreen({ onUnlock }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  function tryEnter() {
    if (name.trim().toLowerCase() === UNLOCK_NAME) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setShakeKey((k) => k + 1); // re-mount the card to restart the shake animation
    }
  }

  return (
    <section className="page fade-in">
      <div key={shakeKey} className={shakeKey > 0 ? 'shake' : ''} style={{ width: '100%', maxWidth: 520 }}>
        <Card>
          <div className={styles.lockIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="3" ry="3" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1>
            Esto se desbloquea
            <br />
            con tu nombre <span className="heart">❤</span>
          </h1>

          <div className={styles.inputWrap}>
            <input
              className={styles.nameInput}
              type="text"
              placeholder="escribe tu nombre..."
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tryEnter()}
            />
            <div className={`${styles.errorMsg} ${error ? styles.show : ''}`}>
              Este mensaje no es para ti.
            </div>
          </div>

          <button className="btn" onClick={tryEnter}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Entrar
          </button>
        </Card>
      </div>
    </section>
  );
}
