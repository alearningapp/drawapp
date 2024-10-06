import React from 'react';

const CanvasSettings = ({ penWidth, setPenWidth, opacity, setOpacity, penType, setPenType }) => {
    return (
        <div className="canvas-settings">
            <div>
                <label>Pen Width:</label>
                <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={penWidth} 
                    onChange={(e) => setPenWidth(Number(e.target.value))} 
                />
            </div>
            <div>
                <label>Opacity:</label>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={opacity} 
                    onChange={(e) => setOpacity(Number(e.target.value))} 
                />
            </div>
            <div>
                <label>Pen Type:</label>
                <select value={penType} onChange={(e) => setPenType(e.target.value)}>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                </select>
            </div>
        </div>
    );
};

export default CanvasSettings;