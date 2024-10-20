import React, { useRef, useEffect, useState, useCallback } from "react";
import ColorPicker from "./ColorPicker";
import ButtonContainer from "./ButtonContainer";
import CursorIcon from "./CursorIcon";
import "./DrawSVG.css";
import TextList from "./TextList";
import PlayList from "./PlayList";
import WordTrack from "./WordTrack";
import SvgEditPlayer from "./SvgEdit2/SvgPlayer";
import ModeSwitchButton from './ModeSwitchButton';
const paths = [
    { d: "M10 80 Q 95 10 180 80", cx: 10, cy: 80 },
    { d: "M20 90 Q 100 30 200 90", cx: 20, cy: 90 },
    // Add more paths as needed
  ];

const Draw = () => {
  const svgRef = useRef(null);
  const cursorRef = useRef(null);
  const settingRef = useRef({ color: "black", penWidth: 5, opacity: 1 });
  const isDrawingRef = useRef(false);
  const actions = useRef([]);
  const [actionsLen, setActionsLen] = useState(0);
  const currentIndexRef = useRef(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [penWidth, setPenWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [svgElements, setSvgElements] = useState([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [item, setItem] = useState({ text: "" });

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const { offsetX, offsetY } = getOffset(e);
    settingRef.current.points = [
      { x: parseInt(offsetX), y: parseInt(offsetY) },
    ];
    setSvgElements((prev) => [
      ...prev,
      { type: "polyline", points: settingRef.current.points },
    ]);
  }, []);

  const moveDraw = useCallback((e) => {
    if (!isDrawingRef.current) return;
    const { offsetX, offsetY } = getOffset(e);
    const newPoint = { x: parseInt(offsetX), y: parseInt(offsetY) };

    // Avoid duplicates by checking against the last point
    const lastPoint =
      settingRef.current.points[settingRef.current.points.length - 1];
    if (
      !lastPoint ||
      lastPoint.x !== newPoint.x ||
      lastPoint.y !== newPoint.y
    ) {
      settingRef.current.points.push(newPoint);
      let points = [...settingRef.current.points];
      setSvgElements((prev) => {
        const lastElement = prev[prev.length - 1];
        lastElement.points.length = 0;
        lastElement.points.push(...points);
        return [...prev];
      });
    }
  }, []);

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

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const restoreCanvas = async (isReplay = false) => {
    if (isReplay) {
      setSvgElements([]);

      for (let i = 0; i < actions.current.length; i++) {
        const action = actions.current[i];
        const curPoints = [];

        for (const point of action.points) {
          curPoints.push(point);
          setSvgElements((prev) => [
            ...prev,
            { type: "polyline", points: curPoints, color: action.color },
          ]);
          await sleep(50); // Adjust timing as needed
        }
        await sleep(100); // Adjust timing for action separation
      }
      setIsReplaying(false);
    } else {
      // Restore all elements without animation
      setSvgElements([]);
      actions.current.forEach((action) => {
        setSvgElements((prev) => [
          ...prev,
          { type: "polyline", points: action.points, color: action.color },
        ]);
      });
    }
  };

  useEffect(() => {
    restoreCanvas(false); // Default to non-replay mode
  }, [actionsLen]);

  const drawElements = () => {
    return svgElements.map((element, index) => {
      if (element.type === "polyline") {
        const points = element.points.map((p) => `${p.x},${p.y}`).join(" ");
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
      return;
    }

    setIsReplaying(true);
    restoreCanvas(true); // Trigger replay mode
  };

  return (
    <div className="container">
      <div id="top" style={{ height: "43px",overflow:'hidden' }}>
        <PlayList setItem={setItem} />
      </div>
      <div id="middle" style={{display:'flex',flexGrow:1,position:'relative'}}>
        <div id="leftbar" style={{display:'flex',position:'absolute',top:'0',left:'0',height:'100%'}}>
          <ColorPicker
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            penWidth={penWidth}
            setPenWidth={setPenWidth}
            opacity={opacity}
            setOpacity={setOpacity}
          />
        </div>
        <div id="right" style={{flexGrow:1,display:'flex',marginLeft:'30px',position:'relative'}}>
          <div className="svg-wrapper" style={{border:'1px solid #ccc',position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'hidden'}}>
            <video
              style={{
                position: "absolute",
                top: "0",
                left: "34px",
                zIndex: -1,
              }}
              src={
                "/video/" +
                encodeURIComponent(item.text.toLocaleLowerCase()) +
                ".mp4"
              }
            ></video>
            {(false &&<SvgEditPlayer/>)}
            <TextList setText={drawText} />
            <WordTrack item={item} />
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
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                fontSize="100"
              >
                {item.text}
              </text>
              {drawElements()}
            </svg>

            <div className="cursor" ref={cursorRef}>
              <CursorIcon penWidth={penWidth} selectedColor={selectedColor} />
            </div>
          </div>
            <ModeSwitchButton/>
        </div>
      </div>
      <div id="bottom">
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
    </div>
  );
};

export default Draw;
