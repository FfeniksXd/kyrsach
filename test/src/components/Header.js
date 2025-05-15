import React from 'react'
import styles from '../styles/components/Header.module.css'

const Header = () => {
  return (
    <div className={styles.logo}>
      <img src="/img/SaveCraft.png" alt="Minecraft Maps Logo" />
    </div>
  )
}

export default Header