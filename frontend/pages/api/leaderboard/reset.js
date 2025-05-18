// pages/api/leaderboard/reset.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  // For development purposes only - remove in production
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'This endpoint is only available in development' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Reset all users to starting money and games played
    const result = await User.updateMany(
      {},
      {
        $set: {
          money: 1000,
          gamesPlayed: 0,
          lastPlayed: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `Reset ${result.modifiedCount} users to starting values`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Leaderboard reset error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to reset leaderboard' 
    });
  }
}