import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'restaurant', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/register', form);
      login(data);
      if (data.role === 'restaurant') navigate('/restaurant');
      else navigate('/ngo');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        .role-btn {
          flex: 1; padding: 10px;
          border-radius: 8px; border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
      `}</style>

      {/* Left Panel */}
      <div style={{
        width: '45%', background: '#0d0d0d',
        padding: '60px', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', right: -120, top: -120,
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', left: -80, bottom: -80,
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
            JOIN THE MOVEMENT
          </div>
          <h2 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 38, fontWeight: 900,
            color: '#fff', lineHeight: 1.15, marginBottom: 16
          }}>
            Join the movement<br />
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#4ade80' }}>to end food waste.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 300 }}>
            Whether you're a restaurant with surplus food or an NGO ready to distribute — you belong here.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '🍱', title: 'Restaurants', sub: 'Post surplus food, track donations, build CSR profile' },
            { icon: '🤝', title: 'NGOs', sub: 'Get geo-matched alerts, claim food, feed communities' },
          ].map(r => (
            <div key={r.title} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 12,
              padding: '16px 20px', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <span style={{ fontSize: 24 }}>{r.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{r.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'inline-block', background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', fontSize: 12, fontWeight: 600,
              padding: '4px 12px', borderRadius: 100, marginBottom: 16
            }}>Create account</div>
            <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 32, fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>
              Get started for free
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#16a34a', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '12px 16px',
              color: '#dc2626', fontSize: 14, marginBottom: 24
            }}>{error}</div>
          )}

          {/* Role Toggle */}
          <div style={{
            display: 'flex', background: '#f3f4f6',
            borderRadius: 10, padding: 4, marginBottom: 24, gap: 4
          }}>
            {['restaurant', 'ngo'].map(role => (
              <button
                key={role}
                onClick={() => setForm({ ...form, role })}
                className="role-btn"
                style={{
                  background: form.role === role ? '#0d0d0d' : 'transparent',
                  color: form.role === role ? '#fff' : '#6b7280',
                }}
              >
                {role === 'restaurant' ? '🍱 Restaurant' : '🤝 NGO'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8 }}>
                {form.role === 'restaurant' ? 'Restaurant Name' : 'NGO Name'}
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder={form.role === 'restaurant' ? 'e.g. Spice Garden Restaurant' : 'e.g. Helping Hands NGO'}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8 }}>
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8 }}>
                {form.role === 'restaurant' ? 'Restaurant Address' : 'NGO Address'}
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder="e.g. 12 MG Road, Alkapuri, Vadodara"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                required
              />
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                Used to find nearby {form.role === 'restaurant' ? 'NGOs' : 'food'} within 10km
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? 'Creating account...' : `Create ${form.role === 'restaurant' ? 'Restaurant' : 'NGO'} Account →`}
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