import React, { useState, useRef, useEffect } from 'react';
import CanvasSettings from './CanvasSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

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
      ><div style={{background:selectedColor,padding:'10px',borderRadius:'5px'}}></div>
        <FontAwesomeIcon style={{color:selectedColor,marginLeft:'5px',height:'20px'}} icon={faPen}  />
      </div>
      {isOpen && (
        <div style={{ display: 'flex' }}>
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
      )}
    </div>
  );
};

export default ColorSelect;
