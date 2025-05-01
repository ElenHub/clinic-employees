import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'third'
  size?: 'small' | 'medium' | 'large' | 'big'
  [key: string]: any
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
  const classNames = `${styles.button} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`

  return (
    <button type={type} className={classNames} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'third']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'big']),
}

export default Button
