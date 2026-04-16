import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../utils/api';
import { useNavigate } from 'react-router-dom';
export default function ProfilePage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:           user?.name || '',
    phone:          user?.phone || '',
    address:        user?.address || '',
    cuisineType:    user?.cuisineType || '',
    operatingHours: user?.operatingHours || '',
    capacity:       user?.capacity || '',
    password:       '',
    confirmPassword: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || '');
  const [preview, setPreview]           = useState(user?.profilePhoto || '');
  const [saving, setSaving]             = useState(false);
  const [success, setSuccess]           = useState('');
  const [error, setError]               = useState('');
  const fileRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess('');
    setError('');
  };

  // Convert uploaded image to base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError('Image must be under 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhoto(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name:    form.name,
        phone:   form.phone,
        address: form.address,
        profilePhoto,
      };

      // Role-specific fields
      if (user.role === 'restaurant') {
        payload.cuisineType    = form.cuisineType;
        payload.operatingHours = form.operatingHours;
      }
      if (user.role === 'ngo') {
        payload.capacity = form.capacity;
      }

      // Only send password if user typed one
      if (form.password.trim()) {
        payload.password = form.password;
      }

      const { data } = await updateProfile(payload);

      // Update AuthContext + localStorage with fresh data
      login({ ...data, token: data.token });

      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        {/* Header */}
<button
  onClick={() => navigate(-1)}
  style={{
    background: 'none', border: 'none',
    cursor: 'pointer', color: '#92775c',
    fontSize: 14, fontWeight: 600,
    display: 'flex', alignItems: 'center',
    gap: 6, marginBottom: 20, padding: 0
  }}
>
  ← Back
</button>
<h2 style={styles.title}>My Profile</h2>
<p style={styles.subtitle}>
  {user?.role === 'restaurant' ? '🍽️ Restaurant Account' : '🤝 NGO Account'}
</p>

        {/* Profile Photo */}
        <div style={styles.photoSection}>
          <div style={styles.avatarWrap} onClick={() => fileRef.current.click()}>
            {preview
              ? <img src={preview} alt="Profile" style={styles.avatar} />
              : <div style={styles.avatarPlaceholder}>
                  {user?.name?.[0]?.toUpperCase() || '?'}
                </div>
            }
            <div style={styles.avatarOverlay}>Change</div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <p style={styles.photoHint}>Click photo to change · Max 1MB</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Common fields */}
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={styles.input}
              placeholder="+91 98765 43210"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              style={styles.input}
              placeholder="Area, City"
            />
            <span style={styles.hint}>Changing address will update your location for geo-matching</span>
          </div>

          {/* Restaurant-only fields */}
          {user?.role === 'restaurant' && (
            <>
              <div style={styles.group}>
                <label style={styles.label}>Cuisine Type</label>
                <input
                  name="cuisineType"
                  value={form.cuisineType}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. Indian, Chinese, Multi-cuisine"
                />
              </div>

              <div style={styles.group}>
                <label style={styles.label}>Operating Hours</label>
                <input
                  name="operatingHours"
                  value={form.operatingHours}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g. Mon–Sat 9am–10pm"
                />
              </div>
            </>
          )}

          {/* NGO-only fields */}
          {user?.role === 'ngo' && (
            <div style={styles.group}>
              <label style={styles.label}>Capacity (meals per day)</label>
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. 200"
                min="0"
              />
            </div>
          )}

          {/* Divider */}
          <div style={styles.divider} />
          <p style={styles.sectionLabel}>Change Password</p>

          <div style={styles.group}>
            <label style={styles.label}>New Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Leave blank to keep current"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Repeat new password"
            />
          </div>

          {/* Feedback */}
          {error   && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.btn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f9',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 16px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 4px',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '28px',
  },
  photoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  avatarWrap: {
    position: 'relative',
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    cursor: 'pointer',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    background: '#4CAF50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: '700',
    color: '#fff',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: '12px',
    textAlign: 'center',
    padding: '4px 0',
  },
  photoHint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '6px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  hint: {
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  divider: {
    height: '1px',
    background: '#eee',
    margin: '8px 0 16px',
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  error: {
    color: '#e53935',
    fontSize: '13px',
    marginBottom: '8px',
  },
  success: {
    color: '#2e7d32',
    fontSize: '13px',
    marginBottom: '8px',
  },
  btn: {
    padding: '12px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
};