import React, { useState, useEffect } from 'react';

const Playlist = ({ setItem }) => {
  const [songs, setSongs] = useState([]); // State to hold fetched songs
  const [selectedSong, setSelectedSong] = useState(null);

  const playlistContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    padding: '5px',
    borderBottom: '1px solid rgb(204, 204, 204)',
    right: '0',
    scrollbarWidth: 'thin', 
    scrollbarColor: '#888 #f0f0f0', 
  };

  const playlistItemStyle = (isSelected) => ({
    marginRight: '20px',
    padding: '5px',
    backgroundColor: isSelected ? '#d0e0ff' : '#f0f0f0',
    borderRadius: '5px',
    cursor: 'pointer',
  });

  const handleItemClick = (song) => {
    setSelectedSong(song);
    if (setItem) {
      setItem({ text: song });
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/songs.json'); // Updated URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSongs(data); // Assuming data is an array of song names
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      }
    };

    fetchSongs();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div style={playlistContainerStyle} className="playlist-container">
      {songs.map((song, index) => (
        <div 
          style={playlistItemStyle(selectedSong === song)} 
          key={index} 
          onClick={() => handleItemClick(song)}
        >
          {song}
        </div>
      ))}
      <style>
        {`
          .playlist-container::-webkit-scrollbar {
            height: 8px;
          }
          .playlist-container::-webkit-scrollbar-track {
            background: #f0f0f0;
          }
          .playlist-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 5px;
          }
          .playlist-container::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
    </div>
  );
};

export default Playlist;
