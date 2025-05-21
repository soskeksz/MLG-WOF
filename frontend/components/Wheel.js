// components/Wheel.js
import React, { useMemo } from 'react';
import styles from '../styles/Wheel.module.css';

const Wheel = ({ rotation }) => {
  // Define segments once with useMemo to prevent recreating on each render
  const segments = useMemo(() => [
    { color: '#ff0000', rotate: 0, label: 'BANKRUPT' },
    { color: '#ff7f00', rotate: 60, label: 'LOSE' },
    { color: '#ffff00', rotate: 120, label: 'KEEP' },
    { color: '#00ff00', rotate: 180, label: 'TRIPLE' },
    { color: '#0000ff', rotate: 240, label: 'THOMAS' },
    { color: '#ff00ff', rotate: 300, label: 'JACKPOT' }
  ], []);

  return (
    <div className={styles.wheelContainer}>
      <div 
        className={styles.wheel} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {segments.map((segment, index) => (
          <div 
            key={index}
            className={styles.segment} 
            style={{ 
              backgroundColor: segment.color, 
              transform: `rotate(${segment.rotate}deg)` 
            }}
          >
            <span>{segment.label}</span>
          </div>
        ))}
      </div>
      <div className={styles.pointer}>▼</div>
    </div>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(Wheel);