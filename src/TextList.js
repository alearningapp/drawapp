import React, { useState, useRef, useEffect } from 'react';

// TextList Component
const TextList = ({ setText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('alphabet');
  const [alphabetItems, setAlphabetItems] = useState(
    Array.from({ length: 26 }, (_, i) => `${String.fromCharCode(65 + i)}${String.fromCharCode(97 + i)}`)
  );
  const [fruitItems, setFruitItems] = useState([
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 
    'Grape', 'Honeydew', 'Kiwi', 'Lemon', 'Mango', 'Nectarine', 
    'Orange', 'Papaya', 'Quince', 'Raspberry', 'Strawberry', 
    'Tangerine', 'Ugli fruit', 'Watermelon', 'Blueberry', 
    'Pineapple', 'Dragonfruit', 'Pomegranate', 'Coconut', 'Apricot'
  ]);
  const [animalItems, setAnimalItems] = useState([
    'Alligator', 'Bear', 'Cat', 'Dog', 'Elephant', 'Frog', 
    'Giraffe', 'Horse', 'Iguana', 'Jaguar', 'Kangaroo', 
    'Lion', 'Monkey', 'Narwhal', 'Octopus', 'Penguin', 
    'Quokka', 'Rabbit', 'Shark', 'Tiger', 'Zebra', 
    'Dolphin', 'Rhino', 'Squirrel', 'Tortoise', 'Walrus'
  ]);
  const [relationshipItems, setRelationshipItems] = useState([
    'Friend', 'Father', 'Mother', 'Sibling', 'Brother', 
    'Sister', 'Partner', 'Neighbor', 'Cousin', 'Aunt', 
    'Uncle', 'Grandfather', 'Grandmother', 'Child', 'Niece', 
    'Nephew', 'Grandchild', 'Mentor', 'Spouse', 
    'Fiancé', 'Guardian', 'Classmate', 'Teacher'
  ]);

  const containerRef = useRef(null);

  const toggleList = () => setIsVisible(!isVisible);

  const addFruitItem = () => {
    const newItem = `Fruit ${fruitItems.length + 1}`;
    setFruitItems([...fruitItems, newItem]);
  };

  const addAnimalItem = () => {
    const newItem = `Animal ${animalItems.length + 1}`;
    setAnimalItems([...animalItems, newItem]);
  };

  const addRelationshipItem = () => {
    const newItem = `Relationship ${relationshipItems.length + 1}`;
    setRelationshipItems([...relationshipItems, newItem]);
  };

  const handleItemClick = (item) => {
    setText(item);
    setIsVisible(false);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [containerRef]);

  const renderItems = (items, isAddButtonVisible = false, addItemFunction) => (
    <div style={styles.scrollableList}>
      {items.map((item, index) => (
        <div key={index} style={styles.listItem} onClick={() => handleItemClick(item)}>
          {item}
        </div>
      ))}
      {isAddButtonVisible && (
        <button onClick={addItemFunction} style={styles.addButton}>
          Add Item
        </button>
      )}
    </div>
  );

  return (
    <div ref={containerRef} style={styles.container}>
      <button onClick={toggleList} style={styles.toggleButton}>
        {isVisible ? 'Hide List' : 'Show List'}
      </button>
      {isVisible && (
        <div style={styles.listContainer}>
          <div style={styles.tabs}>
            {['alphabet', 'fruits', 'animals', 'relationships'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? styles.activeTab : styles.tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div style={styles.category}>
            {activeTab === 'alphabet' ? renderItems(alphabetItems) : 
             activeTab === 'fruits' ? renderItems(fruitItems, true, addFruitItem) : 
             activeTab === 'animals' ? renderItems(animalItems, true, addAnimalItem) : 
             renderItems(relationshipItems, true, addRelationshipItem)}
          </div>
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
    maxWidth: '90%',
    overflow: 'hidden',
  },
  toggleButton: {
    marginBottom: '10px',
    padding: '12px',
    fontSize: '18px',
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
    maxHeight: '50vh',
    overflowY: 'auto',
    padding: '5px',
  },
  listItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  addButton: {
    marginTop: '10px',
    padding: '8px 12px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default TextList;
