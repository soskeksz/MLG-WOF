// pages/api/leaderboard/index.js
import dbConnect from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();

    // Get query parameters with defaults
    const {
      limit = 20,        // Number of users to return
      page = 1,          // Page number for pagination
      minMoney = 0,      // Filter users with money above this amount
      username          // Optional: highlight specific user
    } = req.query;

    // Convert string parameters to numbers
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 users per request
    const pageNum = Math.max(parseInt(page), 1);
    const skip = (pageNum - 1) * limitNum;

    // Build the aggregation pipeline
    const pipeline = [
      // Match users with money >= minMoney
      { $match: { money: { $gte: parseInt(minMoney) } } },
      
      // Sort by money (descending) then by username (ascending) for ties
      { $sort: { money: -1, username: 1 } },
      
      // Add rank field
      { $group: {
        _id: null,
        users: { $push: "$$ROOT" }
      }},
      { $unwind: { path: "$users", includeArrayIndex: "rank" } },
      { $addFields: { "users.rank": { $add: ["$rank", 1] } } },
      { $replaceRoot: { newRoot: "$users" } },
      
      // Skip and limit for pagination
      { $skip: skip },
      { $limit: limitNum },
      
      // Project only needed fields
      { $project: {
        username: 1,
        money: 1,
        gamesPlayed: 1,
        lastPlayed: 1,
        rank: 1
      }}
    ];

    // Execute the aggregation
    const leaderboard = await User.aggregate(pipeline);

    // Get total count for pagination info
    const totalUsers = await User.countDocuments({ money: { $gte: parseInt(minMoney) } });
    const totalPages = Math.ceil(totalUsers / limitNum);

    // If username is provided, get their specific rank
    let userRank = null;
    if (username) {
      const userRankPipeline = [
        { $match: { money: { $gte: parseInt(minMoney) } } },
        { $sort: { money: -1, username: 1 } },
        { $group: {
          _id: null,
          users: { $push: "$$ROOT" }
        }},
        { $unwind: { path: "$users", includeArrayIndex: "rank" } },
        { $addFields: { "users.rank": { $add: ["$rank", 1] } } },
        { $replaceRoot: { newRoot: "$users" } },
        { $match: { username: username } },
        { $project: { rank: 1, username: 1, money: 1 } }
      ];
      
      const userResult = await User.aggregate(userRankPipeline);
      userRank = userResult.length > 0 ? userResult[0] : null;
    }

    // Return the response
    res.status(200).json({
      success: true,
      leaderboard,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      userRank
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch leaderboard' 
    });
  }
}