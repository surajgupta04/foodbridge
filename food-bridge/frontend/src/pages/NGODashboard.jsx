import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { io } from 'socket.io-client';

const Countdown = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); setUrgent(true); return; }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setUrgent(mins < 15);
      setTimeLeft(`${mins}m ${secs}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div style={{
      display: 'inline-block',
      background: urgent ? '#fef2f2' : '#f0fdf4',
      color: urgent ? '#dc2626' : '#16a34a',
      fontSize: 11, fontWeight: 700,
      padding: '3px 10px', borderRadius: 100,
      border: `1px solid ${urgent ? '#fca5a5' : '#bbf7d0'}`,
      marginBottom: 10
    }}>
      ⏱ {timeLeft}
    </div>
  );
};

export default function NGODashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [claimedCode, setClaimedCode] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchMyClaims();
    const socket = io('http://localhost:5000');
    if (user?._id) socket.emit('joinRoom', user._id);

    socket.on('newFoodAlert', (data) => {
      setNotification({ message: `New food available: ${data.category} — ${data.quantity}`, id: data.id });
      fetchPosts();
      setTimeout(() => setNotification(null), 5000);
    });
    socket.on('foodClaimed', () => { fetchPosts(); fetchMyClaims(); });
    socket.on('foodCollected', () => { fetchPosts(); fetchMyClaims(); });
    socket.on('foodExpired', ({ postId }) => setPosts(prev => prev.filter(p => p._id !== postId)));
    return () => socket.disconnect();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/api/food');
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchMyClaims = async () => {
    try {
      const { data } = await api.get('/api/food/myclaims');
      setMyClaims(data);
    } catch (err) { console.error(err); }
  };

  const handleClaim = async (postId) => {
    setClaimingId(postId);
    try {
      const { data } = await api.post(`/api/food/${postId}/claim`);
      setClaimedCode({
        code: data.confirmationCode,
        quantity: data.foodPost.quantity,
        address: data.foodPost.location?.address,
        restaurant: data.foodPost.restaurantId?.name
      });
      await fetchPosts();
      await fetchMyClaims();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not claim food');
    } finally { setClaimingId(null); }
  };

  const handleLogout = () => { logout(); navigate('/'); };
  const available = posts.filter(p => p.status === 'Available');
  const claimed = posts.filter(p => p.status === 'Claimed');

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 60px', background: 'rgba(250,250,248,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d' }}>
          food<span style={{ color: '#16a34a' }}>bridge</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            Welcome, <strong style={{ color: '#0d0d0d' }}>{user?.name}</strong>
          </div>
          <button onClick={() => navigate('/profile')} style={{
            padding: '8px 16px', fontSize: 13,
            background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 8, cursor: 'pointer', color: '#0d0d0d',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
          }}>
            {user?.profilePhoto
              ? <img src={user.profilePhoto} alt="" style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 14 }}>👤</span>
            }
            Profile
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Real-time Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: 76, right: 24, zIndex: 999,
          background: '#0d0d0d', color: '#fff',
          borderRadius: 12, padding: '14px 20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          fontSize: 14, fontWeight: 500,
          maxWidth: 340, border: '1px solid #16a34a'
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#4ade80' }}>
            🔔 New Food Alert!
          </div>
          {notification.message}
        </div>
      )}

      <div style={{ padding: '40px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="tag" style={{ marginBottom: 12 }}>NGO Dashboard</div>
          <h1 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontSize: 36, fontWeight: 800, color: '#0d0d0d', marginBottom: 8
          }}>
            Available Food Near You
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280' }}>
            Claim surplus food from restaurants and distribute to communities in need.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { label: 'Available Now', value: available.length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            { label: 'Already Claimed', value: claimed.length, color: '#f97316', bg: '#fff7ed', border: '#fed7aa' },
            { label: 'My Claims', value: myClaims.length, color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.bg, borderRadius: 16,
              padding: '24px 28px', border: `1px solid ${stat.border}`
            }}>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 40, fontWeight: 900,
                color: stat.color, lineHeight: 1, marginBottom: 8
              }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Available Posts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#0d0d0d' }}>
            Available Food
          </h2>
          <span style={{
            background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
            fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 100
          }}>{available.length}</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#6b7280', fontSize: 14 }}>
            Loading available food...
          </div>
        ) : available.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 40px',
            background: '#fff', borderRadius: 16,
            border: '1px solid #e5e7eb', marginBottom: 40
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🕐</div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#0d0d0d', marginBottom: 8 }}>
              No food available right now
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              You'll get a real-time alert as soon as a restaurant posts food!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
            {available.map(post => (
              <div key={post._id} className="food-card">
                <div style={{
                  height: 180, overflow: 'hidden', background: '#f3f4f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {post.image ? (
                    <img src={`http://localhost:5000${post.image}`} alt="food"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 48 }}>🍱</span>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{
                    display: 'inline-block',
                    background: '#f3f4f6', color: '#374151',
                    fontSize: 10, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 6,
                    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8
                  }}>
                    {post.category || 'Uncategorized'}
                  </div>

                  {post.expiresAt && (
                    <div style={{ marginBottom: 2 }}>
                      <Countdown expiresAt={post.expiresAt} />
                    </div>
                  )}

                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: '#0d0d0d', marginBottom: 6 }}>
                    {post.quantity}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                    📍 {post.location?.address || 'No address'}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>
                    🍽️ {post.restaurantId?.name || 'Restaurant'}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>
                    {new Date(post.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  <button
                    onClick={() => handleClaim(post._id)}
                    disabled={claimingId === post._id}
                    style={{
                      width: '100%', padding: '11px',
                      background: claimingId === post._id ? '#e5e7eb' : '#0d0d0d',
                      color: claimingId === post._id ? '#9ca3af' : '#fff',
                      border: 'none', borderRadius: 10,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 14, fontWeight: 600,
                      cursor: claimingId === post._id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {claimingId === post._id ? 'Claiming...' : 'Claim This Food →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Claims */}
        {myClaims.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#0d0d0d' }}>
                My Claims
              </h2>
              <span style={{
                background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0',
                fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 100
              }}>{myClaims.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {myClaims.map(post => (
                <div key={post._id} style={{
                  background: '#fff', borderRadius: 16,
                  border: '1px solid #e5e7eb', padding: 20
                }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: '#0d0d0d', marginBottom: 8 }}>
                    {post.quantity}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                    📍 {post.location?.address}
                  </div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
                    🍽️ {post.restaurantId?.name}
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#f0fdf4', color: '#16a34a',
                    fontSize: 11, fontWeight: 700,
                    padding: '4px 12px', borderRadius: 100,
                    border: '1px solid #bbf7d0'
                  }}>
                    ✓ Claimed by you
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Code Modal */}
      {claimedCode && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: 24
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: 48, width: '100%', maxWidth: 420, textAlign: 'center'
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>
              Food Claimed!
            </h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
              Show this confirmation code to the restaurant when you collect the food.
            </p>
            <div style={{
              background: '#f0fdf4', border: '2px dashed #16a34a',
              borderRadius: 14, padding: '24px', marginBottom: 24
            }}>
              <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginBottom: 8, letterSpacing: '0.1em' }}>
                CONFIRMATION CODE
              </div>
              <div style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 48, fontWeight: 900, color: '#16a34a', letterSpacing: '0.15em'
              }}>
                {claimedCode.code}
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
              <strong style={{ color: '#0d0d0d' }}>Quantity:</strong> {claimedCode.quantity}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
              <strong style={{ color: '#0d0d0d' }}>Pickup:</strong> {claimedCode.address}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 28 }}>
              <strong style={{ color: '#0d0d0d' }}>Restaurant:</strong> {claimedCode.restaurant}
            </div>
            <button
              onClick={() => setClaimedCode(null)}
              className="btn-primary"
              style={{ width: '100%', fontSize: 15, padding: '13px' }}
            >
              Got it! ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
}