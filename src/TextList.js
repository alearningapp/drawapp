import React, { useState, useRef, useEffect } from 'react';

// TextList Component
const TextList = ({ setText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
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
  const [numberItems, setNumberItems] = useState([
    '0 zero', '1 one', '2 two', '3 three', '4 four', 
    '5 five', '6 six', '7 seven', '8 eight', '9 nine', 
    '10 ten'
  ]);

  const containerRef = useRef(null);

  const toggleList = () => setIsVisible(!isVisible);

  const addItem = (category) => {
    const newItem = `${category} ${category === 'Fruit' ? fruitItems.length + 1 : 
                     category === 'Animal' ? animalItems.length + 1 : 
                     category === 'Relationship' ? relationshipItems.length + 1 : 
                     numberItems.length + 1}`;
    if (category === 'Fruit') setFruitItems([...fruitItems, newItem]);
    if (category === 'Animal') setAnimalItems([...animalItems, newItem]);
    if (category === 'Relationship') setRelationshipItems([...relationshipItems, newItem]);
    if (category === 'Number') setNumberItems([...numberItems, newItem]);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  const renderItems = (items, category) => (
    <div style={styles.scrollableList}>
      {items.map((item, index) => (
        <div key={index} style={styles.listItem} onClick={() => handleItemClick(item)}>
          {item}
        </div>
      ))}
      <button onClick={() => addItem(category)} style={styles.addButton}>
        Add Item
      </button>
    </div>
  );

  const toggleAccordion = (category) => {
    setActiveAccordion(activeAccordion === category ? null : category);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <button onClick={toggleList} style={styles.toggleButton}>
        {isVisible ? 'Hide List' : 'Show List'}
      </button>
      {isVisible && (
        <div style={styles.listContainer}>
          {['Fruits', 'Animals', 'Relationships', 'Numbers'].map((category) => (
            <div key={category}>
              <button 
                onClick={() => toggleAccordion(category)} 
                style={styles.accordionButton}
              >
                {category} {activeAccordion === category ? '−' : '+'}
              </button>
              {activeAccordion === category && (
                <div style={styles.accordionContent}>
                  {renderItems(
                    category === 'Fruits' ? fruitItems : 
                    category === 'Animals' ? animalItems : 
                    category === 'Relationships' ? relationshipItems : 
                    numberItems,
                    category
                  )}
                </div>
              )}
            </div>
          ))}
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
  accordionButton: {
    padding: '10px',
    cursor: 'pointer',
    backgroundColor: '#e7e7e7',
    border: 'none',
    textAlign: 'left',
    width: '100%',
    fontSize: '16px',
  },
  accordionContent: {
    padding: '5px 10px',
    borderTop: '1px solid #ccc',
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
