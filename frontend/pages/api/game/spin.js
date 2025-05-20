// pages/api/game/spin.js
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

// Simple helper function
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Completely rewritten spin result function
function getSpinResult() {
  const random = Math.random();
  
  // Each segment is exactly at these fixed angles (center points)
  if (random < 0.05) {
    return { 
      result: "BANKRUPT", 
      // Center of BANKRUPT segment (0 degrees)
      segmentDegree: 0 
    };
  } else if (random < 0.35) {
    return { 
      result: "LOSE", 
      // Center of LOSE segment (60 degrees)
      segmentDegree: 60
    };
  } else if (random < 0.65) {
    return { 
      result: "KEEP", 
      // Center of KEEP segment (120 degrees)
      segmentDegree: 120
    };
  } else if (random < 0.85) {
    return { 
      result: "TRIPLE", 
      // Center of TRIPLE segment (180 degrees)
      segmentDegree: 180
    };
  } else if (random < 0.95) {
    return { 
      result: "THOMAS", 
      // Center of THOMAS segment (240 degrees)
      segmentDegree: 240
    };
  } else {
    return { 
      result: "JACKPOT", 
      // Center of JACKPOT segment (300 degrees)
      segmentDegree: 300
    };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { username, betAmount } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (!betAmount || isNaN(parseInt(betAmount)) || parseInt(betAmount) <= 0) {
      return res.status(400).json({ error: 'Valid bet amount is required' });
    }
    
    await connectToDatabase();
    
    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user has enough money
    if (user.money < parseInt(betAmount)) {
      return res.status(400).json({ error: 'Not enough money to place this bet' });
    }
    
    // Get spin result with fixed segment degrees
    const { result, segmentDegree } = getSpinResult();
    let newBalance = user.money;
    
    // Update balance based on result
    switch (result) {
      case "JACKPOT":
        newBalance += parseInt(betAmount) * 10;
        break;
      case "THOMAS":
        newBalance += parseInt(betAmount) * 5;
        break;
      case "TRIPLE":
        newBalance += parseInt(betAmount) * 3;
        break;
      case "KEEP":
        // Balance stays the same
        break;
      case "LOSE":
        newBalance -= parseInt(betAmount);
        break;
      case "BANKRUPT":
        newBalance = 0;
        break;
    }
    
    // Update user
    user.money = newBalance;
    user.lastPlayed = new Date();
    await user.save();
    
    // Return result with the fixed segment degree
    return res.status(200).json({
      result,
      segmentDegree,
      newBalance,
      username: user.username
    });
    
  } catch (error) {
    console.error('Spin error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}