import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

// Game logic function
function spinWheel() {
  const random = Math.random();
  
  if (random < 0.1) {
    return "DOUBLE";
  } else if (random < 0.7) {
    return "KEEP";
  } else {
    return "BANKRUPT";
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
      const result = spinWheel();
      let newBalance = user.money;
      
      // Process the result
      switch (result) {
        case "DOUBLE":
          newBalance += betAmount;
          break;
        case "KEEP":
          // Balance stays the same
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
        username: user.username
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