import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Game logic function
function getSpinResult() {
  const random = Math.random();
  
  if (random < 0.05) {
    return { result: "BANKRUPT", angle: getRandomInt(0, 18) };
  } else if (random > 0.05 && random < 0.35) {
    return { result: "LOSE", angle: getRandomInt(18, 126) };
  } else if (random > 0.35 && random < 0.65) {
    return { result: "KEEP", angle: getRandomInt(126, 234) };
  } else if (random > 0.65 && random < 0.85) {
    return { result: "TRIPLE", angle: getRandomInt(234, 306) };
  } else if (random > 0.85 && random < 0.95) {
    return { result: "THOMAS", angle: getRandomInt(306, 342) };         
  } else {
    return { result: "JACKPOT", angle: getRandomInt(342, 360) };
  }
}

export default async function handler(req, res) {
  await connectToDatabase();
  
  // Handle POST request (spin the wheel)
  if (req.method === 'POST') {
    const { username, betAmount } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    if (!betAmount || betAmount <= 0) {
      return res.status(400).json({ error: 'Valid bet amount is required' });
    }
    
    try {
      // Find the user
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user has enough money to bet
      if (user.money < betAmount) {
        return res.status(400).json({ error: 'Not enough money to place this bet' });
      }
      
      // Spin the wheel
      const { result, angle} = getSpinResult();
      let newBalance = user.money;
      
      // Process the result
      switch (result) {
        case "JACKPOT":
          newBalance += betAmount * 42;
          break;
        case "THOMAS":
          newBalance += betAmount * 6.9;
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
      
      // Update user's money
      user.money = newBalance;
      user.lastPlayed = new Date();
      await user.save();
      
      return res.status(200).json({
        result,
        newBalance,
        username: user.username,
        angle
      });
    } catch (error) {
      console.error('Error spinning wheel:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}