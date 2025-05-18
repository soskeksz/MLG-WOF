import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  
  // Handle POST request (create/retrieve user)
  if (req.method === 'POST') {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    try {
      // Check if user exists
      let user = await User.findOne({ username });
      
      // If not, create a new user
      if (!user) {
        user = await User.create({ 
          username,
          money: 1000
        });
      } else {
        // Update last played time
        user.lastPlayed = new Date();
        await user.save();
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error creating/retrieving user:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Handle GET request (get all users for leaderboard)
  else if (req.method === 'GET') {
    try {
      const users = await User.find().sort({ money: -1 }).limit(20);
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}