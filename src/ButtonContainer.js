// ButtonContainer.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faPlay, faTrashAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
        <FontAwesomeIcon icon={faUndo} /> {/* Undo icon */}
      </button>
      <button onClick={redo} disabled={redoStack.length === 0}>
        <FontAwesomeIcon icon={faRedo} /> {/* Redo icon */}
      </button>
      <button onClick={replayDrawing} disabled={isReplaying || replayActions.length === 0}>
        <FontAwesomeIcon icon={faPlay} /> {/* Play icon for replay */}
      </button>
      <button onClick={resetCanvas}>
        <FontAwesomeIcon icon={faTrashAlt} /> {/* Trash icon for reset */}
      </button>
      <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
        <FontAwesomeIcon icon={isColorPickerOpen ? faEyeSlash : faEye} /> {/* Eye icon for color picker */}
      </button>
    </div>
  );
};

export default ButtonContainer;