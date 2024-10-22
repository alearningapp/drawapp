import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPaintBrush, faVideo, faGamepad } from '@fortawesome/free-solid-svg-icons';

const ModeSwitchButton = () => {
  const modes = [
    { icon: faMusic, name: 'Track' },
    { icon: faPaintBrush, name: 'Draw' },
    { icon: faVideo, name: 'Video' },
    { icon: faGamepad, name: 'Game' },
  ];

  return (
    <div style={styles.container}>
      {modes.map((mode, index) => (
        <button key={index} style={styles.button}>
          <div style={styles.iconContainer}>
            <FontAwesomeIcon icon={mode.icon} size="sm" />
            <span style={styles.label}>{mode.name}</span>
          </div>
        </button>
      ))}
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
    height: '60px', // Increased height to fit text below the icon
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#4CAF50',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2px 0',
    padding: '0',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginTop: '2px', // Space between icon and label
    fontSize: '10px',
    color: '#fff',
  },
};

export default ModeSwitchButton;
