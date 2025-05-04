import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'third'; 
  size?: 'small' | 'medium' | 'large' | 'big'; 
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  className = '',
  onClick,
  children,
  variant = '',
  size = '',
  ...props
}) => {
  const classNames = [
    styles.button,
    variant ? styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`] : '',
    size ? styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`] : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button type={type} className={classNames} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button