import FoodPost from '../models/FoodPost.js';
import User from '../models/User.js';
import { classifyFood } from '../config/huggingface.js';
import { geocodeAddress } from '../utils/geocode.js';
import { io } from '../server.js';

// POST /api/food — create a new food post
export const createFoodPost = async (req, res) => {
  try {
    const { quantity, address, expiryDuration } = req.body;

    if (!req.file)
      return res.status(400).json({ message: 'Image is required' });

    const imagePath = req.file.path;
    const imageUrl  = `/uploads/${req.file.filename}`;
    const category  = await classifyFood(imagePath);

    const durationMins = parseInt(expiryDuration) || 120;
    const expiresAt    = new Date(Date.now() + durationMins * 60 * 1000);

    // Geocode the food pickup address
    let foodCoords = null;
    if (address && address.trim()) {
      foodCoords = await geocodeAddress(address);
      if (foodCoords) {
        console.log(`[GeoFood] "${address}" → ${foodCoords.lat}, ${foodCoords.lng}`);
      } else {
        console.warn(`[GeoFood] Could not geocode food address: ${address}`);
      }
    }

    // Build location object separately — avoid spread causing schema issues
    const locationData = { address };
    if (foodCoords) {
      locationData.type        = 'Point';
      locationData.coordinates = [foodCoords.lng, foodCoords.lat];
    }

    const foodPost = await FoodPost.create({
      restaurantId:   req.user.id,
      image:          imageUrl,
      category,
      quantity,
      location:       locationData,
      status:         'Available',
      expiryDuration: durationMins,
      expiresAt
    });

    console.log(`[FoodPost] Created with expiresAt: ${foodPost.expiresAt}`);

    // Find NGOs within 10km
    let nearbyNGOIds = [];
    if (foodCoords) {
      const nearbyNGOs = await User.find({
        role: 'ngo',
        location: {
          $near: {
            $geometry: {
              type:        'Point',
              coordinates: [foodCoords.lng, foodCoords.lat]
            },
            $maxDistance: 10000
          }
        }
      }).select('_id');

      nearbyNGOIds = nearbyNGOs.map(n => n._id.toString());
      console.log(`[GeoMatch] ${nearbyNGOIds.length} NGO(s) within 10km of "${address}"`);
    }

    const alertPayload = {
      id:        foodPost._id,
      category,
      quantity,
      address,
      image:     imageUrl,
      expiresAt: foodPost.expiresAt
    };

    if (nearbyNGOIds.length > 0) {
      nearbyNGOIds.forEach(ngoId => {
        io.to(`user_${ngoId}`).emit('newFoodAlert', alertPayload);
      });
      console.log(`[Socket] Alert sent to ${nearbyNGOIds.length} nearby NGO(s)`);
    } else {
      console.log('[Socket] No nearby NGOs found — broadcasting to all');
      io.emit('newFoodAlert', alertPayload);
    }

    res.status(201).json(foodPost);
  } catch (error) {
    console.error('[CreateFood ERROR]', error.message);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/food — get all available food posts (excludes expired)
export const getAvailableFoodPosts = async (req, res) => {
  try {
    const posts = await FoodPost.find({
      status:       'Available',
      expiresAt:    { $gt: new Date() },
      restaurantId: { $ne: req.user.id }
    })
      .populate('restaurantId', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/food/my — restaurant sees their own posts
export const getMyFoodPosts = async (req, res) => {
  try {
    const posts = await FoodPost.find({ restaurantId: req.user.id })
      .populate('claimedBy', 'name phone') // NEW — replaces claimedBy ObjectId with { name, phone }
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/food/myclaims — NGO sees all food they have claimed
export const getMyClaims = async (req, res) => {
  try {
    const posts = await FoodPost.find({ claimedBy: req.user.id })
      .populate('restaurantId', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/food/:id/claim — NGO claims a food post
export const claimFoodPost = async (req, res) => {
  try {
    const foodPost = await FoodPost.findById(req.params.id);

    if (!foodPost)
      return res.status(404).json({ message: 'Food post not found' });

    if (foodPost.status === 'Expired' || new Date() > new Date(foodPost.expiresAt))
      return res.status(400).json({ message: 'This food post has expired' });

    if (foodPost.status !== 'Available')
      return res.status(400).json({ message: 'Food already claimed' });

    if (req.user.role !== 'ngo')
      return res.status(403).json({ message: 'Only NGOs can claim food' });

    const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const updated = await FoodPost.findOneAndUpdate(
      { _id: req.params.id, status: 'Available' },
      {
        status: 'Claimed',
        claimedBy: req.user.id,
        confirmationCode
      },
      { new: true }
    ).populate('restaurantId', 'name email');

    if (!updated)
      return res.status(400).json({ message: 'Food already claimed by another NGO' });

    io.emit('foodClaimed', {
      id:              updated._id,
      claimedBy:       req.user.id,
      confirmationCode
    });

    res.json({
      message:         'Food claimed successfully',
      confirmationCode,
      foodPost:        updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/food/:id/collect — mark food as collected
export const markAsCollected = async (req, res) => {
  try {
    const foodPost = await FoodPost.findById(req.params.id);

    if (!foodPost)
      return res.status(404).json({ message: 'Food post not found' });

    if (foodPost.status !== 'Claimed')
      return res.status(400).json({ message: 'Food is not claimed yet' });

    const isRestaurant  = foodPost.restaurantId.toString() === req.user.id;
    const isClaimingNGO = foodPost.claimedBy.toString()    === req.user.id;

    if (!isRestaurant && !isClaimingNGO)
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await FoodPost.findByIdAndUpdate(
      req.params.id,
      { status: 'Collected' },
      { new: true }
    );

    io.emit('foodCollected', { id: updated._id });

    res.json({ message: 'Marked as collected', foodPost: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/food/:id
export const deleteFoodPost = async (req, res) => {
  try {
    const post = await FoodPost.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: 'Post not found' });

    if (post.restaurantId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    if (post.status !== 'Available')
      return res.status(400).json({ message: 'Cannot delete a claimed post' });

    await FoodPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/food/:id/edit
export const editFoodPost = async (req, res) => {
  try {
    const post = await FoodPost.findById(req.params.id);

    if (!post)
      return res.status(404).json({ message: 'Post not found' });

    if (post.restaurantId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    if (post.status !== 'Available')
      return res.status(400).json({ message: 'Cannot edit a claimed post' });

    const { quantity, address, expiryDuration } = req.body;

    const updateFields = {
      quantity,
      'location.address': address
    };

    if (expiryDuration) {
      const durationMins          = parseInt(expiryDuration);
      updateFields.expiryDuration = durationMins;
      updateFields.expiresAt      = new Date(Date.now() + durationMins * 60 * 1000);
    }

    const updated = await FoodPost.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
