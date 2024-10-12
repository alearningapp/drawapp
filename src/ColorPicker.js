import React, { useState, useRef, useEffect } from 'react';

const ColorSelect = ({ selectedColor, setSelectedColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
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

  const handleMouseDown = (e) => {
    const offsetX = e.clientX - position.x;
    const offsetY = e.clientY - position.y;

    const handleMouseMove = (moveEvent) => {
      setPosition({
        x: moveEvent.clientX - offsetX,
        y: moveEvent.clientY - offsetY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height: '300px', border: '1px solid #ccc' }}>
      <button
        onClick={toggleList}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          backgroundColor: selectedColor,
          color: '#fff',
          padding: '10px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'move',
        }}
      >
        Select Color
      </button>
      {isOpen && (
        <ul style={{
          listStyle: 'none',
          padding: '10px',
          margin: '0',
          border: '1px solid #ccc',
          position: 'absolute',
          backgroundColor: '#fff',
          zIndex: 1000,
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
                margin: '5px 0',
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ColorSelect;
