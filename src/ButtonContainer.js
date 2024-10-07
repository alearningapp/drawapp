import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faPlay, faPause, faSync, faPalette } from '@fortawesome/free-solid-svg-icons';

const ButtonContainer = ({
    undo,
    redo,
    replayDrawing,
    resetCanvas,
    isColorPickerOpen,
    setIsColorPickerOpen,
    actionsLen,
    currentIndex,
    isReplaying,
    loopReplay
}) => {
    return (
        <div className="button-container">
            <button onClick={undo} disabled={currentIndex < 0}>
                <FontAwesomeIcon icon={faUndo} /> Undo
            </button>
            <button onClick={redo} disabled={currentIndex >= actionsLen- 1}>
                <FontAwesomeIcon icon={faRedo} /> Redo
            </button>
            <button onClick={replayDrawing} disabled={actionsLen==0}>
                <FontAwesomeIcon icon={isReplaying ? faPause : loopReplay === 2 ? faSync : faPlay} /> 
                {loopReplay === 2 ? ' Loop Replay' : loopReplay === 1 ? ' Play' : ' Replay'}
            </button>
            <button onClick={resetCanvas}>
                <FontAwesomeIcon icon={faSync} /> Reset
            </button>
            <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
                <FontAwesomeIcon icon={faPalette} /> 
                {isColorPickerOpen ? ' Setting' : 'Setting'}
            </button>
        </div>
    );
};

export default ButtonContainer;