import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Game.module.css';
import Wheel from '../components/Wheel'; // Using our new wheel
import { soundManager } from '@/lib/soundManager';

export default function Game() {
  const router = useRouter();
  const { username } = router.query;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  // New state to track previous rotation
  const [previousRotation, setPreviousRotation] = useState(0);
  
  // MLG effect states
  const [showHitmarker, setShowHitmarker] = useState(false);
  const [showRainbow, setShowRainbow] = useState(false);
  const [showWasted, setShowWasted] = useState(false);
  const [hitmarkerPosition, setHitmarkerPosition] = useState({ x: 0, y: 0 });
  const [showThomas, setShowThomas] = useState(false);
  const [mlgElements, setMlgElements] = useState([]);
  
  // Load user data
  useEffect(() => {
    if (!username) return;
    
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/users/${username}`);
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [username]);
  
  // Cleanup MLG elements with useEffect
  useEffect(() => {
    if (mlgElements.length === 0) return;
    
    const timers = mlgElements.map(element => 
      setTimeout(() => {
        setMlgElements(prev => prev.filter(el => el.id !== element.id));
      }, 3000)
    );
    
    // Cleanup function
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [mlgElements]);
  
  // Rainbow effect cleanup
  useEffect(() => {
    if (!showRainbow) return;
    
    const timer = setTimeout(() => {
      setShowRainbow(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showRainbow]);
  
  // Thomas effect cleanup
  useEffect(() => {
    if (!showThomas) return;
    
    const timer = setTimeout(() => {
      setShowThomas(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [showThomas]);
  
  // Wasted effect cleanup
  useEffect(() => {
    if (!showWasted) return;
    
    const timer = setTimeout(() => {
      setShowWasted(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showWasted]);
  
  // Hitmarker cleanup
  useEffect(() => {
    if (!showHitmarker) return;
    
    const timer = setTimeout(() => {
      setShowHitmarker(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [showHitmarker]);
  
  // Sound playing function
const playSound = useCallback((soundName) => {
  try {
    // Use soundManager instead of creating new Audio objects each time
    soundManager.play(soundName);
  } catch (error) {
    // Ignore audio errors
    console.log(`Error playing ${soundName}:`, error);
  }
}, []);
  
  // Create floating MLG elements with proper cleanup
  const createMlgElement = useCallback((imageName) => {
    const id = Date.now() + Math.random();
    const element = {
      id,
      image: imageName,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
    };
    
    setMlgElements(prev => [...prev, element]);
  }, []);
  
  // Handle click for hitmarker
  const handleClick = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
      setHitmarkerPosition({ x: e.clientX, y: e.clientY });
      setShowHitmarker(true);
      playSound('hitmarker');
    }
  }, [playSound]);
  
  // Function to spin the wheel - IMPROVED WITH MULTIPLE SPINS
  const spinWheel = async () => {
    if (spinning || !user) return;
    
    setSpinning(true);
    setResult(null);
    setShowResult(false);
    setShowRainbow(false);
    setShowWasted(false);
    setShowThomas(false);
    
    // Clear any existing MLG elements
    setMlgElements([]);
    
    try {
      // Send spin request to API
      const res = await axios.post('/api/game/spin', {
        username,
        betAmount
      });
      
      console.log("Result:", res.data.result);
      console.log("Segment degree:", res.data.segmentDegree);
      
      // IMPROVED ROTATION: Ensure wheel always spins significantly
      // Base angle to get the winning segment to the top
      const baseAngle = 360 - res.data.segmentDegree;
      
      // Calculate current full rotations
      const currentFullRotations = Math.floor(wheelRotation / 360) * 360;
      
      // Minimum spins (at least 5 full rotations)
      const minSpins = 5;
      
      // Calculate extra spins - add randomness (between 5-7 full rotations)
      const extraSpins = minSpins * 360 + (Math.floor(Math.random() * 2) * 360);
      
      // Calculate final target rotation
      const targetRotation = currentFullRotations + extraSpins + baseAngle;
      
      console.log("Previous rotation:", previousRotation);
      console.log("Target rotation:", targetRotation);
      
      // Update wheel rotation
      setWheelRotation(targetRotation);
      
      // Save this rotation for next time
      setPreviousRotation(targetRotation);
      
      // Wait for wheel animation to finish
      setTimeout(() => {
        setResult(res.data.result);
        setUser({ ...user, money: res.data.newBalance });
        setShowResult(true);
        
        // Handle different results with MLG effects
        switch(res.data.result) {
          case "JACKPOT":
            console.log("jackpot");
            playSound('airhorn');
            setShowRainbow(true);
            setShowThomas(true);
            setTimeout(() => createMlgElement('doritos'), 100);
            setTimeout(() => createMlgElement('dew'), 300);
            setTimeout(() => createMlgElement('doritos'), 500);
            setTimeout(() => playSound('ohmygod'), 700);
            break;
            
          case "TRIPLE":
            console.log("triple");
            playSound('airhorn');
            setShowRainbow(true);
            setTimeout(() => createMlgElement('doritos'), 100);
            setTimeout(() => playSound('applause'), 300);
            break;
            
          case "THOMAS":
            console.log("thomas");
            playSound('thomas');
            setShowThomas(true);
            setShowRainbow(true);
            setTimeout(() => createMlgElement('dew'), 500);
            break;
            
          case "KEEP":
            console.log("keep");
            playSound('applause');
            createMlgElement('dew');
            break;
            
          case "LOSE":
            console.log("lose");
            playSound('intervention');
            createMlgElement('dew');
            break;
            
          case "BANKRUPT":
            console.log("bankrupt");
            playSound('wasted');
            setShowWasted(true);
            setTimeout(() => playSound('damnson'), 1000);
            break;
        }
        setSpinning(false);
      }, 3000);
    } catch (error) {
      console.error('Error spinning wheel:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Failed to spin wheel: ' + (error.response?.data?.message || error.message));
      setSpinning(false);
    }
  };
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }
  
  return (
    <div 
      className={`${styles.container} ${showRainbow ? styles.rainbowBackground : ''}`}
      onClick={handleClick}
    >
      <Head>
        <title>MLG Wheel of Fortune - Game</title>
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
          <img
            src="/images/hitmarker.png"
            alt="Hitmarker"
            width="30"
            height="30"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
            style={{
              filter: 'drop-shadow(0 0 5px #00ff00)',
              mixBlendMode: 'screen',
              backgroundColor: 'transparent'
            }}
          />
          <div style={{
            display: 'none',
            position: 'relative',
            width: '30px',
            height: '30px'
          }}>
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
          </div>
        </div>
      )}
      
      {/* Thomas the Tank Engine effect */}
      {showThomas && (
        <div className={styles.thomasEffect}>
          <img src="/images/thomas.png" alt="Thomas" width="200" height="150" />
        </div>
      )}
      
      {/* Floating MLG elements */}
      {mlgElements.map(element => (
        <div
          key={element.id}
          className={styles.mlgElement}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
          }}
        >
          <img 
            src={`/images/${element.image}.png`} 
            alt="MLG Element" 
            width="80" 
            height="80"
            className={element.image === 'doritos' ? styles.doritosRotate : ''}
          />
        </div>
      ))}
      
      {/* Wasted overlay */}
      {showWasted && (
        <div className={styles.wastedOverlay}>
          <div className={styles.wastedText}>WASTED</div>
        </div>
      )}
      
      <main className={styles.main}>
        <h1 className={styles.title}>MLG WHEEL OF FORTUNE</h1>
        
        <div className={styles.userInfo}>
          <h2>Player: {username}</h2>
          <h2>Money: ${user.money}</h2>
        </div>
        
        <div className={styles.gameContainer}>
          <div className={styles.bettingForm}>
            <h3>Place Your Bet</h3>
            <input
              type="number"
              min="1"
              max={user.money}
              value={betAmount}
              onChange={(e) => setBetAmount(Math.min(Math.max(1, parseInt(e.target.value) || 0), user.money))}
              disabled={spinning}
              className={styles.betInput}
            />
            
            <button 
              onClick={spinWheel} 
              disabled={spinning || user.money <= 0}
              className={styles.spinButton}
            >
              {spinning ? 'SPINNING...' : 'SPIN THE WHEEL'}
            </button>
          </div>
          

          <Wheel rotation={wheelRotation} />
        </div>
        
        {showResult && (
          <div className={`${styles.result} ${styles[result.toLowerCase()]}`}>
            <h2>{result}</h2>
            {/* Debug info to verify alignment */}
            <div style={{fontSize: '0.8rem', color: 'yellow'}}>
              Backend segment: {result}
            </div>
          </div>
        )}
        
        <div className={styles.navigation}>
          <Link href="/leaderboard" className={styles.leaderboardButton}>
            LEADERBOARD
          </Link>
          <Link href="/" className={styles.homeButton}>
            HOME
          </Link>
        </div>
      </main>
    </div>
  );
}