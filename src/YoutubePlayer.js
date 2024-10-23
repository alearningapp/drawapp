import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import React, { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId }) => {
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [maxWidth, setMaxWidth] = useState(false);
    const [playerDimensions, setPlayerDimensions] = useState({ height: 0, width: 0 });

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('player', {
                height: playerDimensions.height,
                width: playerDimensions.width,
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onError': onPlayerError,
                    'onStateChange': onPlayerStateChange,
                },
            });
        };
    }, [videoId, playerDimensions]);

    useEffect(() => {
        const handleResize = () => {
            const newWidth = containerRef.current.innerWidth;
            const newHeight = newWidth * (9 / 16); 
            setMaxWidth(containerRef.current.innerWidth/containerRef.current.innerHeight<9/16);
            console.log(containerRef.current.innerWidth/containerRef.current.innerHeight<9/16);
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
        console.error('Error occurred in player:', event.data);
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            const intervalId = setInterval(() => {
                if (playerRef.current) {
                    const time = playerRef.current.getCurrentTime();
                    setCurrentTime(time);
                }
            }, 1000);
            return () => clearInterval(intervalId);
        } else {
            setIsPlaying(false);
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
        const newTime = (event.target.value / 100) * videoDuration;
        if (isPlayerReady && playerRef.current) {
            playerRef.current.seekTo(newTime);
            setCurrentTime(newTime);
        }
    };

    // Inline styles
    const styles = {
        playerContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Align items to the top
            alignItems: 'center',
            overflow: 'hidden', // Prevent overflow
        },
        controls: {
            position: 'absolute',
            top: 0,
            left: 0,
            right:0,
            bottom:0,

            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        progressBar: {
            position:'absolute',
            top:0,
            width: '90%',
            height: '2px', // Set height of the progress bar
            cursor: 'pointer',
            backgroundColor: '#fff', // Optional: color for the progress bar
        },
    };

    return (
        <div ref={containerRef} style={styles.playerContainer} onClick={togglePlay}>
            <div id="player" style={{
            height: '100%', 
            aspectRatio: '16 / 9', 
            height:maxWidth?'auto':'100%',
            width:maxWidth?'100%':'auto'
            
        }}></div>
            <div style={styles.controls}>
                <input  
                    type="range" 
                    min="0" 
                    max="100" 
                    value={videoDuration ? (currentTime / videoDuration) * 100 : 0}
                    onChange={handleProgressChange} 
                    style={styles.progressBar} 
                />
            </div>
        </div>
    );
};

export default YouTubePlayer;
