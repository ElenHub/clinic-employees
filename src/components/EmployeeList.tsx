import React, { useEffect, useState, Suspense, lazy } from 'react'
import { observer } from 'mobx-react-lite'
import { employeeStore } from '../stores/EmployeeStore'
import TruncatedText from './TruncatedText'
import styles from './EmployeeList.module.css'
import edit from '../assets/edit.svg'
import lockOpen from '../assets/lock-open.svg'
import lockClose from '../assets/lock-close.svg'
import deleteIcon from '../assets/delete.svg'
import arrowLeft from '../assets/arrow-drop-left.svg'
import arrowRight from '../assets/arrow-right.svg'
import copyIcon from '../assets/copy.svg'
import Button from './ui/Button'
import Spinner from './Spinner';
import { Employee } from '../stores/utils/types'
const BlockingModal = lazy(() => import('./BlockingModal'));
const DismissalModal = lazy(() => import('./DismissalModal'));
const DeletingModal = lazy(() => import('./DeletingModal'));

interface EmployeeListProps {
  onAddEmployee: () => void
  onEditEmployee: (employee: Employee | null) => void
}

const EmployeeList: React.FC<EmployeeListProps> = observer(
  ({ onAddEmployee, onEditEmployee }) => {
    const [isBlockingModalOpen, setBlockingModalOpen] = useState(false)
    const [isDismissalModalOpen, setDismissalModalOpen] = useState(false)
    const [isDeletingModalOpen, setDeletingModalOpen] = useState(false)
    const [hoveredEmployeeId, setHoveredEmployeeId] = useState(null)
    const [hoveredIconType, setHoveredIconType] = useState(null) 
    const [isFormVisible, setFormVisible] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
    const [selectedEmployee, setSelectedEmployee] = useState(null)

    useEffect(() => {
      if (employeeStore.employees.length === 0) {
        employeeStore.fetchEmployees()
      }
    }, [])

    // Общее количество страниц
    const totalPages = Math.ceil(employeeStore.employees.length / itemsPerPage)

    // Получение сотрудников для текущей страницы
    const currentEmployees = employeeStore.employees.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    )

    const handlePaginationNext = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1)
      }
    }

    const handlePaginationPrevious = () => {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1)
      }
    }

    const handleDelete = (employee) => {
      setSelectedEmployee(employee)
      setDeletingModalOpen(true)
    }

    const handleDismissEmployee = () => {
      if (selectedEmployee) {
        const updatedEmployee = {
          ...selectedEmployee,
          status: { value: 'dismissed', label: 'Уволен' },
          fired_at: Math.floor(Date.now() / 1000), // Устанавливаем текущее время в качестве даты увольнения
        }
        employeeStore.updateEmployeeStatus(
          selectedEmployee.id,
          updatedEmployee.status,
        )
        resetSelectedEmployee()
      }
    }

    const openDismissalModal = (employee) => {
      setSelectedEmployee(employee)
      setDismissalModalOpen(true)
    }

    const handleDeleteConfirm = async () => {
      if (!selectedEmployee) return
      try {
        await employeeStore.deleteEmployee(selectedEmployee.id)
        resetSelectedEmployee()
      }  catch (error) {
        const err = error as Error; 
        console.error('Ошибка при удалении сотрудника:', err.message);
        alert(`Ошибка: ${err.message}`);
      }
    }

    const openBlockingModal = (employee) => {
      setSelectedEmployee(employee)
      setBlockingModalOpen(true)
    }

    const handleBlockEmployee = () => {
      if (selectedEmployee) {
        const updatedEmployee = {
          ...selectedEmployee,
          status: { value: 'blocked', label: 'Заблокирован' },
        }
        employeeStore.updateEmployeeStatus(
          selectedEmployee.id,
          updatedEmployee.status,
        )
        resetSelectedEmployee()
      }
    }

    const handleUnblockEmployee = (employee) => {
      if (employee) {
        const updatedEmployee = {
          ...employee,
          status: { value: 'active', label: 'Активен' },
        }
        employeeStore.updateEmployeeStatus(employee.id, updatedEmployee.status)
      }
    }

    const resetSelectedEmployee = () => {
      setSelectedEmployee(null)
      setFormVisible(false)
      setBlockingModalOpen(false)
      setDismissalModalOpen(false)
      setDeletingModalOpen(false)
    }

    const handleCopy = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        alert('Информация скопирована!')
      } catch (error) {
        const err = error as Error; 
        console.error('Ошибка при копировании:', err.message);
        alert(`Ошибка: ${err.message}`);
      }
    }

    const handleMouseEnter = (employeeId, iconType) => {
      setHoveredEmployeeId(employeeId)
      setHoveredIconType(iconType)
    }

    const handleMouseLeave = () => {
      setHoveredEmployeeId(null)
      setHoveredIconType(null)
    }

    return (
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <h2 className={styles.title}>Штатное расписание</h2>
          <Button type="button" onClick={onAddEmployee} variant="primary">
            Добавить сотрудника
          </Button>
        </div>

        {employeeStore.loading ? (
          <p>Загрузка...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Телефон</th>
                <th>E-mail</th>
                <th>Должность</th>
                <th>Статус УЗ</th>
                <th>ПЭП</th>
                <th>Дата принятия</th>
                <th>Дата увольнения</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <TruncatedText
                      text={`${employee.name} ${employee.surname} ${employee.patronymic}`}
                      maxLength={6}
                    />
                  </td>
                  <td>
                    <TruncatedText text={employee.phone} maxLength={1} />
                    <img
                      src={copyIcon}
                      onClick={() => handleCopy(employee.phone)}
                      alt="copy phone"
                      className={styles.copyIcon}
                    />
                  </td>
                  <td>
                    <TruncatedText text={employee.email} maxLength={3} />
                    <img
                      src={copyIcon}
                      onClick={() => handleCopy(employee.email)}
                      alt="copy email"
                      className={styles.copyIcon}
                    />
                  </td>
                  <td>
                    {employee.administrative_position?.label || 'Не указана'}
                  </td>
                  <td>{employee.status?.label || 'Не указана'}</td>
                  <td>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={employee.is_simple_digital_sign_enabled}
                        onChange={() => handleCheckboxChange(employee)}
                      />
                      <span className={styles.text}></span>
                    </label>
                  </td>
                  <td>
                    {new Date(employee.hired_at * 1000).toLocaleDateString() ||
                      'Не указана'}
                  </td>
                  <td>
                    {employee.fired_at
                      ? new Date(employee.fired_at * 1000).toLocaleDateString()
                      : 'Не указана'}
                  </td>
                  <td>
                    <div className={styles.iconContainer}>
                      <Button
                        type="button"
                        variant="third"
                        onClick={() => openDismissalModal(employee)}
                      >
                        Уволить
                      </Button>
                      <img
                        src={edit}
                        onClick={() => onEditEmployee(employee)}
                        alt="edit"
                      />
                      {employee.status?.value === 'blocked' ? (
                        <div className={styles.iconWithTooltip}>
                          <img
                            src={lockClose}
                            onClick={() => handleUnblockEmployee(employee)}
                            alt="locked"
                            onMouseEnter={() =>
                              handleMouseEnter(employee.id, 'unblock')
                            }
                            onMouseLeave={handleMouseLeave}
                          />
                          {hoveredEmployeeId === employee.id &&
                            hoveredIconType === 'unblock' && (
                              <div className={styles.tooltip}>
                                Разблокировать сотрудника
                              </div>
                            )}
                        </div>
                      ) : (
                        <img
                          src={lockOpen}
                          onClick={() => openBlockingModal(employee)}
                          alt="unlock"
                        />
                      )}
                      <img
                        src={deleteIcon}
                        onClick={() => handleDelete(employee)}
                        alt="delete"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className={styles.pagination}>
          <img
            className={styles.icon}
            src={arrowLeft}
            onClick={handlePaginationPrevious}
            disabled={currentPage === 1}
            alt="arrowLeft"
            style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
          />
          <span>
            {currentPage} из {totalPages}
          </span>
          <img
            className={styles.icon}
            src={arrowRight}
            onClick={handlePaginationNext}
            disabled={currentPage === totalPages}
            alt="arrowRight"
            style={{
              pointerEvents: currentPage === totalPages ? 'none' : 'auto',
            }}
          />
        </div>

        <Suspense fallback={<Spinner />}>
        <BlockingModal
          isOpen={isBlockingModalOpen}
          onClose={resetSelectedEmployee}
          onConfirm={handleBlockEmployee}
        />
        <DismissalModal
          isOpen={isDismissalModalOpen}
          onClose={resetSelectedEmployee}
          onConfirm={handleDismissEmployee}
        />
        <DeletingModal
          isOpen={isDeletingModalOpen}
          onClose={resetSelectedEmployee}
          onConfirm={handleDeleteConfirm}
        />
         </Suspense>
      </div>
    )
  },
)

export default EmployeeList
