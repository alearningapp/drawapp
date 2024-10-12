import React, { useState, useRef, useEffect } from 'react';
import CanvasSettings from './CanvasSettings';

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
  const [isOpen, setIsOpen] = useState(false);
  const colors = ['#000000','#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const ref = useRef();

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: 'absolute', display: 'flex', flexDirection: 'column' }}>
      <div
        onClick={toggleList}
        style={{
          backgroundColor: selectedColor,
          padding: '10px',
          cursor: 'pointer',
          borderRadius: '5px',
          margin: '5px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        Select Color
      </div>
      {isOpen && (
        <>
        <div style={{display:'flex'}}>
          <CanvasSettings 
            penWidth={penWidth} 
            setPenWidth={setPenWidth} 
            opacity={opacity} 
            setOpacity={setOpacity} 
            penType={penType} 
            setPenType={setPenType} 
          />
          <ul style={{
            listStyle: 'none',
            padding: '10px',
            margin: '0',
            border: '1px solid #ccc',
            position: 'absolute',
            backgroundColor: '#fff',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
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
                }}
              />
            ))}
          </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorSelect;
