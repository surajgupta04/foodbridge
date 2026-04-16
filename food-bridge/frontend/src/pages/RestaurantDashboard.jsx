// Core React hooks and router
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Auth context and API utility
import { useAuth } from '../context/AuthContext';
import api,{getProfile} from '../utils/api';

// Socket.io for real-time updates
import { io } from 'socket.io-client';

export default function RestaurantDashboard() {
  // Auth state and navigation
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Posts list and loading state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post food modal state
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ quantity: '', address: '', image: null, expiryDuration: '120' });
  const [preview, setPreview] = useState(null);

  // Success message state
  const [successMsg, setSuccessMsg] = useState('');

  // Edit modal state
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ quantity: '', address: '', expiryDuration: '120' });

  // On mount — fetch posts and connect socket for live updates
  useEffect(() => {
    fetchMyPosts();
    const socket = io('http://localhost:5000');
    socket.on('foodClaimed',   () => fetchMyPosts());
    socket.on('foodCollected', () => fetchMyPosts());
    socket.on('newFoodAlert',  () => fetchMyPosts());
    socket.on('foodExpired',   () => fetchMyPosts());
    return () => socket.disconnect();
  }, []);
  // Add this new useEffect after the existing one
useEffect(() => {
  const prefillAddress = async () => {
    try {
      const { data } = await getProfile();
      setForm(prev => ({ ...prev, address: data.address || '' }));
    } catch (err) { console.error(err); }
  };
  prefillAddress();
}, []);

  // Fetch all food posts belonging to this restaurant
  const fetchMyPosts = async () => {
    try {
      const { data } = await api.get('/api/food/my');
      setPosts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Handle food image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setForm({ ...form, image: file }); setPreview(URL.createObjectURL(file)); }
  };

  // Submit new food post with image upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', form.image);
      formData.append('quantity', form.quantity);
      formData.append('address', form.address);
      formData.append('expiryDuration', form.expiryDuration);
      await api.post('/api/food', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessMsg('Food posted successfully!');
      setShowForm(false);
      setForm({ quantity: '', address: '', image: null, expiryDuration: '120' });
      setPreview(null);
      fetchMyPosts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  // Delete an available food post
  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/api/food/${postId}`);
      setSuccessMsg('Post deleted successfully!');
      fetchMyPosts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Could not delete post'); }
  };

  // Submit edited food post details
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/food/${editingPost._id}/edit`, editForm);
      setSuccessMsg('Post updated successfully!');
      setEditingPost(null);
      fetchMyPosts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Could not edit post'); }
  };

  // Mark a claimed post as physically collected by NGO
  const handleCollect = async (postId) => {
    if (!window.confirm('Confirm that the NGO has physically collected this food?')) return;
    try {
      await api.put(`/api/food/${postId}/collect`);
      setSuccessMsg('Food marked as collected! ✓');
      fetchMyPosts();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { alert(err.response?.data?.message || 'Could not mark as collected'); }
  };

  // Clear auth and redirect to landing
  const handleLogout = () => { logout(); navigate('/'); };

  // Calculate expiry label for available posts
  const getExpiryLabel = (post) => {
    if (post.status !== 'Available' || !post.expiresAt) return null;
    const diff = new Date(post.expiresAt) - new Date();
    if (diff <= 0) return { label: 'Expired', urgent: true };
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return { label: `Expires in ${mins}m`, urgent: mins < 15 };
    const hrs = Math.floor(mins / 60);
    return { label: `Expires in ${hrs}h`, urgent: false };
  };

  // Aggregate stats from posts array
  const stats = {
    total:     posts.length,
    available: posts.filter(p => p.status === 'Available').length,
    claimed:   posts.filter(p => p.status === 'Claimed').length,
    collected: posts.filter(p => p.status === 'Collected').length,
  };

  // Claimed posts with NGO info — used to show NGO names in the stat card
  const claimedPosts = posts.filter(p => p.status === 'Claimed');

  // Return status dot color based on post status
  const statusColor = (status) => {
    if (status === 'Available') return '#16a34a';
    if (status === 'Claimed')   return '#f97316';
    if (status === 'Expired')   return '#dc2626';
    return '#6b7280';
  };

  // Return status background color based on post status
  const statusBg = (status) => {
    if (status === 'Available') return '#f0fdf4';
    if (status === 'Claimed')   return '#fff7ed';
    if (status === 'Expired')   return '#fef2f2';
    return '#f9fafb';
  };

  // Reusable label style for form fields
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: '#0d0d0d', display: 'block', marginBottom: 8
  };

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Sticky navbar with logo, profile, post food, and logout ── */}
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
          <button onClick={() => setShowForm(true)} className="btn-green" style={{ padding: '8px 18px', fontSize: 13 }}>
            + Post Food
          </button>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px 60px' }}>

        {/* ── Green success toast shown after post/edit/delete/collect actions ── */}
        {successMsg && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 10, padding: '12px 18px',
            color: '#16a34a', fontSize: 14, marginBottom: 24, fontWeight: 600
          }}>
            ✓ {successMsg}
          </div>
        )}

        {/* ── Page header with dashboard tag and title ── */}
        <div style={{ marginBottom: 40 }}>
          <div className="tag" style={{ marginBottom: 12 }}>Restaurant Dashboard</div>
          <h1 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 36, fontWeight: 800, color: '#0d0d0d', marginBottom: 8 }}>
            Your Food Donations
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280' }}>
            Track all your surplus food posts and their status.
          </p>
        </div>

        {/* ── Stats grid — Total, Available, Claimed (with NGO names), Collected ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>

          {/* Total Posts */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 900, color: '#0d0d0d', lineHeight: 1, marginBottom: 8 }}>
              {stats.total}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Total Posts</div>
          </div>

          {/* Available */}
          <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '24px 28px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 900, color: '#16a34a', lineHeight: 1, marginBottom: 8 }}>
              {stats.available}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Available</div>
          </div>

          {/* Claimed — shows NGO names when posts are claimed */}
          <div style={{ background: '#fff7ed', borderRadius: 16, padding: '24px 28px', border: '1px solid #fed7aa' }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 900, color: '#f97316', lineHeight: 1, marginBottom: 8 }}>
              {stats.claimed}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginBottom: claimedPosts.length > 0 ? 12 : 0 }}>
              Claimed
            </div>
            {/* NGO name sub-cards — only visible when claimed > 0 */}
            {claimedPosts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {claimedPosts.map(post => (
                  <div key={post._id} style={{
                    background: '#fff', borderRadius: 8,
                    padding: '8px 10px', border: '1px solid #fed7aa'
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#f97316' }}>
                      🤝 {post.claimedBy?.name || 'NGO'}
                    </div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>
                      {post.quantity} · waiting for collection
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collected */}
          <div style={{ background: '#f9fafb', borderRadius: 16, padding: '24px 28px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 900, color: '#6b7280', lineHeight: 1, marginBottom: 8 }}>
              {stats.collected}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>Collected</div>
          </div>

        </div>

        {/* ── Food posts grid — loading, empty state, or cards ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#6b7280', fontSize: 14 }}>
            Loading your posts...
          </div>
        ) : posts.length === 0 ? (
          // Empty state when restaurant has no posts yet
          <div style={{
            textAlign: 'center', padding: '64px 40px',
            background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍱</div>
            <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#0d0d0d', marginBottom: 8 }}>
              No posts yet
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>
              Start by posting your first surplus food item
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Post Your First Food →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {posts.map(post => {
              const expiry = getExpiryLabel(post);
              return (
                <div key={post._id} className="food-card">

                  {/* Food image or fallback emoji */}
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

                  {/* Card body — category, expiry, quantity, address, date */}
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: '#f3f4f6', color: '#374151',
                      fontSize: 10, fontWeight: 700,
                      padding: '3px 10px', borderRadius: 6,
                      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8
                    }}>
                      {post.category || 'Uncategorized'}
                    </div>

                    {/* Expiry timer badge — turns red under 15 mins */}
                    {expiry && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{
                          display: 'inline-block',
                          background: expiry.urgent ? '#fef2f2' : '#f0fdf4',
                          color: expiry.urgent ? '#dc2626' : '#16a34a',
                          fontSize: 11, fontWeight: 700,
                          padding: '3px 10px', borderRadius: 100,
                          border: `1px solid ${expiry.urgent ? '#fca5a5' : '#bbf7d0'}`
                        }}>
                          ⏱ {expiry.label}
                        </span>
                      </div>
                    )}

                    <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: '#0d0d0d', marginBottom: 6 }}>
                      {post.quantity}
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
                      📍 {post.location?.address || 'No address'}
                    </div>

                    {/* Show NGO name on the card body when claimed */}
                    {post.status === 'Claimed' && post.claimedBy?.name && (
                      <div style={{
                        fontSize: 12, color: '#f97316', fontWeight: 600,
                        marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        🤝 Claimed by {post.claimedBy.name}
                      </div>
                    )}

                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      {new Date(post.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </div>

                  {/* Card footer — status badge + action buttons per status */}
                  <div style={{
                    padding: '12px 20px', borderTop: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    {/* Coloured status pill */}
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: statusBg(post.status),
                      padding: '4px 10px', borderRadius: 6
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(post.status) }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: statusColor(post.status) }}>
                        {post.status}
                      </span>
                    </div>

                    {/* Claimed status — show confirmation code + Mark as Collected button */}
                    {post.status === 'Claimed' && (
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {post.confirmationCode && (
                          <span style={{
                            fontSize: 11, background: '#f3f4f6', color: '#374151',
                            padding: '3px 10px', borderRadius: 6, fontWeight: 600
                          }}>
                            Code: {post.confirmationCode}
                          </span>
                        )}
                        <button
                          onClick={() => handleCollect(post._id)}
                          style={{
                            background: '#16a34a', color: '#fff',
                            border: 'none', borderRadius: 6,
                            padding: '5px 12px', fontSize: 11,
                            fontWeight: 600, cursor: 'pointer',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={e => e.target.style.background = '#15803d'}
                          onMouseOut={e => e.target.style.background = '#16a34a'}
                        >
                          ✓ Mark Collected
                        </button>
                      </div>
                    )}

                    {/* Available status — show edit and delete buttons */}
                    {post.status === 'Available' && (
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            setEditingPost(post);
                            setEditForm({
                              quantity: post.quantity,
                              address: post.location?.address || '',
                              expiryDuration: String(post.expiryDuration || 120)
                            });
                          }}
                          style={{
                            background: '#f3f4f6', color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: 6, padding: '4px 12px',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post._id)}
                          style={{
                            background: '#fef2f2', color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: 6, padding: '4px 12px',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Post Food Modal — form to create a new food post with image upload ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: 40, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 24, fontWeight: 800, color: '#0d0d0d' }}>
                Post Surplus Food
              </h2>
              <button onClick={() => { setShowForm(false); setPreview(null); }}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Image upload area with click-to-upload and preview */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Food Photo *</label>
                <div
                  onClick={() => document.getElementById('imageInput').click()}
                  style={{
                    border: '2px dashed #e5e7eb', borderRadius: 12,
                    padding: 24, textAlign: 'center', cursor: 'pointer',
                    background: preview ? 'transparent' : '#fafaf8',
                    overflow: 'hidden', transition: 'border 0.2s'
                  }}
                >
                  {preview ? (
                    <img src={preview} alt="preview"
                      style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>Click to upload food photo</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>JPG, PNG up to 10MB</div>
                    </>
                  )}
                </div>
                <input id="imageInput" type="file" accept="image/*"
                  onChange={handleImageChange} style={{ display: 'none' }} required />
              </div>

              {/* Quantity input */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Quantity *</label>
                <input className="input-field" type="text"
                  placeholder="e.g. 5 kg, 20 packets, 10 portions"
                  value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })} required />
              </div>

              {/* Pickup address input */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Pickup Address *</label>
                <input className="input-field" type="text"
                  placeholder="e.g. 123 MG Road, Vadodara"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })} required />
              </div>

              {/* Expiry duration dropdown */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Food expires in *</label>
                <select className="input-field"
                  value={form.expiryDuration}
                  onChange={e => setForm({ ...form, expiryDuration: e.target.value })}
                  style={{ cursor: 'pointer' }}>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="360">6 hours</option>
                  <option value="720">12 hours</option>
                </select>
              </div>

              <button type="submit" className="btn-green"
                disabled={submitting}
                style={{ width: '100%', fontSize: 15, padding: '13px', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Posting...' : 'Post Food 🍱'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal — update quantity, address, and expiry of an existing post ── */}
      {editingPost && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24
        }}>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: 40, width: '100%', maxWidth: 440
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: '#0d0d0d' }}>
                Edit Food Post
              </h2>
              <button onClick={() => setEditingPost(null)}
                style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#6b7280' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleEdit}>
              {/* Editable quantity field */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Quantity</label>
                <input className="input-field" type="text"
                  value={editForm.quantity}
                  onChange={e => setEditForm({ ...editForm, quantity: e.target.value })} required />
              </div>

              {/* Editable pickup address field */}
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Pickup Address</label>
                <input className="input-field" type="text"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })} required />
              </div>

              {/* Reset expiry duration from now */}
              <div style={{ marginBottom: 28 }}>
                <label style={labelStyle}>Reset expiry to</label>
                <select className="input-field"
                  value={editForm.expiryDuration}
                  onChange={e => setEditForm({ ...editForm, expiryDuration: e.target.value })}
                  style={{ cursor: 'pointer' }}>
                  <option value="60">1 hour from now</option>
                  <option value="120">2 hours from now</option>
                  <option value="180">3 hours from now</option>
                  <option value="360">6 hours from now</option>
                  <option value="720">12 hours from now</option>
                </select>
              </div>

              {/* Cancel and save buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setEditingPost(null)}
                  className="btn-secondary" style={{ flex: 1, fontSize: 14, padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-green"
                  style={{ flex: 1, fontSize: 14, padding: '12px' }}>
                  Save Changes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}