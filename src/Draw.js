import React, { useRef, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);
    ctx.strokeStyle = selectedColor;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
  };

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { offsetX: x, offsetY: y };
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      resetCanvas(); // Optional: Uncomment if you want to clear on resize
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{ border: '1px solid black', cursor: 'crosshair', touchAction: 'none', width: '100%', height: '100%' }}
      />
      <div>
        <button onClick={resetCanvas}>Reset</button>
        <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
      </div>
    </div>
  );
};

export default Draw;