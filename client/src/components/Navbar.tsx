import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.inner}>

          <Link to="/" className={styles.logo} aria-label="Mewcha, home">
            <img src="/logo.png" alt="" aria-hidden="true" className={styles.logoIcon} />
            <span className={styles.logoText}>mewcha</span>
          </Link>

          <ul className={styles.links} role="list">
            <li>
              <NavLink to="/" end className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menu" className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}>
                Menu
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/orders" className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}>
                  Orders
                </NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <div className={styles.actions}>
            <Link to="/cart" className={styles.cartBtn} aria-label={`Cart, ${count} item${count !== 1 ? 's' : ''}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span className={styles.cartBadge} aria-live="polite">{count}</span>
              )}
            </Link>

            <div className={styles.divider} aria-hidden="true" />

            {user ? (
              <button className={styles.authBtn} onClick={logout}>Sign out</button>
            ) : (
              <Link to="/login" className={styles.authBtn}>Sign in</Link>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}
