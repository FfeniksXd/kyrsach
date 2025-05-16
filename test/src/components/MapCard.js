import React from 'react'
import styles from '../styles/components/MapCard.module.css'

const MapCard = ({ title, author, image }) => {
  return (
    <div 
      className={styles['map-card']} 
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className={styles['map-info']}>
        <div className={styles['map-title']}>{title}</div>
        <div className={styles['map-author']}>Поколение: {author}</div>
      </div>
    </div>
  )
}

export default MapCard