import React, { useRef, useState, useCallback } from 'react';
import './DrawSVG.css'; // Import CSS styles

const DrawSVG = () => {
    const svgRef = useRef(null);
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState([]);
    const [penWidth, setPenWidth] = useState(5);
    const [opacity, setOpacity] = useState(1);
    const [penType, setPenType] = useState('solid');
    const [selectedColor, setSelectedColor] = useState('black');
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isReplaying, setIsReplaying] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false); // Track drawing state

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        const { offsetX, offsetY } = getOffset(e);
        setCurrentPath([{ x: offsetX, y: offsetY }]);
        setIsDrawing(true); // Set drawing state to true
    }, []);

    const draw = (e) => {
        if (!isDrawing || currentPath.length === 0) return; // Check if drawing is active

        const { offsetX, offsetY } = getOffset(e);
        setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]);
    };

    const stopDrawing = () => {
        if (currentPath.length > 0) {
            const newPath = {
                points: currentPath,
                width: penWidth,
                opacity,
                penType,
                color: selectedColor,
            };
            const newPaths = [...paths.slice(0, currentIndex + 1), newPath];
            setPaths(newPaths);
            setCurrentIndex(newPaths.length - 1);
            setCurrentPath([]);
        }
        setIsDrawing(false); // Set drawing state to false
    };

    const getOffset = (e) => {
        const rect = svgRef.current.getBoundingClientRect();
        return {
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        };
    };

    const renderPaths = (upToIndex) => {
        return paths.slice(0, upToIndex + 1).map((path, index) => (
            <polyline
                key={index}
                points={path.points.map(p => `${p.x},${p.y}`).join(' ')}
                stroke={path.color}
                strokeWidth={path.width}
                strokeOpacity={path.opacity}
                fill="none"
                style={{ strokeDasharray: path.penType === 'dashed' ? '5,5' : path.penType === 'dotted' ? '1,5' : '0' }}
            />
        ));
    };

    const undo = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentPath([]); // Clear current path
        }
    };

    const redo = () => {
        if (currentIndex < paths.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setCurrentPath([]); // Clear current path
        }
    };

    const replayDrawing = async () => {
        setIsReplaying(true);
        setCurrentPath([]); // Clear current path before replaying

        for (let i = 0; i <= currentIndex; i++) {
            const path = paths[i];
            for (let j = 0; j < path.points.length; j++) {
                await new Promise((resolve) => {
                    setTimeout(() => {
                        setCurrentPath(path.points.slice(0, j + 1)); // Show points one by one
                        resolve();
                    }, 100); // Adjust time for speed of drawing
                });
            }
        }
        setIsReplaying(false);
    };

    const resetCanvas = () => {
        setPaths([]);
        setCurrentIndex(-1);
        setCurrentPath([]);
    };

    return (
        <div className="drawing-container">
            <div className="controls">
                <label>Pen Width: 
                    <input type="range" min="1" max="20" value={penWidth} onChange={(e) => setPenWidth(e.target.value)} />
                </label>
                <label>Opacity: 
                    <input type="range" min="0" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
                </label>
                <label>Pen Type: 
                    <select value={penType} onChange={(e) => setPenType(e.target.value)}>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </label>
                <label>Color: 
                    <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} />
                </label>
            </div>
            <svg
                ref={svgRef}
                className="drawing-svg"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                width="100%"
                height="500px"
            >
                { renderPaths(currentIndex)} {/* Render paths only if not replaying */}
                {currentPath.length > 0 && (
                    <polyline
                        points={currentPath.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke={selectedColor}
                        strokeWidth={penWidth}
                        strokeOpacity={opacity}
                        fill="none"
                        style={{ strokeDasharray: penType === 'dashed' ? '5,5' : penType === 'dotted' ? '1,5' : '0' }}
                    />
                )}
            </svg>
            <div className="button-container">
                <button onClick={undo} disabled={currentIndex <= 0}>Undo</button>
                <button onClick={redo} disabled={currentIndex >= paths.length - 1}>Redo</button>
                <button onClick={replayDrawing} disabled={paths.length === 0 || isReplaying}>Replay</button>
                <button onClick={resetCanvas}>Reset</button>
            </div>
        </div>
    );
};

export default DrawSVG;