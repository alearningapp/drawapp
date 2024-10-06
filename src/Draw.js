import React, { useRef, useEffect, useState, useCallback } from 'react';
import ColorPicker from './ColorPicker'; // Import the ColorPicker component
import ButtonContainer from './ButtonContainer'; // Import the ButtonContainer component
import CanvasSettings from './CanvasSettings'; // Import the CanvasSettings component
import './Draw.css'; // Import the CSS for animations

const Draw = () => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [actions, setActions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isReplaying, setIsReplaying] = useState(false);
    const [selectedColor, setSelectedColor] = useState('black');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [penWidth, setPenWidth] = useState(5);
    const [opacity, setOpacity] = useState(1); // New state for opacity
    const [penType, setPenType] = useState('solid'); // New state for pen type

    const setDrawingStyle = (ctx) => {
        ctx.lineWidth = penWidth;
        ctx.strokeStyle = `rgba(${hexToRgb(selectedColor).r}, ${hexToRgb(selectedColor).g}, ${hexToRgb(selectedColor).b}, ${opacity})`; // Set strokeStyle with RGBA
        console.error(ctx.strokeStyle);
        console.error(selectedColor);
        setPenStyle(ctx); // Set pen style
    };

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        isDrawingRef.current = true;
        
        // Hide color picker when drawing starts
        setIsColorPickerOpen(false);

        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);

        setDrawingStyle(ctx); // Set drawing style
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);

        setCurrentPath([{ x: offsetX, y: offsetY }]);
    }, [selectedColor, penWidth, opacity, penType]); // Add penType to dependencies

    const draw = (e) => {
        if (!isDrawingRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);

        // Removed redundant lines
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]);
    };

    const setPenStyle = (ctx) => {
        if (penType === 'dashed') {
            ctx.setLineDash([5, 5]); // Set dashed line
        } else if (penType === 'dotted') {
            ctx.setLineDash([1, 5]); // Set dotted line
        } else {
            ctx.setLineDash([]); // Solid line
        }
    };

    const stopDrawing = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();

        const newAction = { color: selectedColor, points: currentPath, width: penWidth, opacity, penType }; // Save all parameters
        saveAction(newAction);

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
            const updatedActions = [...prev.slice(0, currentIndex + 1), newAction];
            setCurrentIndex(updatedActions.length - 1);
            return updatedActions;
        });
    };

    const undo = () => {
        if (currentIndex > -1) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            restoreCanvas(newIndex);
        }
    };

    const redo = () => {
        if (currentIndex < actions.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            restoreCanvas(newIndex);
        }
    };

    const restoreCanvas = (newIndex) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i <= newIndex; i++) {
            const { color, points, width, opacity, penType } = actions[i];

            if (points) {
                ctx.lineWidth = width;
                ctx.strokeStyle = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${opacity})`; // Set strokeStyle with RGBA
                setPenStyle(ctx); // Set pen style
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);

                for (let j = 1; j < points.length; j++) {
                    const point = points[j];
                    ctx.lineTo(point.x, point.y);
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
                    ctx.lineWidth = action.width;
                    ctx.strokeStyle = `rgba(${hexToRgb(action.color).r}, ${hexToRgb(action.color).g}, ${hexToRgb(action.color).b}, ${action.opacity})`; // Use RGBA for strokeStyle
                    setPenStyle(ctx); // Set pen style
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
            setActions([]);
            setCurrentIndex(-1);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = canvas.parentElement;

        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
        restoreCanvas(currentIndex);

        const handleResize = () => {
            const newWidth = wrapper.clientWidth;
            const newHeight = wrapper.clientHeight;

            canvas.width = newWidth;
            canvas.height = newHeight;

            restoreCanvas(currentIndex);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [currentIndex]);

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
        ctx.strokeStyle = `rgba(${hexToRgb(selectedColor).r}, ${hexToRgb(selectedColor).g}, ${hexToRgb(selectedColor).b}, ${opacity})`; // Set strokeStyle
    }, [selectedColor, opacity]);

const hexToRgb = (color) => {
    // Check if the color is a named CSS color
    if (typeof color === 'string' && color !== '' && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        const tempDiv = document.createElement('div');
        tempDiv.style.color = color;
        document.body.appendChild(tempDiv);
        const rgb = getComputedStyle(tempDiv).color;
        document.body.removeChild(tempDiv);
        const rgbArray = rgb.match(/\d+/g); // Extract RGB values
        return { r: parseInt(rgbArray[0]), g: parseInt(rgbArray[1]), b: parseInt(rgbArray[2]) };
    }

    // If it's a hex color
    const bigint = parseInt(color.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
};
    return (
        <div className="container">
            {isColorPickerOpen && (
                <div className={`color-picker ${isColorPickerOpen ? 'slide-in' : ''}`}>
                    <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
                </div>
            )}
            <CanvasSettings 
                penWidth={penWidth} 
                setPenWidth={setPenWidth} 
                opacity={opacity} 
                setOpacity={setOpacity} 
                penType={penType} 
                setPenType={setPenType} 
            />
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