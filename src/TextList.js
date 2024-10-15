import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { createPlayAudio } from './Util'; // Ensure this utility function is defined
import styles from './TextList.module.css'; // Import the CSS Module

const TextList = ({ setText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [curText, setCurText] = useState(null);
  const containerRef = useRef(null);
  const listContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories.json'); 
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleList = () => setIsVisible(!isVisible);

  const handleItemClick = async (item) => {
    setText(item);
    try {
      await createPlayAudio('sound/us/' + encodeURIComponent(item.toLowerCase()) + ".mp3");
      setCurText(item);
    } catch (error) {
      console.error('Error playing audio:', error);
      setCurText(null);
    }
  };

  const playAudio = async () => {
    if (curText) {
      try {
        await createPlayAudio('sound/us/' + encodeURIComponent(curText.toLowerCase()) + ".mp3");
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  const toggleAccordion = (category) => {
    setActiveAccordion(activeAccordion === category ? null : category);
  };

  const addItem = (category) => {
    const newItem = `${category} Item ${categories.find(cat => cat.name === category).items.length + 1}`;
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.name === category ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    );
  };

  useEffect(() => {
    const checkOverflow = () => {
      if (listContainerRef.current) {
        const { scrollHeight } = listContainerRef.current;
        if (scrollHeight > listContainerRef.current.parentNode.parentNode.clientHeight-10) {
          containerRef.current.style.bottom = '0';
        } else {
          containerRef.current.style.bottom = '';
        }
      }
    };

    checkOverflow(); // Check for overflow when the component mounts
    window.addEventListener('resize', checkOverflow); // Check on window resize

    return () => {
      window.removeEventListener('resize', checkOverflow); // Clean up listener
    };
  }, [isVisible, categories,activeAccordion]); // Check when these change

  return (
    <div ref={containerRef} className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ margin: '5px' }}>
          {curText && <FontAwesomeIcon icon={faPlay} onClick={playAudio} />}
        </div>
        <div style={{ margin: '5px' }}>
          <button onClick={toggleList} className={styles.toggleButton}>
            <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>

      {isVisible && (
        <div ref={listContainerRef} className={styles.listContainer}>
          {categories.map((category) => (
            <div key={category.name}>
              <button 
                onClick={() => toggleAccordion(category.name)} 
                className={styles.accordionButton}
              >
                {category.name} {activeAccordion === category.name ? '−' : '+'}
              </button>
              {activeAccordion === category.name && (
                <div className={styles.accordionContent}>
                  {category.items.map((item, index) => (
                    <div key={index} className={styles.listItem} onClick={() => handleItemClick(item)}>
                      {item}
                    </div>
                  ))}
                  <button onClick={() => addItem(category.name)} className={styles.addButton}>
                    Add Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextList;
