// lib/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: 50
  },
  money: {
    type: Number,
    default: 1000,
    min: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  lastPlayed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create indexes for efficient leaderboard queries
UserSchema.index({ money: -1 }); // Descending order for leaderboard
UserSchema.index({ lastPlayed: -1 }); // For recent activity queries

export default mongoose.models.User || mongoose.model('User', UserSchema);