import React from 'react'
import close from '../../assets/close.svg'
import styles from './Modal.module.css'
import Button from './Button'

interface ModalProps {
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText: string
  cancelText: string
  confirmButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement> // или более конкретно
  cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  showConfirmButton?: boolean
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmButtonProps = {},
  cancelButtonProps = {},
  showConfirmButton = true,
  children,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <img
            src={close}
            alt="Закрыть"
            className={styles.closeIcon}
            onClick={onCancel}
          />
        </div>
        {description && (
          <p className={styles.modalDescription}>{description}</p>
        )}
        {children}
        <div className={styles.buttonContainer}>
          {showConfirmButton && (
            <Button
              type="button"
              size="large"
              variant="secondary"
              onClick={onConfirm}
              {...confirmButtonProps}
            >
              {confirmText}
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="large"
            onClick={onCancel}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
