// pages/api/leaderboard/stats.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Get leaderboard statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalPlayers: { $sum: 1 },
          totalMoney: { $sum: "$money" },
          averageMoney: { $avg: "$money" },
          maxMoney: { $max: "$money" },
          minMoney: { $min: "$money" },
          totalGamesPlayed: { $sum: "$gamesPlayed" },
          averageGamesPlayed: { $avg: "$gamesPlayed" },
          activePlayers: {
            $sum: {
              $cond: [
                { $gte: ["$lastPlayed", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get top performers
    const topPerformers = await User.find({})
      .sort({ money: -1 })
      .limit(3)
      .select('username money gamesPlayed');

    // Get most active players (by games played)
    const mostActive = await User.find({})
      .sort({ gamesPlayed: -1 })
      .limit(3)
      .select('username gamesPlayed money');

    // Get recent players
    const recentPlayers = await User.find({})
      .sort({ lastPlayed: -1 })
      .limit(5)
      .select('username lastPlayed money');

    const result = {
      success: true,
      stats: stats[0] || {},
      topPerformers,
      mostActive,
      recentPlayers
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Leaderboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch leaderboard statistics' 
    });
  }
}