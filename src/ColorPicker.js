import React, { useState, useRef, useEffect } from 'react';
import CanvasSettings from './CanvasSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { getComplementaryColor } from './Util';

const ColorSelect = ({
  selectedColor,
  setSelectedColor,
  penWidth,
  setPenWidth,
  opacity,
  setOpacity,
  penType,
  setPenType,
}) => {
  const [isCanvasSettingsOpen, setIsCanvasSettingsOpen] = useState(false);
  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffffff', 
    '#800000', '#808000', '#008000', '#008080', 
    '#000080', '#800080', '#c0c0c0', '#808080', 
    '#f0e68c', '#add8e6', '#ffb6c1', '#ffa07a'
  ];
  const ref = useRef();
  const listRef = useRef(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsCanvasSettingsOpen(false);
    }
  };

  const handleCustomColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Scrolling logic
  useEffect(() => {
    let initialY = 0;
    let isScrolling = false;
    const list = listRef.current;

    const handleStart = (event) => {
      if (!list) return;
      initialY = event.touches ? event.touches[0].clientY : event.clientY; // For touch devices
      isScrolling = true;
    };
    
    const handleMove = (moveEvent) => {
      if (!isScrolling) return;
      const currentY = moveEvent.touches ? moveEvent.touches[0].clientY : moveEvent.clientY; // For touch devices
      const distance = currentY - initialY; // Calculate distance moved
      const scrollAmount = Math.max(-10, Math.min(10, distance)); // Limit scroll amount

      if (scrollAmount !== 0) {
        list.scrollBy(0, scrollAmount); // Scroll the list
        initialY = currentY; // Update the initial position for continuous scrolling
      }
    };

    const handleEnd = () => {
      isScrolling = false; // Stop scrolling
    };

    // Add event listeners for both mouse and touch events
    list.addEventListener('mousedown', handleStart);
    list.addEventListener('mousemove', handleMove);
    list.addEventListener('mouseup', handleEnd);
    list.addEventListener('touchstart', handleStart);
    list.addEventListener('touchmove', handleMove);
    list.addEventListener('touchend', handleEnd);

    return () => {
      list.removeEventListener('mousedown', handleStart);
      list.removeEventListener('mousemove', handleMove);
      list.removeEventListener('mouseup', handleEnd);
      list.removeEventListener('touchstart', handleStart);
      list.removeEventListener('touchmove', handleMove);
      list.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return (
    <>
      <div ref={ref} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, display: 'flex', zIndex: 1000 }}>
        {isCanvasSettingsOpen && (
          <CanvasSettings  
            penWidth={penWidth} 
            setPenWidth={setPenWidth} 
            opacity={opacity} 
            setOpacity={setOpacity} 
            penType={penType} 
            setPenType={setPenType} 
          />
        )}
        <div style={{ padding: '5px', display: 'flex', flexDirection: 'column' }}>
          <div
            onClick={() => setIsCanvasSettingsOpen(!isCanvasSettingsOpen)}
            role="button"
            aria-haspopup="true"
            aria-expanded={isCanvasSettingsOpen}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsCanvasSettingsOpen(!isCanvasSettingsOpen)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon style={{ color: selectedColor, height: '20px', backgroundColor: getComplementaryColor(selectedColor) }} icon={faPen} />
          </div>

          <div ref={listRef} style={{ flexGrow: '1', overflow: 'hidden' }}>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}>
              {colors.map(color => (
                <li
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  style={{
                    backgroundColor: color,
                    padding: '10px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    border: selectedColor === color ? `2px solid ${color}` : 'none',
                    boxShadow: selectedColor === color ? `0 0 5px ${color}` : 'none',
                    transition: 'transform 0.1s',
                  }}
                />
              ))}
              <li style={{ padding: '0', margin: '2px 0' }}>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleCustomColorChange}
                  style={{
                    width: '100%',
                    height: '30px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    padding: '0',
                  }}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorSelect;
