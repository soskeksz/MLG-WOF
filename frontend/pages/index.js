import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Add hitmarker effect
  const [showHitmarker, setShowHitmarker] = useState(false);
  const [hitmarkerPosition, setHitmarkerPosition] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);
  
  // Handle click on interactive elements only
  const handleInteractiveClick = (e) => {
    // Show hitmarker at click position
    setHitmarkerPosition({ x: e.clientX, y: e.clientY });
    setShowHitmarker(true);
    setImageError(false); // Reset image error state
    
    // Play hitmarker sound if available
    const audio = new Audio('/sounds/hitmarker.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio errors silently
    });
    
    // Hide hitmarker after 100ms
    setTimeout(() => setShowHitmarker(false), 100);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!username.trim()) {
      setError('Please enter a username');
      setIsLoading(false);
      return;
    }
    
    try {
      // Send request to create/retrieve user
      await axios.post('/api/users', { username });
      
      // Redirect to game page
      router.push(`/game?username=${encodeURIComponent(username)}`);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>MLG Wheel of Fortune</title>
        <meta name="description" content="MLG Wheel of Fortune Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Hitmarker - Image with CSS fallback */}
      {showHitmarker && (
        <div
          style={{
            position: 'fixed',
            left: `${hitmarkerPosition.x - 15}px`,
            top: `${hitmarkerPosition.y - 15}px`,
            zIndex: 1000,
            width: '30px',
            height: '30px',
            pointerEvents: 'none'
          }}
        >
          {!imageError ? (
            <img
              src="/images/hitmarker.png"
              alt="Hitmarker"
              width="30"
              height="30"
              onError={() => setImageError(true)}
              style={{
                filter: 'drop-shadow(0 0 5px #00ff00)',
                mixBlendMode: 'screen', // Removes dark/black backgrounds
                backgroundColor: 'transparent' // Ensures transparency
              }}
            />
          ) : (
            // CSS Fallback - X shape
            <>
              <div style={{
                position: 'absolute',
                width: '30px',
                height: '2px',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%) rotate(45deg)',
                backgroundColor: 'white',
                boxShadow: '0 0 5px #00ff00'
              }}></div>
              <div style={{
                position: 'absolute',
                width: '30px',
                height: '2px',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%) rotate(-45deg)',
                backgroundColor: 'white',
                boxShadow: '0 0 5px #00ff00'
              }}></div>
            </>
          )}
        </div>
      )}
      
      <main className={styles.main}>
        <h1 className={styles.title}>MLG WHEEL OF FORTUNE</h1>
        
        <div className={styles.card}>
          <h2>Enter Your Username</h2>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              className={styles.input}
              onClick={handleInteractiveClick}
            />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className={styles.button}
              onClick={handleInteractiveClick}
            >
              {isLoading ? 'Loading...' : 'START GAME'}
            </button>
          </form>
          
          <p className={styles.info}>
            If username exists, you\'ll continue from where they left off.
            <br />
            New users start with $1,000.
          </p>
        </div>
      </main>
    </div>
  );
}