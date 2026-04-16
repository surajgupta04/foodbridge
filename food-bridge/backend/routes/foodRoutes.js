import express from 'express';
import {
  createFoodPost,
  getAvailableFoodPosts,
  getMyFoodPosts,
  getMyClaims,
  claimFoodPost,
  markAsCollected,
  deleteFoodPost,
  editFoodPost
} from '../controllers/foodController.js';
import protect from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createFoodSchema, editFoodSchema } from '../validators/foodValidator.js';

const router = express.Router();

router.post('/',          protect, upload.single('image'), validate(createFoodSchema), createFoodPost);
router.get('/',           protect, getAvailableFoodPosts);
router.get('/my',         protect, getMyFoodPosts);
router.get('/myclaims',   protect, getMyClaims);
router.post('/:id/claim', protect, claimFoodPost);
router.put('/:id/collect',protect, markAsCollected);
router.delete('/:id',     protect, deleteFoodPost);
router.put('/:id/edit',   protect, validate(editFoodSchema), editFoodPost);

export default router;