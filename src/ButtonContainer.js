import React from 'react';

const ButtonContainer = ({
    undo,
    redo,
    replayDrawing,
    resetCanvas,
    isColorPickerOpen,
    setIsColorPickerOpen,
    actions,
    currentIndex,
    isReplaying,
}) => {
    return (
        <div className="button-container">
            <button onClick={undo} disabled={currentIndex < 0}>Undo</button>
            <button onClick={redo} disabled={currentIndex >= actions.length - 1}>Redo</button>
            <button onClick={replayDrawing} disabled={isReplaying || actions.length === 0}>Replay</button>
            <button onClick={resetCanvas}>Reset</button>
            <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
                {isColorPickerOpen ? 'Close Color Picker' : 'Open Color Picker'}
            </button>
        </div>
    );
};

export default ButtonContainer;