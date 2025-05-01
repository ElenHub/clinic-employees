import React from 'react'
import Modal from './ui/Modal'
import { ModalProps } from '../stores/utils/types'

const BlockingModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <Modal
      title="Блокировка сотрудника"
      description="Это действие будет можно отменить. Вы действительно хотите заблокировать сотрудника? 
На время блокировки сотрудник потеряет доступ к своей учётной записи, если таковая существует. Все созданные им документы и сделанные изменения в документах сохранятся. Также карточка данного сотрудника будет храниться в вашей базе данных."
      confirmText="Заблокировать"
      cancelText="Отмена"
      onConfirm={() => {
        onConfirm()
        onClose()
      }}
      onCancel={onClose}
    />
  )
}

export default BlockingModal
