import React, { useState } from 'react';

const Playlist = ({ setItem }) => {
  const songs = [
    'A a',
    'B b',
    'C c',
    'D d',
    'E e',
    'F f',
    'G g',
    'H h',
    'I i',
    'J j',
    'K k',
    'L l',
    'M m',
    'N n',
    'O o',
    'P p',
    'Q q',
    'R r',
    'S s',
    'T t',
    'U u',
    'V v',
    'W w',
    'X x',
    'Y y',
    'Z z',
    '1 one',
    '2 two',
    '3 three',
    '4 four',
    '5 five',
    '6 six',
    '7 seven',
    '8 eight',
    '9 nine',
    '10 ten',
  ];

  const [selectedSong, setSelectedSong] = useState(null);

  const playlistContainerStyle = {
    display: 'flex',
    overflowX: 'auto', // Allows horizontal scrolling
    overflowY: 'hidden', // Disable vertical scrollbar
    whiteSpace: 'nowrap', // Prevents wrapping
    padding: '10px',
    borderBottom: '1px solid rgb(204, 204, 204)', // Updated border style
    position: 'absolute', // Updated position
    left: '32px', // Updated left position
    right: '0', // Updated right position
    scrollbarWidth: 'thin', // For Firefox
    scrollbarColor: '#888 #f0f0f0', // For Firefox
  };

  const playlistItemStyle = (isSelected) => ({
    marginRight: '20px', // Spacing between items
    padding: '10px',
    backgroundColor: isSelected ? '#d0e0ff' : '#f0f0f0', // Change background if selected
    borderRadius: '5px', // Optional styling
    cursor: 'pointer', // Change cursor to pointer
  });

  const handleItemClick = (song) => {
    setSelectedSong(song); // Set the selected song
    if (setItem) {
      setItem({text:song}); // Call setItem with the selected song
    }
  };

  return (
    <div style={playlistContainerStyle} className="playlist-container">
      {songs.map((song, index) => (
        <div 
          style={playlistItemStyle(selectedSong === song)} // Determine if the item is selected
          key={index} 
          onClick={() => handleItemClick(song)} // Handle item click
        >
          {song}
        </div>
      ))}
      <style>
        {`
          .playlist-container::-webkit-scrollbar {
            height: 8px; /* Height of horizontal scrollbar */
          }
          .playlist-container::-webkit-scrollbar-track {
            background: #f0f0f0; /* Background of the scrollbar track */
          }
          .playlist-container::-webkit-scrollbar-thumb {
            background: #888; /* Color of the scrollbar thumb */
            border-radius: 5px; /* Rounded corners */
          }
          .playlist-container::-webkit-scrollbar-thumb:hover {
            background: #555; /* Color on hover */
          }
        `}
      </style>
    </div>
  );
};

export default Playlist;
