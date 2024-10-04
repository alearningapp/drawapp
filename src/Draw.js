import React, { useRef, useEffect, useState } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [replayActions, setReplayActions] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  const startDrawing = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);

    setCurrentPath([{ x: offsetX, y: offsetY, color: selectedColor }]);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = getOffset(e);

    ctx.strokeStyle = selectedColor;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();

    recordAction('draw', currentPath);
    saveHistory();

    setCurrentPath([]);
  };

  const getOffset = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    let x, y;

    if (e.touches) {
      const touch = e.touches[0];
      x = (touch.clientX - rect.left) * scaleX;
      y = (touch.clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }

    return { offsetX: x, offsetY: y };
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  const recordAction = (actionType, path) => {
    setReplayActions((prev) => [...prev, { actionType, path }]);
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const newHistory = history.concat(canvas.toDataURL());
      setHistory(newHistory);
      setRedoStack([]);
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
          ctx.strokeStyle = action.path[0].color;
          ctx.beginPath();
          ctx.moveTo(action.path[0].x, action.path[0].y);

          for (const point of action.path) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          resolve();
        }, 50);
      });
    }

    ctx.closePath();
    setIsReplaying(false);
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
      setRedoStack([]);
      setReplayActions([]);
    }
  };

  useEffect(() => {
  const canvas = canvasRef.current;
  const wrapper = canvas.parentElement; // Get the parent wrapper

  // Set canvas dimensions based on the wrapper's size
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;

  const handleResize = () => {
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    resetCanvas();
  };

  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}, []);

  return (
    <div className="container">
      {isColorPickerOpen && (
        <div className={`color-picker ${isColorPickerOpen ? 'slide-in' : ''}`}>
          <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
        </div>
      )}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          className="canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      <div className="button-container">
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