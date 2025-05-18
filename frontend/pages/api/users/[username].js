import connectToDatabase from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export default async function handler(req, res) {
  await connectToDatabase();
  
  const { username } = req.query;
  
  // Handle GET request (get specific user)
  if (req.method === 'GET') {
    try {
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}