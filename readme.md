# 🎰 MLG Wheel of Fortune

> A meme-powered, full-stack wheel of fortune game with explosive MLG effects, persistent leaderboards, and 360-noscope sound design.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)
[![MLG](https://img.shields.io/badge/MLG-💯-gold)](https://en.wikipedia.org/wiki/Major_League_Gaming)

## 🚀 Live Demo

**Production**: [Deployed on Vercel](your-vercel-url)  
**Local Development**: http://localhost:3000

---

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [🐳 Docker Development](#-docker-development)
- [📡 API Documentation](#-api-documentation)
- [🗄️ Database Schema](#️-database-schema)
- [🎮 MLG Features](#-mlg-features)
- [📁 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [🚢 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [⚡ Performance](#-performance)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📈 Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

MLG Wheel of Fortune is a full-stack web application that combines the classic wheel of fortune concept with modern meme culture. Built with Next.js and MongoDB, it features explosive visual effects, sound design, and a competitive leaderboard system.

### 🎪 Game Flow
1. **Username Entry** → Players enter a username (no authentication required)
2. **Game Screen** → Place bets and spin the wheel with 6 possible outcomes
3. **Leaderboard** → View rankings and statistics

### 🎯 Learning Objectives
This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- Database modeling and optimization
- Real-time user interactions
- Docker containerization
- Modern React patterns and hooks
- CSS animations and effects
- Error handling and user experience

---

## ✨ Features

### 🎮 Core Gameplay
- **Username-based sessions** - No authentication, pick any username
- **Betting system** - Bet any amount up to your current money
- **Six wheel outcomes**: BANKRUPT (5%), LOSE (30%), KEEP (30%), TRIPLE (20%), THOMAS (10%), JACKPOT (5%)
- **Persistent player data** - Money and game history saved between sessions
- **Real-time leaderboard** - Top 20 players with live ranking updates

### 🔥 MLG Effects & Sound Design
- **Hitmarker effects** - Visual feedback on interactive elements
- **Sound library** - 10+ MLG-themed sound effects (airhorn, hitmarker, etc.)
- **Dynamic animations** - Rainbow backgrounds, floating Doritos, Mountain Dew
- **Themed outcomes** - Thomas the Tank Engine on special wins
- **Memory-optimized effects** - Proper cleanup prevents memory leaks

### 📊 Data & Analytics
- **Comprehensive statistics** - Total players, money distribution, activity metrics
- **Advanced search** - Find specific players and their rankings
- **Pagination** - Efficient browsing of large leaderboards
- **User context** - See players ranked around a specific user

### 🛠️ Technical Features
- **Responsive design** - Works on desktop, tablet, and mobile
- **Error boundaries** - Graceful error handling and fallbacks
- **Performance optimization** - Lazy loading, memoization, efficient queries
- **Development tools** - Memory monitoring, logging, debugging utilities

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.2** - React framework with API routes
- **React 19** - Component library with hooks
- **CSS Modules** - Scoped styling system
- **Axios** - HTTP client for API requests

### Backend
- **Next.js API Routes** - Serverless backend functions
- **MongoDB 6.0** - NoSQL database
- **Mongoose** - ODM for MongoDB with schema validation

### DevOps & Deployment
- **Docker & Docker Compose** - Containerization for local development
- **Vercel** - Production deployment platform
- **MongoDB Atlas** - Cloud database hosting

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git** - Version control
- **VS Code** - Recommended IDE

---

## 🏗️ Architecture

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   Next.js App   │    │   MongoDB       │
│                 │    │                 │    │                 │
│  React Frontend │◄──►│  API Routes     │◄──►│  User Data      │
│  CSS Modules    │    │  Server Logic   │    │  Game State     │
│  MLG Effects    │    │  Database Conn  │    │  Leaderboards   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Interaction** → Frontend sends API request
2. **API Processing** → Next.js API route handles business logic
3. **Database Operation** → MongoDB query/update via Mongoose
4. **Response** → JSON data returned to frontend
5. **UI Update** → React state updates trigger re-render

### File Structure Philosophy
- **Pages** - Route-based organization following Next.js conventions
- **Components** - Reusable UI components with single responsibilities
- **API Routes** - RESTful endpoints organized by resource
- **Lib** - Shared utilities, database connections, models
- **Styles** - CSS Modules for component-specific styling

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB (local or Atlas)
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/mlg-wheel-of-fortune.git
cd mlg-wheel-of-fortune

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB connection string

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/wheel_of_fortune
NODE_ENV=development
```

---

## 🐳 Docker Development

For a complete containerized development environment:

### Quick Start
```bash
# Build and start all services
COMPOSE_HTTP_TIMEOUT=120 docker-compose up --build -d

# Set up database user (required first time)
docker-compose exec mongodb mongosh -u admin -p password123
```

In MongoDB shell:
```javascript
use wheel_of_fortune
db.createUser({
  user: 'wheeluser',
  pwd: 'wheelpass',
  roles: [{ role: 'readWrite', db: 'wheel_of_fortune' }]
})
db.createCollection('users')
db.users.insertOne({
  username: 'MLGTestUser',
  money: 5000,
  gamesPlayed: 10,
  lastPlayed: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
exit
```

```bash
# Restart the app
docker-compose restart app

# Visit http://localhost:3000
```

### Docker Services
- **app** (port 3000) - Next.js application with hot reload
- **mongodb** (port 27017) - MongoDB database with persistent volume
- **mongo-express** (port 8081) - Optional database admin interface

### Docker Commands
```bash
# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Reset database
docker-compose down --volumes
docker-compose up --build -d
```

---

## 📡 API Documentation

### Base URL
- **Development**: http://localhost:3000/api
- **Production**: https://your-app.vercel.app/api

### Endpoints

#### Users
```http
POST /api/users
Content-Type: application/json

{
  "username": "string"
}
```
**Response**: User object (creates if new, returns if exists)

```http
GET /api/users/[username]
```
**Response**: Specific user data

#### Game
```http
POST /api/game/spin
Content-Type: application/json

{
  "username": "string",
  "betAmount": number
}
```
**Response**: Spin result with new balance

#### Leaderboard
```http
GET /api/leaderboard?page=1&limit=20&username=string
```
**Response**: Paginated leaderboard with user rank

```http
GET /api/leaderboard/stats
```
**Response**: Game-wide statistics

```http
GET /api/leaderboard/[username]
```
**Response**: User details with ranking context

### Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

### Rate Limiting
- No rate limiting in development
- Production implements reasonable limits per IP

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
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
  },
  createdAt: Date,    // Auto-generated
  updatedAt: Date     // Auto-generated
}
```

### Indexes
```javascript
// Performance optimization indexes
{ money: -1 }        // Leaderboard queries
{ lastPlayed: -1 }   // Recent activity queries
{ username: 1 }      // Unique constraint + searches
```

### Aggregation Pipelines
The app uses MongoDB aggregation for efficient ranking:
```javascript
// Leaderboard with rankings
[
  { $sort: { money: -1, username: 1 } },
  { $group: { _id: null, users: { $push: "$$ROOT" } } },
  { $unwind: { path: "$users", includeArrayIndex: "rank" } },
  { $addFields: { "users.rank": { $add: ["$rank", 1] } } },
  { $replaceRoot: { newRoot: "$users" } }
]
```

---

## 🎮 MLG Features

### Sound System
```javascript
// Preloaded sound effects with fallback handling
const soundPaths = {
  hitmarker: '/sounds/hitmarker.mp3',
  airhorn: '/sounds/airhorn.mp3',
  wasted: '/sounds/wasted.mp3',
  thomas: '/sounds/thomas.mp3',
  // ... 6 more sounds
}
```

### Visual Effects
- **Hitmarker**: CSS animation with image fallback
- **Rainbow Background**: CSS keyframe animation
- **Floating Elements**: Dynamic DOM manipulation with cleanup
- **Thomas Effect**: Large overlay image animation
- **Wasted Screen**: GTA-style game over effect

### Memory Management
```javascript
// Proper cleanup prevents memory leaks
useEffect(() => {
  if (mlgElements.length === 0) return;
  
  const timers = mlgElements.map(element => 
    setTimeout(() => {
      setMlgElements(prev => prev.filter(el => el.id !== element.id));
    }, 3000)
  );
  
  return () => {
    timers.forEach(timer => clearTimeout(timer));
  };
}, [mlgElements]);
```

### Performance Optimizations
- **useCallback** for expensive operations
- **React.memo** for component optimization
- **Element limiting** (max 10 floating elements)
- **Efficient state updates** with functional updates

---

## 📁 Project Structure

```
wheel-of-fortune/
├── 📁 components/
│   ├── MemoryMonitor.js     # Dev tool for memory tracking
│   └── Wheel.js             # Spinning wheel component
├── 📁 docker/
│   └── init-mongo.js        # MongoDB initialization script
├── 📁 lib/
│   ├── mongodb.js           # Database connection
│   ├── soundManager.js      # Audio management
│   └── 📁 models/
│       └── User.js          # User schema
├── 📁 pages/
│   ├── index.js             # Username entry screen
│   ├── game.js              # Main game screen
│   ├── leaderboard.js       # Leaderboard display
│   └── 📁 api/
│       ├── 📁 users/
│       │   ├── index.js     # User CRUD operations
│       │   └── [username].js # Get specific user
│       ├── 📁 game/
│       │   └── spin.js      # Wheel spinning logic
│       └── 📁 leaderboard/
│           ├── index.js     # Main leaderboard
│           ├── stats.js     # Statistics
│           ├── [username].js # User details
│           └── reset.js     # Dev utility
├── 📁 public/
│   ├── 📁 sounds/           # MLG sound effects
│   └── 📁 images/           # MLG images and assets
├── 📁 styles/
│   ├── globals.css          # Global styles
│   ├── Home.module.css      # Homepage styles
│   ├── Game.module.css      # Game screen styles
│   ├── Leaderboard.module.css # Leaderboard styles
│   └── Wheel.module.css     # Wheel component styles
├── docker-compose.yml       # Local development services
├── Dockerfile              # Next.js container definition
├── package.json            # Dependencies and scripts
├── jsconfig.json           # JavaScript project config
├── next.config.js          # Next.js configuration
└── README.md               # This file
```

---

## 🔧 Development

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run dev:clean        # Clean .next and start dev
npm run dev:mem          # Start with increased memory

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting
```

### Development Workflow
1. **Feature Branches** - Create feature branches from main
2. **Code Quality** - Run linting and formatting before commits
3. **Testing** - Manual testing on key user flows
4. **Documentation** - Update README for new features
5. **Deployment** - Merge to main triggers Vercel deployment

### Key Development Patterns
```javascript
// Custom hooks for state management
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

// Error boundaries for graceful failures
try {
  const response = await api.call();
  setData(response.data);
} catch (error) {
  setError('User-friendly error message');
}

// Memory-conscious effect cleanup
useEffect(() => {
  const timer = setTimeout(() => {}, 1000);
  return () => clearTimeout(timer);
}, []);
```

### Environment-Specific Configuration
```javascript
// next.config.js optimizations
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 2,
  },
  // Memory and performance optimizations
}
```

---

## 🚢 Deployment

### Production Environment
- **Platform**: Vercel (recommended)
- **Database**: MongoDB Atlas
- **Domain**: Custom domain supported
- **CDN**: Automatic via Vercel Edge Network


## 🧪 Testing

### Manual Testing Checklist
- [ ] Username creation and persistence
- [ ] Bet validation (min/max amounts)
- [ ] Wheel spinning and outcome distribution
- [ ] Money calculations for each outcome
- [ ] Leaderboard ranking accuracy
- [ ] Search functionality
- [ ] Pagination behavior
- [ ] Mobile responsiveness
- [ ] Sound effects and visual effects
- [ ] Error handling (invalid inputs, network failures)

### Performance Testing
```javascript
// Memory monitoring component (dev only)
const MemoryMonitor = () => {
  const [memory, setMemory] = useState(null);
  // Real-time memory usage display
}
```

### Database Testing
```bash
# Test MongoDB queries
docker-compose exec mongodb mongosh -u wheeluser -p wheelpass wheel_of_fortune

# Performance testing
db.users.explain("executionStats").find().sort({money: -1})
```

### Load Testing Scenarios
- Multiple users spinning simultaneously
- Rapid leaderboard updates
- Large datasets (1000+ users)
- Memory leak detection (long sessions)

---

## ⚡ Performance

### Frontend Optimizations
- **React.memo** for expensive components
- **useCallback** for event handlers
- **Lazy loading** for non-critical components
- **CSS Modules** for scoped styling without runtime overhead

### Backend Optimizations
- **MongoDB Indexes** for fast queries
- **Aggregation Pipelines** for complex operations
- **Connection Pooling** via Mongoose
- **Query Pagination** to limit data transfer

### Memory Management
```javascript
// Floating elements with cleanup
const createMlgElement = useCallback((imageName) => {
  setMlgElements(prev => {
    const newElement = { id: Date.now(), image: imageName };
    // Limit to max 10 elements
    return prev.length >= 10 ? [...prev.slice(1), newElement] : [...prev, newElement];
  });
}, []);
```

### Bundle Size Optimization
- **Tree Shaking** eliminates unused code
- **Dynamic Imports** for large libraries
- **Image Optimization** with Next.js Image component
- **CSS Purging** removes unused styles

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```bash
# Symptoms: 500 errors on user creation
# Solution: Check connection string and database user

# Verify MongoDB is running
docker-compose ps mongodb

# Test connection
docker-compose exec mongodb mongosh -u wheeluser -p wheelpass wheel_of_fortune
```

#### 2. Sound Effects Not Playing
```bash
# Symptoms: Silent gameplay
# Solution: Browser audio policy requires user interaction

# Check browser console for audio errors
# Ensure files exist in public/sounds/
# Test with user gesture (click)
```

#### 3. Memory Leaks
```bash
# Symptoms: Gradually increasing memory usage
# Solution: Check useEffect cleanup functions

# Monitor with MemoryMonitor component (dev mode)
# Look for uncleaned timeouts/intervals
# Verify floating elements are properly removed
```

#### 4. Leaderboard Not Updating
```bash
# Symptoms: Stale ranking data
# Solution: Database index or aggregation issue

# Check MongoDB indexes
db.users.getIndexes()

# Verify aggregation pipeline
db.users.aggregate([{$sort: {money: -1}}])
```

### Docker Issues
```bash
# Container won't start
docker-compose logs <service-name>

# Port conflicts
docker-compose down
sudo lsof -i :3000

# Database volume issues
docker-compose down --volumes
docker-compose up --build -d
```

### Performance Issues
```bash
# Slow queries
# Enable MongoDB query profiling
db.setProfilingLevel(2)
db.system.profile.find().sort({ts: -1}).limit(5)

# Memory spikes
# Monitor with dev tools
# Check for infinite loops in useEffect
# Verify cleanup functions
```

---

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper testing
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- **ESLint** configuration enforces consistent style
- **Prettier** for automatic formatting
- **Conventional Commits** for clear commit messages
- **Component Documentation** with JSDoc comments

### Pull Request Guidelines
- Describe the feature/fix clearly
- Include screenshots for UI changes
- Test on multiple devices/browsers
- Update documentation if needed
- Ensure no console errors

### Development Environment Setup
```bash
# Install dependencies
npm install

# Set up pre-commit hooks
npm run prepare

# Run in development mode
npm run dev
```

---

## 📈 Future Enhancements

### Planned Features
- [ ] **Real-time Multiplayer** - WebSocket integration for live games
- [ ] **Tournament Mode** - Scheduled competitions with prizes
- [ ] **Achievement System** - Unlock badges and special effects
- [ ] **Social Features** - Follow players, chat system
- [ ] **Advanced Analytics** - Player behavior insights
- [ ] **Mobile App** - React Native version
- [ ] **AI Opponents** - Bot players for single-player mode

### Technical Improvements
- [ ] **TypeScript Migration** - Type safety and better DX
- [ ] **Unit Testing** - Jest and React Testing Library
- [ ] **E2E Testing** - Cypress automated testing
- [ ] **Performance Monitoring** - Sentry integration
- [ ] **CDN Integration** - CloudFlare for global speed
- [ ] **Database Sharding** - Scale to millions of users
- [ ] **Microservices** - Split monolith into services

### MLG Enhancement Ideas
- [ ] **Custom Sound Packs** - User-uploadable sounds
- [ ] **Visual Themes** - Different MLG era themes
- [ ] **Meme Integration** - Dynamic meme generation
- [ ] **Livestream Integration** - Twitch/YouTube integration
- [ ] **Voice Chat** - In-game communication
- [ ] **Replay System** - Save and share epic moments

### Business Features
- [ ] **Analytics Dashboard** - Admin panel with insights
- [ ] **User Authentication** - OAuth integration
- [ ] **Premium Features** - Subscription model
- [ ] **Advertisement Integration** - Revenue generation
- [ ] **Internationalization** - Multi-language support
- [ ] **API Rate Limiting** - Production-grade security
- [ ] **Content Moderation** - Automated filtering

---

## 📄 License

This project is licensed under the MIT License

## 🙏 Acknowledgments

- **MLG Community** for the inspiration and meme culture
- **Next.js Team** for the amazing framework
- **MongoDB** for the flexible database solution
- **Vercel** for seamless deployment platform
- **Docker** for containerization simplicity

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Portfolio: [your-website.com](https://your-website.com)

---

**Built with 💯 and 🔥 for the MLG community**

*360 noscope your interview with this epic project* 🎯