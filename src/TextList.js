import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPlay } from '@fortawesome/free-solid-svg-icons';
import { createPlayAudio } from './Util';
import styles from './TextList.module.css'; // Importing CSS Module

// TextList Component
const TextList = ({ setText }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [curText, setCurText] = useState(null);
  const containerRef = useRef(null);

  // Fetch categories and items from backend
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

  const addItem = (category) => {
    const newItem = `${category} Item ${categories.find(cat => cat.name === category).items.length + 1}`;
    setCategories(prevCategories =>
      prevCategories.map(cat =>
        cat.name === category ? { ...cat, items: [...cat.items, newItem] } : cat
      )
    );
  };

  const playAudio = async () => {
    await createPlayAudio('sound/us/' + encodeURIComponent(curText.toLowerCase()) + ".mp3");
  };

  const handleItemClick = async (item) => {
    setText(item);
    try {
      await createPlayAudio('sound/us/' + encodeURIComponent(item.toLowerCase()) + ".mp3");
      setCurText(item);
    } catch (error) {
      setCurText(null);
    }
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
    <div className={styles.scrollableList}>
      {items.map((item, index) => (
        <div key={index} className={styles.listItem} onClick={() => handleItemClick(item)}>
          {item}
        </div>
      ))}
      <button onClick={() => addItem(category)} className={styles.addButton}>
        Add Item
      </button>
    </div>
  );

  const toggleAccordion = (category) => {
    setActiveAccordion(activeAccordion === category ? null : category);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ margin: '5px' }}>
          {curText && (<FontAwesomeIcon icon={faPlay} onClick={playAudio} />)}
        </div>
        <div style={{ margin: '5px' }}>
          <button onClick={toggleList} className={styles.toggleButton}>
            <FontAwesomeIcon icon={isVisible ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>

      {isVisible && (
        <div className={styles.listContainer}>
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
                  {renderItems(category.items, category.name)}
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
