// components/MemorySafeWheel.js
import React from 'react';
import styles from '../styles/Game.module.css';

const Wheel = ({ rotation }) => {
  return (
    <div className={styles.wheelContainer}>
      <svg 
        viewBox="0 0 200 200" 
        className={styles.wheel}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Outer circle */}
        <circle cx="100" cy="100" r="98" fill="none" stroke="white" strokeWidth="4" />
        
        {/* BANKRUPT - 5% - 0° to 18° - Red */}
        <path 
          d="M100,100 L100,2 A98,98 0 0,1 129.4,9.3 z" 
          fill="#ff0000" 
        />
        <text x="112" y="20" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">BANKRUPT</text>
        
        {/* LOSE - 30% - 18° to 126° - Orange */}
        <path 
          d="M100,100 L129.4,9.3 A98,98 0 0,1 165.3,129.4 z" 
          fill="#ff7f00" 
        />
        <text x="135" y="60" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">LOSE</text>
        
        {/* KEEP - 30% - 126° to 234° - Yellow */}
        <path 
          d="M100,100 L165.3,129.4 A98,98 0 0,1 34.7,129.4 z" 
          fill="#ffff00" 
        />
        <text x="100" y="160" fill="black" fontSize="8" fontWeight="bold" textAnchor="middle">KEEP</text>
        
        {/* TRIPLE - 20% - 234° to 306° - Green */}
        <path 
          d="M100,100 L34.7,129.4 A98,98 0 0,1 29.3,56.1 z" 
          fill="#00ff00" 
        />
        <text x="50" y="100" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">TRIPLE</text>
        
        {/* THOMAS - 10% - 306° to 342° - Blue */}
        <path 
          d="M100,100 L29.3,56.1 A98,98 0 0,1 47.6,17.1 z" 
          fill="#0000ff" 
        />
        <text x="60" y="40" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">THOMAS</text>
        
        {/* JACKPOT - 5% - 342° to 360° - Pink */}
        <path 
          d="M100,100 L47.6,17.1 A98,98 0 0,1 100,2 z" 
          fill="#ff00ff" 
        />
        <text x="85" y="15" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">JACKPOT</text>
      </svg>
      <div className={styles.wheelPointer}>▼</div>
    </div>
  );
};

export default MemorySafeWheel;