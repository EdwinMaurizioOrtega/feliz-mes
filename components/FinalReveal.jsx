import Card from '@/components/Card';
import styles from './FinalReveal.module.css';

export default function FinalReveal({ time }) {
  return (
    <section className="page fade-in">
      <Card>
        <div className={styles.msg}>
          ya eres hermosa,
          <br />
          pero estate lista a las <span className={styles.time}>{time}!</span>
        </div>

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
