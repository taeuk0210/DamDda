import React from 'react';
import styles from '../css/CategoryComponent.module.css'; 

export const CategoryComponent = ({ text, onClick, imgUrl }) => {
  return (
    <button className={styles['category-button-2']} onClick={onClick} aria-label={text}>
      <div className={styles['category-margin']}>
        <div className={styles['category-background']}>
          <img className={styles['category-image']} alt={text} src={imgUrl} />
        </div>
      </div>
      <div className={styles['category-container']}>
        <div className={styles['category-text-wrapper']}>{text}</div>
      </div>
    </button>
  );
};
