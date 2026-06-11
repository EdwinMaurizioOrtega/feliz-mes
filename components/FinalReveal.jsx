import Card from '@/components/Card';
import styles from './FinalReveal.module.css';

export default function FinalReveal({ time, activity }) {
  return (
    <section className="page fade-in">
      <Card>
        <div className={styles.msg}>
          ya eres hermosa,
          <br />
          pero estate lista a las <span className={styles.time}>{time}!</span>
        </div>

        {activity && (
          <div style={{
            textAlign: 'center', marginTop: '20px',
            background: 'var(--red-faint)', border: '1px solid var(--red)',
            borderRadius: '10px', padding: '12px 20px', color: 'var(--red)',
          }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{activity.category}</div>
            <div style={{ marginTop: 4, fontSize: '1rem' }}>{activity.text}</div>
          </div>
        )}

        <div className={styles.addr}>
          <span className={styles.sym}>📍dirección:</span> tu casa (pasaré por ti xd)
        </div>

        <div className={styles.gifArea}>
          <img src="/assets/garu-pucca.gif" alt="❤" />
        </div>
      </Card>
    </section>
  );
}
