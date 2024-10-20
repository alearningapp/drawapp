import React, { useState } from 'react';

const ModeSwitchButton = () => {
  const modes = ['Track', 'Draw', 'Video', 'Game'];
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  const toggleMode = () => {
    setCurrentModeIndex((prevIndex) => (prevIndex + 1) % modes.length);
  };

  return (
    <div style={styles.container}>
      <button onClick={toggleMode} style={styles.button}>
        Switch to {modes[(currentModeIndex + 1) % modes.length]} Mode
      </button>
      <p style={styles.text}>Current Mode: {modes[currentModeIndex]}</p>
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
    padding: '20px', // Optional padding for better visibility
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional background
    borderRadius: '10px', // Optional border radius
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    transition: 'background-color 0.3s',
  },
  text: {
    marginTop: '10px',
    fontSize: '18px',
  },
};

export default ModeSwitchButton;
