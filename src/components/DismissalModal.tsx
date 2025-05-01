import React from 'react'
import Modal from './ui/Modal'
import { ModalProps } from '../stores/utils/types'

const DismissalModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <Modal
      title="Увольнение сотрудника"
      description="Это действие будет невозможно отменить. Вы действительно хотите уволить сотрудника? 
Он навсегда потеряет доступ к своей учетной записи, если таковая была. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет храниться в вашей базе данных."
      confirmText="Уволить"
      cancelText="Отмена"
      confirmButtonProps={{ variant: 'secondary', size: 'large' }}
      cancelButtonProps={{ variant: 'primary', size: 'large' }}
      onConfirm={() => {
        onConfirm()
        onClose()
      }}
      onCancel={onClose}
    />
  )
}

export default DismissalModal
