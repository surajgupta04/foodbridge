import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { geocodeAddress } from '../utils/geocode.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// NEW — one helper function that sets the cookie on the response
// We call this in register, login, and updateProfile
// Keeping it in one place means if you ever change cookie settings
// you only change it here, not in 3 different functions
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,   // JS cannot read this cookie — protects against XSS attacks
    secure:   false,  // set to TRUE in production (requires HTTPS)
    sameSite: 'lax',  // protects against CSRF attacks
                      // 'lax' allows cookie on normal navigation
                      // use 'none' only if frontend and backend are on different domains
    maxAge:   7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds — matches JWT expiry
  });
};

export const register = async (req, res) => {
  const { name, email, password, role, address } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'Email already registered' });

    const user = new User({ name, email, password, role, address });

    if (address && address.trim()) {
      const coords = await geocodeAddress(address);
      if (coords) {
        user.location = {
          type: 'Point',
          coordinates: [coords.lng, coords.lat]
        };
        console.log(`[Register] "${address}" → ${coords.lat}, ${coords.lng}`);
      } else {
        console.warn(`[Register] Could not geocode: ${address}`);
      }
    }

    await user.save();

    const token = generateToken(user._id, user.role);

    // CHANGED — set cookie on response instead of sending token in body
    // The token is now invisible to frontend JavaScript
    setTokenCookie(res, token);

    // CHANGED — token removed from response body
    // Frontend gets user info for the UI (name, role etc)
    // but never sees the actual JWT string
    res.status(201).json({
      _id:     user._id,
      name:    user.name,
      email:   user.email,
      role:    user.role,
      address: user.address,
    });
  } catch (error) {
    console.error('[Register ERROR]', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);

    // CHANGED — set httpOnly cookie, token removed from response body
    setTokenCookie(res, token);

    res.json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      address:        user.address,
      phone:          user.phone,
      profilePhoto:   user.profilePhoto,
      cuisineType:    user.cuisineType,
      operatingHours: user.operatingHours,
      capacity:       user.capacity,
      // token field REMOVED — it's in the cookie now, not the body
    });
  } catch (error) {
    console.error('[Login ERROR]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// NEW — logout endpoint that clears the cookie
// Before cookies, logout was 100% frontend (just delete localStorage)
// Now the server must clear the cookie because the frontend can't touch it
export const logout = async (req, res) => {
  // Clear the cookie by setting it to empty with maxAge 0
  // This immediately expires it in the browser
  res.cookie('token', '', {
    httpOnly: true,
    secure:   false,
    sameSite: 'lax',
    maxAge:   0  // expires immediately
  });
  res.json({ message: 'Logged out successfully' });
};

// GET /api/auth/profile — unchanged, req.user comes from middleware
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('[GetProfile ERROR]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, address, phone, profilePhoto, cuisineType, operatingHours, capacity, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (name)                         user.name = name;
    if (phone !== undefined)          user.phone = phone;
    if (profilePhoto !== undefined)   user.profilePhoto = profilePhoto;
    if (cuisineType !== undefined)    user.cuisineType = cuisineType;
    if (operatingHours !== undefined) user.operatingHours = operatingHours;
    if (capacity !== undefined)       user.capacity = capacity;

    if (address !== undefined && address !== user.address) {
      user.address = address;
      if (address.trim()) {
        const coords = await geocodeAddress(address);
        if (coords) {
          user.location = { type: 'Point', coordinates: [coords.lng, coords.lat] };
          console.log(`[UpdateProfile] "${address}" → ${coords.lat}, ${coords.lng}`);
        } else {
          console.warn(`[UpdateProfile] Could not geocode: ${address}`);
        }
      }
    }

    if (password && password.trim()) {
      user.password = password;
    }

    await user.save();

    const token = generateToken(user._id, user.role);

    // CHANGED — refresh the cookie with new token after profile update
    // This is important — if role or id ever changed, the old cookie would be stale
    setTokenCookie(res, token);

    // CHANGED — token removed from response body
    res.json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      address:        user.address,
      phone:          user.phone,
      profilePhoto:   user.profilePhoto,
      cuisineType:    user.cuisineType,
      operatingHours: user.operatingHours,
      capacity:       user.capacity,
      // token REMOVED from body — lives in cookie now
    });
  } catch (error) {
    console.error('[UpdateProfile ERROR]', error.message);
    res.status(500).json({ message: error.message });
  }
};