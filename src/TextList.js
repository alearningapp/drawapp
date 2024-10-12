import React, { useState, useRef, useEffect } from 'react';

// TextList Component
const TextList = ({ setText }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('alphabet');
  const [alphabetItems, setAlphabetItems] = useState(
    Array.from({ length: 26 }, (_, i) => `${String.fromCharCode(65 + i)}${String.fromCharCode(97 + i)}`) // Pairs like Aa, Bb, Cc, etc.
  );
  const [fruitItems, setFruitItems] = useState([
    'Apple',
    'Banana',
    'Cherry',
    'Date',
    'Elderberry',
    'Fig',
    'Grape',
    'Honeydew',
    'Kiwi',
    'Lemon',
    'Mango',
    'Nectarine',
    'Orange',
    'Papaya',
    'Quince',
    'Raspberry',
    'Strawberry',
    'Tangerine',
    'Ugli fruit',
    'Watermelon'
  ]);
  const containerRef = useRef(null);

  const toggleList = () => {
    setIsVisible(!isVisible);
  };

  const addFruitItem = () => {
    const newItem = `Fruit ${fruitItems.length + 1}`;
    setFruitItems([...fruitItems, newItem]);
  };

  const handleItemClick = (item) => {
    setText(item); // Call the setText function with the clicked item
    setIsVisible(false); // Hide the list when an item is clicked
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsVisible(false); // Hide the list when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Add touch event for mobile

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside); // Cleanup touch event
    };
  }, [containerRef]);

  return (
    <div ref={containerRef} style={styles.container}>
      <button onClick={toggleList} style={styles.toggleButton}>
        {isVisible ? 'Hide List' : 'Show List'}
      </button>
      {isVisible && (
        <div style={styles.listContainer}>
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('alphabet')}
              style={activeTab === 'alphabet' ? styles.activeTab : styles.tab}
            >
              Alphabet
            </button>
            <button
              onClick={() => setActiveTab('fruits')}
              style={activeTab === 'fruits' ? styles.activeTab : styles.tab}
            >
              Fruits
            </button>
          </div>
          {activeTab === 'alphabet' && (
            <div style={styles.category}>
              <div style={styles.scrollableList}>
                {alphabetItems.map((item, index) => (
                  <div
                    key={index}
                    style={styles.listItem}
                    onClick={() => handleItemClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'fruits' && (
            <div style={styles.category}>
              <div style={styles.scrollableList}>
                {fruitItems.map((item, index) => (
                  <div
                    key={index}
                    style={styles.listItem}
                    onClick={() => handleItemClick(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <button onClick={addFruitItem} style={styles.addButton}>
                Add Fruit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#fff',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '90%', // Use a percentage for mobile responsiveness
    overflow: 'hidden',
  },
  toggleButton: {
    marginBottom: '10px',
    padding: '12px', // Increase padding for better touch
    fontSize: '18px', // Slightly larger font size
    cursor: 'pointer',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '5px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #ccc',
    marginBottom: '10px',
  },
  tab: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
  },
  activeTab: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  category: {
    display: 'flex',
    flexDirection: 'column',
  },
  scrollableList: {
    maxHeight: '50vh', // Set maximum height for the list
    overflowY: 'auto', // Enable vertical scrolling
    padding: '5px',
  },
  listItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer', // Change cursor to pointer for better UX
  },
  addButton: {
    marginTop: '10px',
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default TextList;
