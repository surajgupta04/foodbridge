import cron from 'node-cron';
import FoodPost from '../models/FoodPost.js';
import { io } from '../server.js';

export const startExpiryJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      const expiredPosts = await FoodPost.find({
        status: 'Available',
        expiresAt: { $lte: now }
      });

      if (expiredPosts.length === 0) return;

      const expiredIds = expiredPosts.map(p => p._id);

      await FoodPost.updateMany(
        { _id: { $in: expiredIds } },
        { $set: { status: 'Expired' } }
      );

      expiredPosts.forEach(post => {
        io.emit('foodExpired', { postId: post._id.toString() });
        console.log(`[ExpiryJob] Post ${post._id} marked Expired`);
      });

    } catch (err) {
      console.error('[ExpiryJob] Error:', err.message);
    }
  });

  console.log('[ExpiryJob] Cron started — checking every 60s');
};