import React from 'react'
import Modal from './ui/Modal'
import { ModalProps } from '../stores/utils/types'

const DeletingModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <Modal
      title="Удаление сотрудника"
      description="Это действие будет невозможно отменить. Вы действительно хотите удалить карточку сотрудника? 
После этого сотрудник навсегда потеряет доступ к своей учетной записи, если таковая существует. Также карточка данного сотрудника будет безвозвратно удалена из вашей базы данных. Все созданные им документы и сделанные изменения в документах сохранятся."
      confirmText="Удалить карточку"
      cancelText="Отмена"
      onConfirm={() => {
        onConfirm()
        onClose()
      }}
      onCancel={onClose}
    />
  )
}

export default DeletingModal
