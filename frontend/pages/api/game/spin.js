// pages/api/game/spin.js
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSpinResult() {
  const random = Math.random();
  
  // Simplified version with clear result-to-angle mapping
  if (random < 0.05) {
    return { result: "BANKRUPT", angle: getRandomInt(0, 60) };
  } else if (random < 0.35) {
    return { result: "LOSE", angle: getRandomInt(60, 120) };
  } else if (random < 0.65) {
    return { result: "KEEP", angle: getRandomInt(120, 180) };
  } else if (random < 0.85) {
    return { result: "TRIPLE", angle: getRandomInt(180, 240) };
  } else if (random < 0.95) {
    return { result: "THOMAS", angle: getRandomInt(240, 300) };
  } else {
    return { result: "JACKPOT", angle: getRandomInt(300, 360) };
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
    
    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      return res.status(400).json({ error: 'Valid bet amount is required' });
    }
    
    await connectToDatabase();
    
    // Find the user
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user has enough money
    if (user.money < betAmount) {
      return res.status(400).json({ error: 'Not enough money to place this bet' });
    }
    
    // Get spin result
    const { result, angle } = getSpinResult();
    let newBalance = user.money;
    
    // Update balance based on result
    switch (result) {
      case "JACKPOT":
        newBalance += betAmount * 10;
        break;
      case "THOMAS":
        newBalance += betAmount * 5;
        break;
      case "TRIPLE":
        newBalance += betAmount * 3;
        break;
      case "KEEP":
        // Balance stays the same
        break;
      case "LOSE":
        newBalance -= betAmount;
        break;
      case "BANKRUPT":
        newBalance = 0;
        break;
    }
    
    // Update user
    user.money = newBalance;
    user.lastPlayed = new Date();
    await user.save();
    
    // Return result
    return res.status(200).json({
      result,
      angle,
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