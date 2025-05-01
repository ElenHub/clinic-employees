import React from 'react'
import styles from './Input.module.css'

interface InputProps {
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  type?: string
  className?: string
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, type = 'text', className }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${styles.input} ${className}`}
    />
  )
}

export default Input
