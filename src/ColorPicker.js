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
  const [scrollPosition, setScrollPosition] = useState(0);
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



  // Styles for the scrollbar indicator
  const scrollbarStyle = {
    position: 'absolute',
    right: '3px',
    top: `${scrollPosition}%`,
    width: '5px',
    height: '30px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '5px',
    transition: 'top 0.1s',
  };

  return (
    <>
      <div ref={ref} style={{  top: 0, bottom: 0, left: 0, display: 'flex', zIndex: 1000 }}>
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
        <div style={{ padding: '5px', display: 'flex', flexDirection: 'column', position: 'relative',width:'20px',overflow:'hidden' }}>
          <div
            onClick={() => setIsCanvasSettingsOpen(!isCanvasSettingsOpen)}
            role="button"
            aria-haspopup="true"
            aria-expanded={isCanvasSettingsOpen}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setIsCanvasSettingsOpen(!isCanvasSettingsOpen)}
            style={{
              padding: '0',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '5px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesomeIcon style={{ color: selectedColor, height: '20px', backgroundColor: getComplementaryColor(selectedColor) }} icon={faPen} />
          </div>

          <div ref={listRef} style={{ flexGrow: '1', overflow: 'hidden auto', position: 'relative',width: '28px' }}>
           <div style={{position:"absolute"}}>
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
                    borderBottom: selectedColor === color ? `2px solid ${color}` : 'none',
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
      </div>
    </>
  );
};

export default ColorSelect;
