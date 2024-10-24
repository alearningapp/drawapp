import React, { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ item }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const [videoId,setVideoId] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const intervalRef = useRef(null); // Reference for the interval
    const [isPlaying, setIsPlaying] = useState(false);
    const [maxWidth, setMaxWidth] = useState(false);
    const [playerDimensions, setPlayerDimensions] = useState({ height: 0, width: 0 });

    useEffect(()=>{
        console.log(item)
        fetch('/api/video/'+encodeURIComponent(item.text)+".json").then(r=>r.json()).then(r=>{
            setVideoId(r[0].id)
        })
       
        
    },[item])

    useEffect(() => {
        // Load YouTube IFrame API only once
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            initializePlayer();
        }

        // Initialize player when API is ready
        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        return () => {
            cleanupPlayer();
        };
    }, []); // Run only on mount

    useEffect(() => {
        if (isPlayerReady) {
            playerRef?.current?.loadVideoById?.(videoId);
        }
    }, [videoId, isPlayerReady]); // Load new video when videoId changes

    const initializePlayer = () => {

        setMaxWidth(containerRef.current.clientWidth/containerRef.current.clientHeight<=16/9);
        let height = containerRef.current.clientWidth* 9/16;
        let width = containerRef.current.clientWidth;
        if(height>containerRef.current.clientHeight){
            height = '100%';
            width = containerRef.current.clientHeight*16/9;
        }

       console.log(width,height)

        playerRef.current = new window.YT.Player('player', {
            height: height,
            width: width,
            videoId: videoId,
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError,
                'onStateChange': onPlayerStateChange,
            },
        });
    };

    const cleanupPlayer = () => {
        console.log("Cleaning up YouTube player...");
        if (playerRef.current) {
            playerRef.current.destroy();
            playerRef.current = null;
            console.log("Player destroyed.");
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPlayerReady(false); // Reset player readiness
    };
    
    useEffect(() => {
        const handleResize = () => {
            const newWidth = containerRef.current.clientHeight;
            const newHeight = newWidth * (9 / 16); 
            console.log(newHeight)
            console.log(containerRef.current.clientWidth,containerRef.current.clientHeight,containerRef.current.clientWidth/containerRef.current.clientHeight<=16/9)
            setMaxWidth(containerRef.current.clientWidth/containerRef.current.clientHeight<=16/9);
            setPlayerDimensions({ height: newHeight, width: newWidth });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the dimensions

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const onPlayerReady = () => {
        setIsPlayerReady(true);
        const duration = playerRef.current.getDuration();
        setVideoDuration(duration);   
     };

    const onPlayerError = (event) => {
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                    const time = playerRef.current.getCurrentTime();
                    console.log(time)
                    setCurrentTime(time);
                    const duration = playerRef.current.getDuration();
                    setVideoDuration(duration); 
                }
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
            setIsPlaying(false);

            if (event.data === window.YT.PlayerState.ENDED) {
                // Video has ended
                console.log("Video has ended.");
                playerRef.current.seekTo(0);
                setCurrentTime(0); // Reset current time
                // You can perform more actions here, like notifying the user or looping the video.
            }
        }
    };

    const togglePlay = () => {
        if (isPlayerReady && playerRef.current) {
            if (isPlaying) {
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
            }
        }
    };

    const handleProgressChange = (event) => {
        const newTime = (event.target.value / 100) * (playerRef.current?.getDuration() || 0);
        if (isPlayerReady && playerRef.current) {
            playerRef.current.seekTo(newTime);
            setCurrentTime(newTime);
            console.log("Seeking to time:", newTime);
        }
    };

    return (
        <div  ref={containerRef} style={playerContainer} onClick={togglePlay}>
            <div id="player" style={{
            aspectRatio: '16 / 9', 
            height:maxWidth?'auto':'100%',
            width:maxWidth?'100%':'auto',
            maxHeight:'100%',
            maxWidth:'100%',
            
        }}></div>
            <div style={maskStyle}>
            </div>
            <div style={controls}>
                <input  
                    type="range" 
                    min="0" 
                    max="100" 
                    value={videoDuration ? (currentTime / videoDuration) * 100 : 0}
                    onChange={handleProgressChange} 
                    style={progressBar} 
                />
            </div>
        </div>
    );
};

const controls= {
    position: 'absolute',
    top: 0,
    left: 0,
    right:0,
    bottom:0,

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
}
const progressBar= {
    position:'absolute',
    bottom:'2px',
    width: '90%',
    height: '2px', // Set height of the progress bar
    cursor: 'pointer',
    backgroundColor: '#fff', // Optional: color for the progress bar
}
const playerContainer= {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    overflow: 'hidden', // Prevent overflow
}
// Inline styles
const maskStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent black
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const buttonContainerStyle = {
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
};

const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
};

const progressBarStyle = {
    width: '90%',
    marginTop: '20px',
};

export default YouTubePlayer;