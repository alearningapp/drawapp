import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faPlay, faPause, faSync, faPalette, faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ButtonContainer.css'; // Updated CSS file import

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
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const toggleMoreMenu = () => {
        setIsMoreOpen(!isMoreOpen);
    };

    const handleClickOutside = (event) => {
        if (isMoreOpen && !event.target.closest('.more-menu-container') && !event.target.closest('.more-button')) {
            setIsMoreOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreOpen]);

    const handleMenuItemClick = (callback) => {
        callback();
        setIsMoreOpen(false);
    };

    return (
        <div className="button-container">
            <button onClick={undo} disabled={isReplaying || currentIndex < 0}>
                <FontAwesomeIcon icon={faUndo} /> Undo
            </button>
            <button onClick={redo} disabled={isReplaying || currentIndex >= actionsLen - 1}>
                <FontAwesomeIcon icon={faRedo} /> Redo
            </button>
            <button onClick={replayDrawing} disabled={actionsLen === 0}>
                <FontAwesomeIcon icon={isReplaying ? faPause : loopReplay === 2 ? faSync : faPlay} /> 
                {loopReplay === 2 ? ' Loop Replay' : loopReplay === 1 ? ' Play' : ' Replay'}
            </button>
            <div className="more-menu-container">
                <button onClick={toggleMoreMenu} className="more-button">
                    <FontAwesomeIcon icon={faEllipsisH} /> More
                </button>
                {isMoreOpen && (
                    <ul className="more-menu">
                        <li onClick={() => handleMenuItemClick(resetCanvas)}>
                            <FontAwesomeIcon icon={faTrashAlt} /> Reset
                        </li>
                        {/* Add more menu items as needed */}
                    </ul>
                )}
            </div>
            <button onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
                <FontAwesomeIcon icon={faPalette} /> 
                {isColorPickerOpen ? ' Setting' : 'Setting'}
            </button>
        </div>
    );
};

export default ButtonContainer;
