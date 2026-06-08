import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import styles from './Auth.module.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { token, user } = await api.auth.signup(name, email, password);
      login(token, user);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.kicker}>create your ritual account</span>
          <h1 className={styles.title}>Join Mewcha.</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input
              id="name" type="text" className={styles.input}
              placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} required
            />
          </div>

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
              placeholder="Min. 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} required
              minLength={6}
            />
          </div>

          <button className={styles.submit} disabled={loading} type="submit">
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already a member? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
