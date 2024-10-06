import React, { useRef, useEffect, useState, useCallback } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import ButtonContainer from './ButtonContainer'; // Import the ButtonContainer component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [actions, setActions] = useState([]); // Single state for both history and replay actions
    const [currentIndex, setCurrentIndex] = useState(-1); // Track the current index
    const [isReplaying, setIsReplaying] = useState(false);
    const [selectedColor, setSelectedColor] = useState('black');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        isDrawingRef.current = true;

        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);

        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        setCurrentPath([{ x: offsetX, y: offsetY }]); // Only store the points
    }, [selectedColor]);

    const draw = (e) => {
        if (!isDrawingRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);

        ctx.strokeStyle = selectedColor;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]); // Add points
    };

    const stopDrawing = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();

        // Record and save the current action immediately
        const newAction = { color: selectedColor, points: currentPath };
        saveAction(newAction); // Save the current action

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

    const saveAction = (newAction) => {
        setActions((prev) => {
            const updatedActions = [...prev, newAction]; // Append the new action
            setCurrentIndex(updatedActions.length - 1); // Update current index
            return updatedActions; // Return the updated actions
        });
    };

    const undo = () => {
        if (currentIndex > -1) { // Updated condition
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            restoreCanvas(newIndex); // Pass newIndex
        }
    };

    const redo = () => {
        if (currentIndex < actions.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            restoreCanvas(newIndex); // Pass newIndex
        }
    };

    const restoreCanvas = (newIndex) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Loop through the actions up to the newIndex
        for (let i = 0; i <= newIndex; i++) {
            const { color, points } = actions[i]; // Destructure color and points

            // Ensure that points is defined
            if (points) {
                ctx.strokeStyle = color; // Set color from the actions array
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y); // Move to the starting point

                for (let j = 1; j < points.length; j++) {
                    const point = points[j];
                    ctx.lineTo(point.x, point.y); // Draw line to each point
                }

                ctx.stroke();
                ctx.closePath();
            }
        }
    };

    const replayDrawing = async () => {
        if (actions.length === 0 || isReplaying) return;

        setIsReplaying(true);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        for (let index = 0; index < actions.length; index++) {
            const action = actions[index];
            await new Promise((resolve) => {
                setTimeout(async () => {
                    ctx.strokeStyle = action.color; // Use color from the action
                    ctx.beginPath();
                    ctx.moveTo(action.points[0].x, action.points[0].y);

                    for (const point of action.points) {
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
            setActions([]); // Clear actions
            setCurrentIndex(-1); // Reset index
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = canvas.parentElement;

        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;

        const handleResize = () => {
            canvas.width = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;
            resetCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd);

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
            canvas.removeEventListener('touchend', handleTouchEnd);
        };
    }, [selectedColor]);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = selectedColor; // Update the strokeStyle when selectedColor changes
    }, [selectedColor]);

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
            <ButtonContainer 
                undo={undo}
                redo={redo}
                replayDrawing={replayDrawing}
                resetCanvas={resetCanvas}
                isColorPickerOpen={isColorPickerOpen}
                setIsColorPickerOpen={setIsColorPickerOpen}
                actions={actions}
                currentIndex={currentIndex}
                isReplaying={isReplaying}
            />
        </div>
    );
};

export default Draw;