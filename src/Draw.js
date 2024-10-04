import React, { useRef, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [replayActions, setReplayActions] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black'); // State for selected color
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); // Start with color picker closed

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);
    ctx.strokeStyle = selectedColor; // Set the stroke color
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    recordAction('start', { x: offsetX, y: offsetY });
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    recordAction('draw', { x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    if (!isDrawing) return; // Prevent unnecessary calls
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    saveHistory(); // Save the current drawing state to history
  };

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width; // Scale for the width
    const scaleY = canvasRef.current.height / rect.height; // Scale for the height
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { offsetX: x, offsetY: y };
  };

  const recordAction = (actionType, position) => {
    setReplayActions((prev) => [...prev, { actionType, position }]);
  };

  const saveHistory = () => {
    const canvas = canvasRef.current; // Get the canvas reference
    if (canvas) {
      const newHistory = history.concat(canvas.toDataURL());
      setHistory(newHistory);
      setRedoStack([]); // Clear redo stack on new action
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const newHistory = history.slice(0, -1);
      const lastState = history[history.length - 1];
      setRedoStack([...redoStack, lastState]);
      setHistory(newHistory);
      restoreCanvas(newHistory[newHistory.length - 1]);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const lastRedoState = redoStack[redoStack.length - 1];
      setHistory([...history, lastRedoState]);
      setRedoStack(redoStack.slice(0, -1));
      restoreCanvas(lastRedoState);
    }
  };

  const restoreCanvas = (dataURL) => {
    const canvas = canvasRef.current; // Get the canvas reference
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
        ctx.drawImage(img, 0, 0); // Draw the previous state
      };
    }
  };

  const replayDrawing = () => {
    if (replayActions.length === 0 || isReplaying) return;

    setIsReplaying(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    replayActions.forEach((action, index) => {
      setTimeout(() => {
        if (action.actionType === 'draw') {
          ctx.lineTo(action.position.x, action.position.y);
          ctx.stroke();
        } else if (action.actionType === 'start') {
          ctx.moveTo(action.position.x, action.position.y);
        }
      }, index * 50); // Adjust speed of replay here
    });

    setTimeout(() => {
      setIsReplaying(false);
    }, replayActions.length * 50); // Reset after replay
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current; // Get the canvas reference
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      setHistory([]); // Reset history
      setRedoStack([]); // Reset redo stack
      setReplayActions([]); // Reset replay actions
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current; // Get the canvas reference
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
      {isColorPickerOpen && (
        <div className={`color-picker ${isColorPickerOpen ? 'slide-in' : ''}`}>
          <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
        </div>
      )}
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
        <button onClick={undo} disabled={history.length === 0}>Undo</button>
        <button onClick={redo} disabled={redoStack.length === 0}>Redo</button>
        <button onClick={replayDrawing} disabled={isReplaying || replayActions.length === 0}>Replay</button>
        <button onClick={resetCanvas}>Reset</button>
        <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
          {isColorPickerOpen ? 'Hide Colors' : 'Show Colors'}
        </button>
      </div>
    </div>
  );
};

export default Draw;