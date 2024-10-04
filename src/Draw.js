import React, { useRef, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]); // Store history of canvas states
  const [redoStack, setRedoStack] = useState([]);
  const [replayActions, setReplayActions] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black'); // Current drawing color
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); // Color picker visibility
  const [currentPath, setCurrentPath] = useState([]); // Store current path points

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);

    ctx.strokeStyle = selectedColor; // Set stroke color
    ctx.lineWidth = 5; // Set line width
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    // Start a new path
    setCurrentPath([{ x: offsetX, y: offsetY, color: selectedColor }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);

    ctx.strokeStyle = selectedColor; // Ensure the stroke color is the selected color
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Add the point to the current path
    setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();

    // Record the entire path as a single action
    recordAction('draw', currentPath);
    saveHistory(); // Save the current canvas state

    // Reset the current path
    setCurrentPath([]);
  };

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { offsetX: x, offsetY: y };
  };

  const recordAction = (actionType, path) => {
    setReplayActions((prev) => [...prev, { actionType, path }]);
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
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
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const replayDrawing = async () => {
    if (replayActions.length === 0 || isReplaying) return;

    setIsReplaying(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    for (let index = 0; index < replayActions.length; index++) {
      const action = replayActions[index];
      await new Promise((resolve) => {
        setTimeout(async () => {
          ctx.strokeStyle = action.path[0].color; // Use the saved color from the path
          ctx.beginPath();
          ctx.moveTo(action.path[0].x, action.path[0].y); // Move to the first point of the path

          for (const point of action.path) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke(); // Stroke the line to show it immediately
            await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust delay as needed
          }

          resolve(); // Complete the promise to move to the next action
        }, 50); // Delay before starting the next action
      });
    }

    ctx.closePath(); // Close path after replay
    setIsReplaying(false);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]); // Reset history
      setRedoStack([]); // Reset redo stack
      setReplayActions([]); // Reset replay actions
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      resetCanvas(); // Clear on resize
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