import React from 'react'
import arrowDown from '../assets/arrow-drop-down.svg'
import notification from '../assets/notification.svg'
import mail from '../assets/mail.svg'
import user from '../assets/user.svg'
import styles from './Header.module.css'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.divisionSelect}>
        <span>Выберите подразделение</span>
        <img src={arrowDown} alt="arrowDown" className={styles.arrowIcon} />
      </div>
      <div className={styles.iconsContainer}>
        <img
          src={notification}
          alt="notification"
          className={`${styles.icon} ${styles.notificationIcon}`}
        />
        <img
          src={mail}
          alt="mail"
          className={`${styles.icon} ${styles.mailIcon}`}
        />
        <img
          src={user}
          alt="user"
          className={`${styles.icon} ${styles.userIcon}`}
        />
      </div>
    </div>
  )
}

export default Header
