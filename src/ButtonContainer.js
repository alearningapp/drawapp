// ButtonContainer.js
import React from 'react';

const ButtonContainer = ({ 
  undo, 
  redo, 
  replayDrawing, 
  resetCanvas, 
  isColorPickerOpen, 
  setIsColorPickerOpen, 
  history, 
  redoStack, 
  isReplaying, 
  replayActions 
}) => {
  return (
    <div className="button-container">
      <button onClick={undo} disabled={history.length === 0}>
        <i className="fas fa-undo"></i> {/* Undo icon */}
      </button>
      <button onClick={redo} disabled={redoStack.length === 0}>
        <i className="fas fa-redo"></i> {/* Redo icon */}
      </button>
      <button onClick={replayDrawing} disabled={isReplaying || replayActions.length === 0}>
        <i className="fas fa-play"></i> {/* Play icon for replay */}
      </button>
      <button onClick={resetCanvas}>
        <i className="fas fa-trash-alt"></i> {/* Trash icon for reset */}
      </button>
      <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
        <i className={`fas ${isColorPickerOpen ? 'fa-eye-slash' : 'fa-eye'}`}></i> {/* Eye icon for color picker */}
      </button>
    </div>
  );
};

export default ButtonContainer;