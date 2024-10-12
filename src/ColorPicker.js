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
  const [isOpen, setIsOpen] = useState(false);
  const colors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffffff', 
    '#800000', '#808000', '#008000', '#008080', 
    '#000080', '#800080', '#c0c0c0', '#808080', 
    '#f0e68c', '#add8e6', '#ffb6c1', '#ffa07a'
  ];
  const ref = useRef();

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
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
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleList()}
        style={{
          padding: '10px',
          cursor: 'pointer',
          borderRadius: '5px',
          margin: '5px 0',
          display: 'flex',
        }}
      >
        <div style={{ background: selectedColor, border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}></div>
        <FontAwesomeIcon style={{ color: selectedColor, marginLeft: '5px', height: '20px', backgroundColor: getComplementaryColor(selectedColor) }} icon={faPen} />
      </div>
      {isOpen && (
        <div style={{ display: 'flex', maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }}>
          <div>
            <ul style={{
              listStyle: 'none',
              padding: '10px',
              margin: '0',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'row', // Change to row for wrapping
              flexWrap: 'wrap',     // Enable wrapping
              gap: '5px',
              maxWidth: '100px'     // Set a max width to control the wrapping
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
                    flex: '0 0 30%', // Control the size of each item (30% width)
                    boxSizing: 'border-box', // Ensure padding is included in width
                  }}
                />
              ))}
            </ul>
          </div>
          <CanvasSettings 
            penWidth={penWidth} 
            setPenWidth={setPenWidth} 
            opacity={opacity} 
            setOpacity={setOpacity} 
            penType={penType} 
            setPenType={setPenType} 
          />
        </div>
      )}
    </div>
  );
};

export default ColorSelect;
