import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp,faPlay } from '@fortawesome/free-solid-svg-icons';
import {createPlayAudio} from './Util';

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
  const [toyItems, setToyItems] = useState([
    'Teddy Bear', 'Lego Set', 'Action Figure', 'Doll', 
    'Puzzle', 'Board Game', 'Remote Control Car', 
    'Building Blocks', 'Yo-Yo', 'Kite',
    'Play-Doh Set', 'Trampoline', 'Toy Train', 
    'Stuffed Animal', 'Rubik\'s Cube', 'Nerf Gun', 
    'Barbie Doll', 'Hot Wheels Cars', 'Finger Puppets',
    'Jump Rope', 'Hula Hoop'
  ]);

  const containerRef = useRef(null);
  const [curText,setCurText] = useState(null);



  const toggleList = () => setIsVisible(!isVisible);

  const addItem = (category) => {
    const newItem = `${category} ${category === 'Fruit' ? fruitItems.length + 1 : 
                     category === 'Animal' ? animalItems.length + 1 : 
                     category === 'Relationship' ? relationshipItems.length + 1 : 
                     category === 'Number' ? numberItems.length + 1 : 
                     toyItems.length + 1}`;
    if (category === 'Fruit') setFruitItems([...fruitItems, newItem]);
    if (category === 'Animal') setAnimalItems([...animalItems, newItem]);
    if (category === 'Relationship') setRelationshipItems([...relationshipItems, newItem]);
    if (category === 'Number') setNumberItems([...numberItems, newItem]);
    if (category === 'Toys') setToyItems([...toyItems, newItem]);
  };

  const  playAudio = async ()=>{
    await  createPlayAudio('sound/us/'+encodeURIComponent(curText.toLowerCase())+".mp3");
  }
  const handleItemClick = (item) => {
    setText(item);

    (async()=>{
      try{
          await  createPlayAudio('sound/us/'+encodeURIComponent(item.toLowerCase())+".mp3");
          setCurText(item);
          console.log(item)
      }catch(error){
        setCurText(null);

      }

  })();
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
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div style={{margin:'5px'}}>
        {curText&&(<FontAwesomeIcon icon={faPlay} onClick={playAudio} />)}
        </div>
        <div style={{margin:'5px'}}>
        <button onClick={toggleList} style={styles.toggleButton}>
        <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} />
      </button>
        </div>

      </div>

      {isVisible && (
        <div style={styles.listContainer}>
          {['Fruits', 'Animals', 'Relationships', 'Numbers', 'Toys'].map((category) => (
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
                    category === 'Numbers' ? numberItems : 
                    toyItems,
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
    backgroundColor: 'rgb(255, 255, 255,0.6)',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '90%',
    overflow: 'hidden',
  },
  toggleButton: {
    padding: '12px',
    fontSize: '24px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding:0
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
    border: 'none',
    textAlign: 'left',
    width: '100%',
    fontSize: '16px',
    background:"transparent"
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
