import React, { useState, useEffect, useCallback, useRef } from 'react';
const WordTrack = ({item}) => {
  const [word, setWord] = useState({});
  const [playedIndex,setPlayedIndex] = useState(-1);
  const [points,setPoints] = useState([]);
  const wordRef = useRef(null);


  const scaleStroke = (stroke,scaleFactor,pointFactor) => {
    stroke.d=stroke.d.replace(/([MLHVCSQTAZ])|(-?\d+(\.\d+)?)/g, (match, command, number) => {
      if (number) {
        return (parseFloat(number) * scaleFactor).toFixed(2); // Scale each number
      }
      return command; 
    });
    stroke.track=stroke.ps.map(p=>[parseFloat(p[0])*scaleFactor,parseFloat(p[1])*scaleFactor,120*pointFactor]);
    
    return stroke;
  };

  const pointsSmooth = function(list) {
    var returnVal = new Array();
    var prevX = -1;
    var prevY = -1;
    var prevSize = -1;
    for(var loop = 0; loop < list.length; loop++) {
      if(prevX == -1) {
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2]||0;
      } else {
        var dx = list[loop][0] - prevX;
        var dy = list[loop][1] - prevY;
        var dSize = list[loop][2]||0 - prevSize;
        for(var adLoop = 0; adLoop < 10; adLoop++) {
          var addX = prevX + (dx / 10 * adLoop);
          var addY = prevY + (dy / 10 * adLoop);
          var addSize = prevSize + (dSize / 10 * adLoop);
          returnVal.push([addX, addY, addSize]);
        }
        prevX = list[loop][0];
        prevY = list[loop][1];
        prevSize = list[loop][2]||0;
      }
    }
    return returnVal;
  };

  const playStokes = useCallback(async() =>{

    const word = wordRef.current;
    if(word?.stroke) for(let i=0;i<word.stroke.length;i++){
        let stroke = word.stroke[i];
        setPoints([]);
       let spoints = pointsSmooth(stroke.track);
        for(let j=0;j<spoints.length;j++){
          setPoints((prev)=>[...prev,spoints[j]]);
          await new Promise((resolve)=>setTimeout(resolve,50));
        }
        setPlayedIndex(i);
      }
  });

  useEffect(() => {

    wordRef.current=null;
    setWord({})
    const fetchPaths = async () => {
      try {
       let t= item.text.charCodeAt(0).toString(16).toUpperCase();
        const response = await fetch(`/api/stroke/${t}.json`);
        if (!response.ok) {
          return; 
          //throw new Error('Network response was not ok');
        }
        
       // const xmlString = await response.text(); // Get the XML string
        const word = await response.json();// createStrokeJSON(xmlString); // Convert XML to JSON
        
        // Assuming strokeData has a property 'path' that is an array
        console.log(word);
       // word.stroke.map(s=>scaleStroke(s,348 /2048,348 /1792))
        setWord(word); // Update state with the paths
        wordRef.current = word;

       
      } catch (error) {
        console.error('Error fetching paths:', error);
      }
    };

    (async()=>{
      if(item){
        await fetchPaths();
        console.log(word)
        playStokes();
      }

    })();


  }, [item]); // Empty dependency array to run once on mount



  return (
   <>
      <svg width="348 " height="348 " viewBox="0 0 348  348 " style={{position:'absolute',    left: '50%',
    top: '50%',
    zIndex: -1,
    transform: 'translate(-50%, -50%)'}}>

      <g>
        {word.stroke&&word.stroke.map((stroke, index) => (
       playedIndex>=index && <path
          key={index}
          d={stroke.d}
          stroke="black"
          strokeWidth="2"
          fill="black"
        />
      ))}
      </g>

      <g>
          {/* Define a mask for the circular track points */}
          <defs>
        <mask id='mask'>
        {word.stroke&&word.stroke.map((stroke, index) => (
        playedIndex+1==index&&<path
          key={index}
          d={stroke.d}
          stroke="white"
          strokeWidth="2"
          fill="white"
        />
      ))}
        </mask>
      </defs>

      {/* Draw stroke */}
      <g  mask="url(#mask)">
      {points.map((point, index) => (
        <circle
              key={index}
              cx={point[0]}
              cy={point[1]}
              r={348 /1792*120}
              fill="black"
      />
      ))}
      </g>
      </g>
      </svg>
    </>
  );
};

export default WordTrack;
