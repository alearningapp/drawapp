import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faGripLines, faEllipsisH, faAdjust } from '@fortawesome/free-solid-svg-icons'; // Import icons
import './CanvasSettings.css'; // Import your CSS file

const CanvasSettings = ({ penWidth, setPenWidth, opacity, setOpacity, penType, setPenType }) => {
    const penTypeIcon = {
        solid: faPen,
        dashed: faGripLines,
        dotted: faEllipsisH,
    }[penType] || faPen;

    return (
        <div className="canvas-settings">
            <div>
                <ul className="pen-type-list">
                    <li 
                        onClick={() => setPenType('solid')} 
                        className={penType === 'solid' ? 'selected' : ''}
                    >
                        <FontAwesomeIcon icon={faPen} /> Solid
                    </li>
                    <li 
                        onClick={() => setPenType('dashed')} 
                        className={penType === 'dashed' ? 'selected' : ''}
                    >
                        <FontAwesomeIcon icon={faGripLines} /> Dashed
                    </li>
                    <li 
                        onClick={() => setPenType('dotted')} 
                        className={penType === 'dotted' ? 'selected' : ''}
                    >
                        <FontAwesomeIcon icon={faEllipsisH} /> Dotted
                    </li>
                </ul>
            </div>
            <div>
                <label>
                    <FontAwesomeIcon icon={penTypeIcon} /> {/* Dynamic icon based on penType */}
                </label>
                <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={penWidth} 
                    onChange={(e) => setPenWidth(Number(e.target.value))} 
                />
            </div>
            <div>
                <label>
                    <FontAwesomeIcon icon={faAdjust} /> {/* Icon for opacity */}
                </label>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={opacity} 
                    onChange={(e) => setOpacity(Number(e.target.value))} 
                />
            </div>
        </div>
    );
};

export default CanvasSettings;
