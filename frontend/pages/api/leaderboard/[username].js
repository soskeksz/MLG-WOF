// pages/api/leaderboard/[username].js
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  const { username } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    await dbConnect();

    // Get user details with rank
    const userRankPipeline = [
      { $sort: { money: -1, username: 1 } },
      {
        $group: {
          _id: null,
          users: { $push: "$$ROOT" }
        }
      },
      { $unwind: { path: "$users", includeArrayIndex: "rank" } },
      { $addFields: { "users.rank": { $add: ["$rank", 1] } } },
      { $replaceRoot: { newRoot: "$users" } },
      { $match: { username: username } }
    ];

    const userResult = await User.aggregate(userRankPipeline);

    if (userResult.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = userResult[0];

    // Get users around this user's rank (context)
    const contextPipeline = [
      { $sort: { money: -1, username: 1 } },
      {
        $group: {
          _id: null,
          users: { $push: "$$ROOT" }
        }
      },
      { $unwind: { path: "$users", includeArrayIndex: "rank" } },
      { $addFields: { "users.rank": { $add: ["$rank", 1] } } },
      { $replaceRoot: { newRoot: "$users" } },
      {
        $match: {
          rank: {
            $gte: Math.max(1, user.rank - 2),
            $lte: user.rank + 2
          }
        }
      },
      {
        $project: {
          username: 1,
          money: 1,
          rank: 1
        }
      }
    ];

    const context = await User.aggregate(contextPipeline);

    // Calculate percentile
    const totalUsers = await User.countDocuments();
    const percentile = Math.round((1 - (user.rank - 1) / totalUsers) * 100);

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        money: user.money,
        gamesPlayed: user.gamesPlayed,
        lastPlayed: user.lastPlayed,
        rank: user.rank,
        percentile
      },
      context
    });

  } catch (error) {
    console.error('User leaderboard details error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user leaderboard details' 
    });
  }
}