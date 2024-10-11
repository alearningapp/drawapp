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
    const cursorRef = useRef(null);
    const settingRef = useRef({color:'black',penWidth:5,opacity:1,penType:'solid',isReplaying:false});
    const isDrawingRef = useRef(false);
    const actions = useRef([]);
    const [actionsLen,setActionsLen] = useState(0);
    const currentIndexRef  = useRef(-1);
    const [currentIndex,setCurrentIndex]  = useState(-1);
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
    const offsetXRef = useRef(0);
    const offsetYRef = useRef(0);
    useEffect(() => {
        loopReplayRef.current = loopReplay;
    }, [loopReplay]);

    const setDrawingStyle = (ctx) => {
        const setting = settingRef.current;
        ctx.lineWidth = setting.penWidth;
        ctx.strokeStyle = `rgba(${hexToRgb(setting.color).r}, ${hexToRgb(setting.color).g}, ${hexToRgb(setting.color).b}, ${setting.opacity})`;
        setPenStyle(ctx,setting.penType);
    };

    const setPenStyle = (ctx,penType) => {
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
        offsetXRef.current = offsetX;
        offsetYRef.current = offsetY;
        setDrawingStyle(ctx);
        pointsRef.current=[{ x: offsetX, y: offsetY }];
    },[]) ;

    const draw = (e) => {
        const { offsetX, offsetY } = getOffset(e);
        const rect = canvasRef.current.getBoundingClientRect();
        cursorRef.current.style.left = `${offsetX- rect.left}px`;
        cursorRef.current.style.top = `${offsetY- rect.top}px`;
        if (!isDrawingRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetXRef.current, offsetYRef.current);
        console.log(ctx.strokeStyle);
        ctx.lineTo(offsetX, offsetY);

        ctx.stroke();
        pointsRef.current.push({ x: offsetX, y: offsetY });
        offsetXRef.current = offsetX;
        offsetYRef.current = offsetY;
    }

    const stopDrawing = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        const ctx = canvasRef.current.getContext('2d');
        ctx.stroke();
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
    actions.current.splice(currentIndexRef.current + 1);
    actions.current.push(newAction);
    setActionsLen(actions.length);
    currentIndexRef.current=actions.current.length-1;
    setCurrentIndex(currentIndexRef.current);


    };

    const undo = () => {
        if (currentIndexRef.current > -1) {
            currentIndexRef.current-- ;
            console.log(currentIndexRef.current)
            setCurrentIndex(currentIndexRef.current);
            restoreCanvas();
        }
    };

    const redo = () => {
        if (currentIndexRef.current < actions.current.length - 1) {
            const newIndex = currentIndexRef.current + 1;
            currentIndexRef.current=newIndex;
            setCurrentIndex(currentIndexRef.current);
            restoreCanvas(newIndex);
        }
    };

    const restoreCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i <= currentIndexRef.current; i++) {
            const { color, points, width, opacity, penType } = actions.current[i];
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
        if (actions.current.length === 0 || settingRef.current.isReplaying) return;

        setIsReplaying(true);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let index = 0; index < actions.current.length; index++) {
            const { color, points, width, opacity } = actions.current[index];
            ctx.lineWidth = width;
            ctx.strokeStyle = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b}, ${opacity})`;
            setPenStyle(ctx);
            
           let {x,y}=points[0];

            for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
                const point = points[pointIndex];

                await new Promise((resolve) => {
                    setTimeout(() => {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        ctx.lineTo(point.x, point.y);
                        ctx.stroke();
                        x=point.x;
                        y=point.y;
                        resolve();
                    }, 50); // Adjust the timeout for speed
                });
            }

            ctx.closePath();

            if(!settingRef.current.isReplaying)break;
        }

        setIsReplaying(false);
        if (loopReplayRef.current === ReplayState.LOOP_PLAYING) {
            replayTimeoutRef.current = setTimeout(replayDrawing, 1000); // Restart replay after a delay
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
        setIsReplaying(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            actions.current=[];
            setActionsLen(actions.current.length);
            currentIndexRef.current=-1;
            setCurrentIndex(currentIndexRef.current);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.clientWidth;
        canvas.height = wrapper.clientHeight;
        restoreCanvas();

        const handleResize = () => {
            const newWidth = wrapper.clientWidth;
            const newHeight = wrapper.clientHeight;
            canvas.width = newWidth;
            canvas.height = newHeight;
            restoreCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(replayTimeoutRef.current);
        };
    }, []);

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
        settingRef.current.color=selectedColor;
        settingRef.current.opacity=opacity;
        settingRef.current.penWidth=penWidth;
        settingRef.current.penType=penType;
        settingRef.current.isReplaying=isReplaying;
    }, [selectedColor, opacity,penWidth,penType,isReplaying]);

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
            { (
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
    <div class="cursor" style={{color:selectedColor,width:penWidth,height:penWidth,background:selectedColor}} ref={cursorRef} >
        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 506 511.95"><path fill-rule="nonzero" d="M400.08 26.04c-1.82-1.81-3.72-3.14-5.7-3.97-1.89-.8-4.05-1.2-6.47-1.2-2.38 0-4.52.41-6.4 1.21-1.95.83-3.83 2.15-5.63 3.96l-36.73 36.73 104.11 104.57 37.22-37.22c1.55-1.54 2.69-3.29 3.44-5.18l.15-.38c.71-1.96 1.06-4.17 1.06-6.56 0-2.49-.4-4.82-1.22-6.89l-.22-.62c-.74-1.64-1.79-3.16-3.16-4.52l-80.45-79.93zM69.03 332.8l105.03 103.23 215.22-215.22-104.09-104.17L69.03 332.8zm86.27 113.97-96.28-94.62-27.86 99.15c-4.45 15.91-7.46 28.06-9.05 36.44 19.79-5.98 40.2-11.61 59.73-18.29 10.75-3.39 21.78-6.87 39.25-12.28l24.1-7.34 10.11-3.06zM402.45 2.91c4.5 1.89 8.61 4.69 12.3 8.37l80.45 79.93c3.35 3.33 5.9 7.12 7.68 11.27l.43.96c1.81 4.57 2.69 9.48 2.69 14.56 0 4.87-.8 9.56-2.45 13.97l-.23.63c-1.79 4.53-4.47 8.67-8.08 12.28l-44.64 44.6c-4.07 4.05-10.66 4.03-14.71-.04L317.04 70.11c-4.07-4.07-4.07-10.68 0-14.76l44.08-44.07c3.65-3.66 7.72-6.45 12.23-8.36C377.92.98 382.77 0 387.91 0c5.1 0 9.94.97 14.54 2.91zM174.77 462.66l-23.54 7.07-24.03 7.32c-30.42 9.57-60.67 18.96-91.16 28.28-10.56 3.19-17.58 5.27-20.89 6.17-1.41.4-2.83.54-4.3.39-6.12-.62-9.68-4.3-10.63-11.06-.33-2.28-.28-5.21.13-8.77 1.03-9 4.62-24.47 10.75-46.39l32.27-114.82c.5-1.78 1.43-3.33 2.66-4.55L277.79 94.52c4.07-4.07 10.68-4.07 14.76 0l118.84 118.97c4.05 4.07 4.03 10.65-.02 14.7l-231.66 231.7a10.373 10.373 0 0 1-4.94 2.77z"/></svg>
    </div>
            </div>

            <ButtonContainer 
                undo={undo}
                redo={redo}
                replayDrawing={toggleLoopReplay}
                resetCanvas={resetCanvas}
                isColorPickerOpen={isColorPickerOpen}
                setIsColorPickerOpen={setIsColorPickerOpen}
                actionsLen={actionsLen}
                currentIndex={currentIndex}
                isReplaying={isReplaying}
                loopReplay={loopReplay}
            />
        </div>
    );
};

export default Draw;