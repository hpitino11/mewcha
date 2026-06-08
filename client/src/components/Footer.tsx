import { Link } from 'react-router-dom';
import PawStamp from './shared/PawStamp';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <PawStamp size={22} color="var(--color-accent)" />
            <span className={styles.brandName}>mewcha</span>
          </div>
          <p className={styles.tagline}>
            A warm corner for matcha, boba, and small<br />
            daily rituals. Come as you are.
          </p>
          <p className={styles.stamp}>neko café · portland, or</p>
        </div>

        <nav className={styles.col} aria-label="Footer navigation">
          <span className={styles.colTitle}>Explore</span>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Past Rituals</Link>
        </nav>

        <div className={styles.col}>
          <span className={styles.colTitle}>Visit</span>
          <p>123 Sakura Lane<br />Portland, OR 97201</p>
          <p className={styles.hours}>Mon–Fri  8am–7pm<br />Sat–Sun  9am–6pm</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>© {new Date().getFullYear()} Mewcha. All rights reserved.</span>
        <div className={styles.ritualLine}>
          <em>build your ritual</em>
          <PawStamp size={14} color="var(--color-accent-pale)" />
        </div>
      </div>
    </footer>
  );
}
