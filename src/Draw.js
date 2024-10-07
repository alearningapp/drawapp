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
        if (!isDrawingRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetXRef.current, offsetYRef.current);
        const { offsetX, offsetY } = getOffset(e);
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
                if(!settingRef.current.isReplaying)break;
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
                actionsLen={actionsLen}
                currentIndex={currentIndex}
                isReplaying={isReplaying}
                loopReplay={loopReplay}
            />
        </div>
    );
};

export default Draw;