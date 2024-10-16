import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faRedo, faPlay, faPause, faSync,  faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './ButtonContainer.css'; // Updated CSS file import

const ButtonContainer = ({
    undo,
    redo,
    replayDrawing,
    resetCanvas,
    actionsLen,
    currentIndex,
    isReplaying,
    loopReplay
}) => {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);

    const toggleMoreMenu = () => {
        setIsMoreOpen(!isMoreOpen);
        setConfirmReset(false); // Reset confirmation state when toggling menu
    };

    const handleClickOutside = (event) => {
        if (isMoreOpen && !event.target.closest('.more-menu-container') && !event.target.closest('.more-button')) {
            setIsMoreOpen(false);
            setConfirmReset(false); // Reset confirmation state when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMoreOpen]);

    const handleMenuItemClick = () => {
        if (confirmReset) {
            resetCanvas();
            setIsMoreOpen(false);
            setConfirmReset(false); // Reset confirmation state after action
        } else {
            setConfirmReset(true);
        }
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
                        <li
                            onClick={handleMenuItemClick}
                            className={confirmReset ? 'confirm-reset' : ''}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} /> {confirmReset ? 'Confirm Reset' : 'Reset'}
                        </li>
                        {/* Add more menu items as needed */}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ButtonContainer;
