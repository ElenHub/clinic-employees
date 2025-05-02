import React from 'react'
import PropTypes from 'prop-types'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'third'
  size?: 'small' | 'medium' | 'large' | 'big'
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

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'third']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'big']),
}

export default Button