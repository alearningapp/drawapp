import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPaintBrush, faVideo, faGamepad } from '@fortawesome/free-solid-svg-icons';

const ModeSwitchButton = () => {
  const modes = [
    { icon: faMusic, name: 'Track' },
    { icon: faPaintBrush, name: 'Draw' },
    { icon: faVideo, name: 'Video' },
    { icon: faGamepad, name: 'Game' },
  ];
  
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  const toggleMode = () => {
    setCurrentModeIndex((prevIndex) => (prevIndex + 1) % modes.length);
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleMode} style={styles.button}>
        <FontAwesomeIcon icon={modes[currentModeIndex].icon} size="lg" />
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  button: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default ModeSwitchButton;
