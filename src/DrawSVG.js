import React, { useRef, useEffect, useState, useCallback } from 'react';
import ColorPicker from './ColorPicker';
import ButtonContainer from './ButtonContainer';
import CursorIcon from './CursorIcon';
import './DrawSVG.css';
import TextList from './TextList';

const Draw = () => {
    const svgRef = useRef(null);
    const cursorRef = useRef(null);
    const settingRef = useRef({ color: 'black', penWidth: 5, opacity: 1 });
    const isDrawingRef = useRef(false);
    const actions = useRef([]);
    const [actionsLen, setActionsLen] = useState(0);
    const currentIndexRef = useRef(-1);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [selectedColor, setSelectedColor] = useState('black');
    const [penWidth, setPenWidth] = useState(5);
    const [opacity, setOpacity] = useState(1);
    const [svgElements, setSvgElements] = useState([]);
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayIndex, setReplayIndex] = useState(0);

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        isDrawingRef.current = true;
        const { offsetX, offsetY } = getOffset(e);
        settingRef.current.points = [{ x: offsetX, y: offsetY }];
        setSvgElements((prev) => [...prev, { type: 'polyline', points: settingRef.current.points }]);
    }, []);

    const moveDraw = (e) => {
        if (!isDrawingRef.current) return;
        const { offsetX, offsetY } = getOffset(e);
        const newPoint = { x: offsetX, y: offsetY };
        settingRef.current.points.push(newPoint);
        setSvgElements((prev) => {
            const lastElement = prev[prev.length - 1];
            if (lastElement && lastElement.type === 'polyline') {
                lastElement.points.push(newPoint);
                return [...prev];
            }
            return [...prev, { type: 'polyline', points: [newPoint] }];
        });
    };

    const stopDrawing = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        const newAction = {
            color: selectedColor,
            points: settingRef.current.points,
            width: penWidth,
            opacity: opacity,
        };
        saveAction(newAction);
        settingRef.current.points = [];
    };

    const getOffset = (e) => {
        const rect = svgRef.current.getBoundingClientRect();
        const scaleX = svgRef.current.clientWidth / rect.width;
        const scaleY = svgRef.current.clientHeight / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        return { offsetX: x, offsetY: y };
    };

    const saveAction = (newAction) => {
        actions.current.splice(currentIndexRef.current + 1);
        actions.current.push(newAction);
        setActionsLen(actions.current.length);
        currentIndexRef.current = actions.current.length - 1;
        setCurrentIndex(currentIndexRef.current);
    };

    const restoreCanvas = (isReplay = false) => {
        if (isReplay) {
            // Clear existing elements for replay
            setSvgElements([]);
            let index = 0;

            const playNextAction = () => {
                if (index < actions.current.length) {
                    const action = actions.current[index];
                    setSvgElements(prev => [
                        ...prev,
                        { type: 'polyline', points: action.points, color: action.color }
                    ]);
                    index++;
                    setTimeout(playNextAction, 100); // Set time for the next action
                } else {
                    setIsReplaying(false);
                }
            };

            playNextAction(); // Start the sequence
        } else {
            // Restore all elements without animation
            setSvgElements([]);
            actions.current.forEach(action => {
                setSvgElements(prev => [
                    ...prev,
                    { type: 'polyline', points: action.points, color: action.color }
                ]);
            });
        }
    };

    useEffect(() => {
        restoreCanvas(false); // Default to non-replay mode
    }, [actionsLen]);

    const drawElements = () => {
        return svgElements.map((element, index) => {
            if (element.type === 'polyline') {
                const points = element.points.map(p => `${p.x},${p.y}`).join(' ');
                return (
                    <polyline
                        key={index}
                        points={points}
                        stroke={element.color || selectedColor}
                        strokeWidth={penWidth}
                        fill="none"
                        opacity={opacity}
                    />
                );
            }
            return null;
        });
    };

    const drawText = (text) => {
        // Implement your text drawing logic here
    };

    const undo = () => {
        if (currentIndex > 0) {
            currentIndexRef.current -= 1;
            setCurrentIndex(currentIndexRef.current);
            setActionsLen(actions.current.length);
            restoreCanvas(false); // Restore without replay
        }
    };

    const redo = () => {
        if (currentIndex < actionsLen - 1) {
            currentIndexRef.current += 1;
            setCurrentIndex(currentIndexRef.current);
            setActionsLen(actions.current.length);
            restoreCanvas(false); // Restore without replay
        }
    };

    const resetCanvas = () => {
        actions.current = [];
        setActionsLen(0);
        setCurrentIndex(-1);
        setSvgElements([]);
    };

    const replayDrawing = () => {
        if (isReplaying) {
            setIsReplaying(false);
            setReplayIndex(0);
            return;
        }

        setIsReplaying(true);
        setReplayIndex(0);
        restoreCanvas(true); // Trigger replay mode
    };

    return (
        <div className="container">
            <div className="svg-wrapper">
                <TextList setText={drawText} />
                <ColorPicker 
                    selectedColor={selectedColor} 
                    setSelectedColor={setSelectedColor} 
                    penWidth={penWidth} 
                    setPenWidth={setPenWidth} 
                    opacity={opacity} 
                    setOpacity={setOpacity} 
                />
                <svg
                    ref={svgRef}
                    className="svg"
                    onMouseDown={startDrawing}
                    onMouseMove={moveDraw}
                    onMouseUp={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={moveDraw}
                    onTouchEnd={stopDrawing}
                    width="100%"
                    height="100%"
                    style={{ border: '1px solid black' }}
                >
                    {drawElements()}
                </svg>
                <div className="cursor" ref={cursorRef}>
                    <CursorIcon penWidth={penWidth} selectedColor={selectedColor} />
                </div>
            </div>
            <ButtonContainer 
                undo={undo}
                redo={redo}
                resetCanvas={resetCanvas}
                replayDrawing={replayDrawing}
                isReplaying={isReplaying}
                actionsLen={actionsLen}
                currentIndex={currentIndex}
            />
        </div>
    );
};

export default Draw;
