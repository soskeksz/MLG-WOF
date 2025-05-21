// components/Wheel.js 
import React from 'react';
import styles from '../styles/Wheel.module.css';

const Wheel = ({ rotation }) => {
  return (
    <div className={styles.wheelContainer}>
      <div 
        className={styles.wheel} 
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Each segment is exactly 60 degrees */}
        <div className={styles.segment} style={{ backgroundColor: '#ff0000', transform: 'rotate(0deg)' }}>
          <span>BANKRUPT</span>
        </div>
        <div className={styles.segment} style={{ backgroundColor: '#ff7f00', transform: 'rotate(60deg)' }}>
          <span>LOSE</span>
        </div>
        <div className={styles.segment} style={{ backgroundColor: '#ffff00', transform: 'rotate(120deg)' }}>
          <span>KEEP</span>
        </div>
        <div className={styles.segment} style={{ backgroundColor: '#00ff00', transform: 'rotate(180deg)' }}>
          <span>TRIPLE</span>
        </div>
        <div className={styles.segment} style={{ backgroundColor: '#0000ff', transform: 'rotate(240deg)' }}>
          <span>THOMAS</span>
        </div>
        <div className={styles.segment} style={{ backgroundColor: '#ff00ff', transform: 'rotate(300deg)' }}>
          <span>JACKPOT</span>
        </div>
      </div>
      <div className={styles.pointer}>▼</div>
    </div>
  );
};

export default Wheel;