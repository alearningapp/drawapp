import React, { useRef, useEffect, useState, useCallback } from 'react';
import ColorPicker from './ColorPicker';
import ButtonContainer from './ButtonContainer';
import CanvasSettings from './CanvasSettings';
import './Draw.css';

const ReplayState = {
    NORMAL: 0,
    PLAYING: 1,
    LOOP_PLAYING: 2,
};

const Draw = () => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const [actions, setActions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isReplaying, setIsReplaying] = useState(false);
    const [loopReplay, setLoopReplay] = useState(ReplayState.NORMAL);
    const [selectedColor, setSelectedColor] = useState('black');
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const pointsRef = useRef([]);
    const [penWidth, setPenWidth] = useState(5);
    const [opacity, setOpacity] = useState(1);
    const [penType, setPenType] = useState('solid');
    const replayTimeoutRef = useRef(null);
    const loopReplayRef = useRef(loopReplay);

    useEffect(() => {
        loopReplayRef.current = loopReplay;
    }, [loopReplay]);

    const setDrawingStyle = (ctx) => {
        ctx.lineWidth = penWidth;
        ctx.strokeStyle = `rgba(${hexToRgb(selectedColor).r}, ${hexToRgb(selectedColor).g}, ${hexToRgb(selectedColor).b}, ${opacity})`;
        setPenStyle(ctx);
    };

    const setPenStyle = (ctx) => {
        if (penType === 'dashed') {
            ctx.setLineDash([5, 5]);
        } else if (penType === 'dotted') {
            ctx.setLineDash([1, 5]);
        } else {
            ctx.setLineDash([]);
        }
    };

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        isDrawingRef.current = true;
        setIsColorPickerOpen(false);
        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);
        setDrawingStyle(ctx);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        pointsRef.current=[{ x: offsetX, y: offsetY }];
    }, [selectedColor, penWidth, opacity, penType]);

    const draw = (e) => {
        if (!isDrawingRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const { offsetX, offsetY } = getOffset(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        pointsRef.current.push({ x: offsetX, y: offsetY });
    }

    const stopDrawing = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        const newAction = { color: selectedColor, points: pointsRef.current, width: penWidth, opacity, penType };
        saveAction(newAction);
        pointsRef.current=[];
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
                ctx.strokeStyle = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${opacity})`;
                setPenStyle(ctx);
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

        for (let index = 0; index < actions.length; index++) {
            const { color, points, width, opacity } = actions[index];
            ctx.lineWidth = width;
            ctx.strokeStyle = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${opacity})`;
            setPenStyle(ctx);
            
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
                const point = points[pointIndex];

                await new Promise((resolve) => {
                    setTimeout(() => {
                        ctx.lineTo(point.x, point.y);
                        ctx.stroke();
                        resolve();
                    }, 50); // Adjust the timeout for speed
                });
            }

            ctx.closePath();
        }

        if (loopReplayRef.current === ReplayState.LOOP_PLAYING) {
            replayTimeoutRef.current = setTimeout(replayDrawing, 1000); // Restart replay after a delay
        } else {
            setIsReplaying(false);
        }
    };
    const toggleLoopReplay = () => {
        console.log('de')
    if (loopReplay === ReplayState.LOOP_PLAYING) {
        clearTimeout(replayTimeoutRef.current);
        setLoopReplay(ReplayState.NORMAL);
        setIsReplaying(false);
    } else if (loopReplay === ReplayState.NORMAL) {
        setLoopReplay(ReplayState.PLAYING);
        replayDrawing(); // Start replaying
    } else if (loopReplay === ReplayState.PLAYING) {
        setLoopReplay(ReplayState.LOOP_PLAYING); // Switch to loop playing
         replayDrawing(); 
    }
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
            clearTimeout(replayTimeoutRef.current);
        };
    }, [currentIndex]);

    const handleTouchStart = (e) => {
        startDrawing(e);
    };

    const handleTouchMove = (e) => {
        draw(e);
    };

    const handleTouchEnd = () => {
        stopDrawing();
    };

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
        ctx.strokeStyle = `rgba(${hexToRgb(selectedColor).r}, ${hexToRgb(selectedColor).g}, ${hexToRgb(selectedColor).b}, ${opacity})`;
    }, [selectedColor, opacity]);

    const hexToRgb = (color) => {
        if (typeof color === 'string' && color !== '' && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            const tempDiv = document.createElement('div');
            tempDiv.style.color = color;
            document.body.appendChild(tempDiv);
            const rgb = getComputedStyle(tempDiv).color;
            document.body.removeChild(tempDiv);
            const rgbArray = rgb.match(/\d+/g);
            return { r: parseInt(rgbArray[0]), g: parseInt(rgbArray[1]), b: parseInt(rgbArray[2]) };
        }

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
            {isColorPickerOpen && (
                <CanvasSettings 
                    penWidth={penWidth} 
                    setPenWidth={setPenWidth} 
                    opacity={opacity} 
                    setOpacity={setOpacity} 
                    penType={penType} 
                    setPenType={setPenType} 
                />
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
                replayDrawing={toggleLoopReplay}
                resetCanvas={resetCanvas}
                isColorPickerOpen={isColorPickerOpen}
                setIsColorPickerOpen={setIsColorPickerOpen}
                actions={actions}
                currentIndex={currentIndex}
                isReplaying={isReplaying}
                loopReplay={loopReplay}
            />
        </div>
    );
};

export default Draw;