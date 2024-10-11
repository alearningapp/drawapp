import React from 'react';

const colors = [
  'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'gray'
];

const ColorPicker = ({ selectedColor, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px' }}>
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          style={{
            backgroundColor: color,
            width: '25px',
            height: '25px',
            margin: '5px',
            cursor: 'pointer',
            border: selectedColor === color ? '2px solid black' : 'none',
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;