import React from 'react'
import logo from '../assets/logo.png'
import arrowClose from '../assets/arrow-close.svg'
import arrowUp from '../assets/arrow-up.svg'
import mapIcon from '../assets/map.svg'
import organizationIcon from '../assets/organization.svg'
import registerIcon from '../assets/register.svg'
import calendarIcon from '../assets/calendar.svg'
import tariffsIcon from '../assets/tariffs.svg'
import starIcon from '../assets/star.svg'
import aboutIcon from '../assets/about.svg'
import styles from './Sidebar.module.css'

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img className={styles.logo} src={logo} alt="logo" />
        <div className={styles.arrowClose}>
          <img src={arrowClose} className={styles.arrow} alt="arrow close" />
        </div>
      </div>

      <div className={styles.flexContainer}>
        <p>Личный кабинет</p>
        <img src={arrowUp} className={styles.arrowUp} alt="arrow up" />
      </div>

      <div className={styles.structure}>
        <p>
          <img src={mapIcon} alt="map" className={styles.iconSpacing} />{' '}
          Структура ВКК
        </p>
        <p>
          <img
            src={organizationIcon}
            alt="organization"
            className={styles.iconSpacing}
          />{' '}
          Организация
        </p>
        <p>
          <img
            src={registerIcon}
            alt="register"
            className={styles.iconSpacing}
          />{' '}
          Реестр документов ВКК
        </p>
        <p>
          <img
            src={calendarIcon}
            alt="calendar"
            className={styles.iconSpacing}
          />{' '}
          Календарь ВКК
        </p>
        <p>
          <img src={tariffsIcon} alt="tariffs" className={styles.iconSpacing} />{' '}
          Тарифы и оплата
        </p>
      </div>

      <div className="workspace">
        <div className={styles.flexContainer}>
          <p>Рабочее пространство</p>
          <img src={arrowUp} alt="arrow up" className={styles.arrowUp} />
        </div>

        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Руководитель МО
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Ответственное лицо
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Уполномоченное лицо
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Председатель ВК
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Секретарь ВК
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} /> Член
          ВК
        </p>
        <p>
          <img src={starIcon} alt="star" className={styles.iconSpacing} />{' '}
          Администратор клиники
        </p>
      </div>

      <div className={styles.about}>
        <p>
          <img src={aboutIcon} alt="about" className={styles.iconSpacing} /> О
          сервисе
        </p>
      </div>
    </div>
  )
}

export default Sidebar
