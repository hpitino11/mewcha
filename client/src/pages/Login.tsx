import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await api.auth.login(email, password);
      login(token, user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.kicker}>step into mewcha</span>
          <h1 className={styles.title}>Sign in.</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email" type="email" className={styles.input}
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password" type="password" className={styles.input}
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required
            />
          </div>

          <button className={styles.submit} disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={styles.footer}>
          New here? <Link to="/signup">Create an account →</Link>
        </p>
      </div>
    </div>
  );
}
