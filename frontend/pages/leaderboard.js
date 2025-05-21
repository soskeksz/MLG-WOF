// pages/leaderboard.js
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from '../styles/Leaderboard.module.css';
import { useRouter } from 'next/router';

export default function Leaderboard() {
  // State management
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchUsername, setSearchUsername] = useState('');
  const [userRank, setUserRank] = useState(null);
  const [leaderboardStats, setLeaderboardStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();
  const { username } = router.query;


  // MLG effects state
  const [showMLGEffect, setShowMLGEffect] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  // Fetch leaderboard statistics
  const fetchLeaderboardStats = useCallback(async () => {
    try {
      const response = await fetch('/api/leaderboard/stats');
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboardStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard stats:', error);
    }
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (page = 1, username = '') => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (username) {
        queryParams.append('username', username);
      }

      const response = await fetch(`/api/leaderboard?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch leaderboard');
      }

      setLeaderboard(data.leaderboard);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setUserRank(data.userRank);

    } catch (err) {
      setError(err.message);
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search for specific user
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      fetchLeaderboard(1, searchUsername.trim());
    } else {
      fetchLeaderboard(1);
    }
  }, [searchUsername, fetchLeaderboard]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    fetchLeaderboard(newPage, searchUsername);
  }, [fetchLeaderboard, searchUsername]);

  // MLG effect on rank click
  const triggerMLGEffect = useCallback((rank) => {
    // Play sound effect
    try {
      const audio = new Audio('/sounds/hitmarker.wav');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio failed:', e));
    } catch (e) {
      console.log('Audio not available');
    }

    // Show visual effect
    setShowMLGEffect(true);
    
    // Add floating elements for top 3 ranks
    if (rank <= 3) {
      const newElements = [];
      for (let i = 0; i < 3; i++) {
        newElements.push({
          id: Date.now() + i,
          type: Math.random() > 0.5 ? 'dorito' : 'mtdew',
          x: Math.random() * 80 + 10, // 10-90% from left
          y: Math.random() * 80 + 10, // 10-90% from top
        });
      }
      setFloatingElements(prev => [...prev, ...newElements]);
    }
  }, []);

  // Cleanup MLG effects
  useEffect(() => {
    if (!showMLGEffect) return;
    
    const timer = setTimeout(() => {
      setShowMLGEffect(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [showMLGEffect]);

  useEffect(() => {
    if (floatingElements.length === 0) return;
    
    const timers = floatingElements.map(element => 
      setTimeout(() => {
        setFloatingElements(prev => prev.filter(el => el.id !== element.id));
      }, 3000)
    );
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [floatingElements]);

  // Initial data fetch
  useEffect(() => {
    fetchLeaderboard();
    fetchLeaderboardStats();
  }, [fetchLeaderboard, fetchLeaderboardStats]);

  // Format money display
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get medal for top 3
  const getMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* MLG Effects */}
      {showMLGEffect && <div className={styles.hitmarker}></div>}
      {floatingElements.map(element => (
        <div
          key={element.id}
          className={`${styles.floatingElement} ${styles[element.type]}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
        />
      ))}

      <div className={styles.header}>
        <h1 className={styles.title}>🏆 LEADERBOARD 🏆</h1>
        <p className={styles.subtitle}>MLG WHEEL OF FORTUNE CHAMPIONS</p>
      </div>

      {/* Statistics Toggle */}
      <div className={styles.statsToggle}>
        <button 
          onClick={() => setShowStats(!showStats)}
          className={styles.statsButton}
        >
          📊 {showStats ? 'HIDE STATS' : 'SHOW STATS'}
        </button>
      </div>

      {/* Statistics Display */}
      {showStats && leaderboardStats && (
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>👥 Total Players</h3>
              <p>{leaderboardStats.stats.totalPlayers || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>💰 Total Prize Pool</h3>
              <p>{formatMoney(leaderboardStats.stats.totalMoney || 0)}</p>
            </div>
            <div className={styles.statCard}>
              <h3>📊 Average Money</h3>
              <p>{formatMoney(leaderboardStats.stats.averageMoney || 0)}</p>
            </div>
            <div className={styles.statCard}>
              <h3>🎮 Total Games</h3>
              <p>{leaderboardStats.stats.totalGamesPlayed || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>🔥 Active Players</h3>
              <p>{leaderboardStats.stats.activePlayers || 0}</p>
            </div>
            <div className={styles.statCard}>
              <h3>👑 Richest Player</h3>
              <p>{formatMoney(leaderboardStats.stats.maxMoney || 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Search for a player..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          🔍 SEARCH
        </button>
        {searchUsername && (
          <button
            type="button"
            onClick={() => {
              setSearchUsername('');
              fetchLeaderboard(1);
            }}
            className={styles.clearButton}
          >
            ❌ CLEAR
          </button>
        )}
      </form>

      {/* User Rank Display */}
      {userRank && (
        <div className={styles.userRank}>
          <p>
            <strong>{userRank.username}</strong> is ranked #{userRank.rank + " "} 
            with {formatMoney(userRank.money)}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          ❌ Error: {error}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className={styles.tableContainer}>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Medal</th>
              <th>Username</th>
              <th>Money</th>
              <th>Games</th>
              <th>Last Played</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr 
                key={user._id} 
                className={styles.playerRow}
                onClick={() => triggerMLGEffect(user.rank)}
              >
                <td className={styles.rank}>#{user.rank}</td>
                <td className={styles.medal}>{getMedal(user.rank)}</td>
                <td className={styles.username}>
                  {user.username}
                  {user.rank === 1 && <span className={styles.crown}>👑</span>}
                </td>
                <td className={styles.money}>{formatMoney(user.money)}</td>
                <td className={styles.games}>{user.gamesPlayed}</td>
                <td className={styles.lastPlayed}>
                  {new Date(user.lastPlayed).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            ⏮️ Previous
          </button>
          
          <span className={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next ⏭️
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.navigation}>
        <Link 
          href={username ? `/game?username=${encodeURIComponent(username)}` : '/'} 
          className={styles.navButton}
        >
          {username ? '🎰 BACK TO GAME' : '🏠 HOME'}
        </Link>
        <Link href="/" className={styles.navButton}>
          🏠 HOME
        </Link>
      </div>
    </div>
  );
}