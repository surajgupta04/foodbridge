import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      login(data);
      if (data.role === 'restaurant') navigate('/restaurant');
      else navigate('/ngo');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fafaf8' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        .auth-input {
          width: 100%; padding: 12px 16px;
          border: 1.5px solid #e5e7eb; border-radius: 10px;
          font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff; color: #0d0d0d; outline: none;
          transition: border-color 0.2s;
        }
        .auth-input:focus { border-color: #16a34a; }
        .auth-input::placeholder { color: #9ca3af; }
        .btn-auth {
          width: 100%; padding: 13px;
          background: #0d0d0d; color: #fff;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-auth:hover { background: #1f1f1f; transform: translateY(-1px); }
        .btn-auth:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      {/* Left Panel */}
      <div style={{
        width: '45%', background: '#0d0d0d',
        padding: '60px', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* green glow */}
        <div style={{
          position: 'absolute', right: -120, bottom: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', left: -80, top: -80,
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' }}>
          food<span style={{ color: '#16a34a' }}>bridge</span>
        </div>

        {/* Middle */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)',
            color: '#4ade80', fontSize: 12, fontWeight: 600,
            padding: '6px 14px', borderRadius: 100, marginBottom: 28, letterSpacing: '0.06em'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            RESCUE · REDISTRIBUTE · REJOICE
          </div>
          <h2 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 38, fontWeight: 900,
            color: '#fff', lineHeight: 1.15, marginBottom: 16
          }}>
            Every meal saved<br />
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#4ade80' }}>matters.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 300 }}>
            Join hundreds of restaurants and NGOs already fighting food waste together.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { num: '2,400+', label: 'Meals rescued' },
            { num: '48', label: 'Active partners' },
            { num: '10km', label: 'Match radius' },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, padding: '20px 16px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 900, color: '#4ade80' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <div style={{
              display: 'inline-block', background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 100, marginBottom: 16
            }}>Welcome back</div>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 32, fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>
              Sign in to your account
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                Register here
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px',
              color: '#dc2626', fontSize: 14, marginBottom: 24
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8 }}>
                Email address
              </label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}