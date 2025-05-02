import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { employeeStore } from '../stores/EmployeeStore'
import ky from 'ky'
import { Department, Employee, Position } from '../stores/utils/types'
import styles from './EmployeeForm.module.css'
import { useNavigate } from 'react-router-dom'
import arrowBack from '../assets/arrowBack.svg'
import Button from './ui/Button'

interface EmployeeFormProps {
  closeForm: () => void
  onBack?: () => void
  employee?: Employee | null;
}

const EmployeeForm: React.FC<EmployeeFormProps> = observer(
  ({ closeForm, onBack, employee }) => {
    const [formData, setFormData] = useState<{
      name: string;
      surname: string;
      patronymic?: string;
      email: string;
      phone: string;
      department: string;
      administrative_position: string;
      medical_position: string;
      hiredAt: string;
      is_simple_digital_sign_enabled: boolean;
  }>({
    name: '',
    surname: '',
    patronymic: '',
    email: '',
    phone: '',
    department: '',
    administrative_position: '',
    medical_position: '',
    hiredAt: '',
    is_simple_digital_sign_enabled: false,
  });

    const [positions, setPositions] = useState<Position[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const navigate = useNavigate()

    const handleBack = () => {
      if (onBack) {
        onBack() 
      } else {
        navigate('/')
      }
    }

    useEffect(() => {
      const fetchOptions = async () => {
        try {
          const positionsResponse = await ky.get(
            `${import.meta.env.VITE_API_HOST}/api/v1/positions`,
          )
          const positionsData = await positionsResponse.json() as { data: { items: Position[] } }
          setPositions(positionsData.data.items)

          const departmentsResponse = await ky.get(
            `${import.meta.env.VITE_API_HOST}/api/v1/departments`,
          )

          const departmentsData = await departmentsResponse.json() as { data: { items: Department[] } }
          setDepartments(departmentsData.data.items)

        } catch (error) {
          const err = error as Error; 
          console.error('Ошибка при загрузке данных:', err.message);
          alert(`Ошибка: ${err.message}`);
        }
      }

      fetchOptions()
    }, [])

    useEffect(() => {
      if (employee) {
        setFormData({
          name: employee.name || '',
          surname: employee.surname || '',
          patronymic: employee.patronymic || '',
          email: employee.email || '',
          phone: employee.phone || '',
          department: employee.department?.value || '',
          administrative_position:
            employee.administrative_position?.value || '',
          medical_position: employee.medical_position?.value || '',
          hired_at: Math.floor(new Date(employee.hiredAt).getTime() / 1000),
          is_simple_digital_sign_enabled:
            employee.is_simple_digital_sign_enabled || false,
        })
      }
    }, [employee])

    const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value } as typeof prev));
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      // Валидация обязательных полей
      if (
        !formData.name ||
        !formData.email ||
        !formData.administrative_position ||
        !formData.medical_position ||
        !formData.department
      ) {
        alert(
          'Обязательные поля не должны быть пустыми. Пожалуйста, заполните их и попробуйте снова.',
        )
        return
      }

      const selectedDepartment = departments.find(
        (dep) => dep.value === formData.department,
      )
      const selectedAdminPosition = positions.find(
        (pos) => pos.value === formData.administrative_position,
      )
      const selectedMedicalPosition = positions.find(
        (pos) => pos.value === formData.medical_position,
      )

      const processedData = {
        name: formData.name,
        surname: formData.surname,
        patronymic: formData.patronymic || '',
        email: formData.email,
        phone: formData.phone,
        department: selectedDepartment?.value || '',
        administrative_position: selectedAdminPosition?.value || '',
        medical_position: selectedMedicalPosition?.value || '',
        is_simple_digital_sign_enabled:
          formData.is_simple_digital_sign_enabled || false,
        hired_at: Math.floor(new Date(formData.hiredAt).getTime() / 1000),
        status: { value: 'active', label: 'Активен' },
      }

      console.log(
        'Данные для отправки:',
        JSON.stringify(processedData, null, 2),
      )

      try {
        if (employee) {
          await ky.put(
            `${import.meta.env.VITE_API_HOST}/api/v1/users/${employee.id}`,
            { json: processedData },
          )
          employeeStore.updateUser(employee.id, processedData)
        } else {
          await employeeStore.createUser(processedData)
        }

        closeForm()
      } catch (error) {
        const err = error as Error;
        console.error('Ошибка при сохранении сотрудника:', err.message);
        alert(`Ошибка: ${err.message}`);
      }
    }

    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <button
          onClick={handleBack}
          style={{ background: 'none', cursor: 'pointer' }}
        >
          <img src={arrowBack} alt="arrowBack" />
        </button>
        <h2 className={styles.title}>
          {employee ? 'Редактировать сотрудника' : 'Добавить нового сотрудника'}
        </h2>
        {[
          { label: 'Фамилия', name: 'surname', type: 'text', required: true },
          { label: 'Имя', name: 'name', type: 'text', required: true },
          { label: 'Отчество', name: 'patronymic', type: 'text' },
          {
            label: 'Административная должность',
            name: 'administrative_position',
            type: 'select',
            required: true,
          },
          {
            label: 'Медицинская должность',
            name: 'medical_position',
            type: 'select',
            required: true,
          },
          {
            label: 'Подразделение',
            name: 'department',
            type: 'select',
            required: true,
          },
          { label: 'Телефон', name: 'phone', type: 'tel', required: true },
          { label: 'E-mail', name: 'email', type: 'email', required: true },
          { label: 'Дата принятия на работу', name: 'hiredAt', type: 'date' },
        ].map(({ label, name, type, required }) => (
          <div key={name} className={styles.inputContainer}>
            <label className={styles.label}>{label}</label>
            {type === 'select' ? (
              <select
                className={styles.inputField}
                name={name}
                value={formData[name] || ''}
                onChange={handleInputChange}
                required={required}
              >
                <option value="" disabled>{`Выберите ${label}`}</option>
                {(name === 'administrative_position' ||
                name === 'medical_position'
                  ? positions
                  : departments
                ).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={styles.inputField}
                type={type}
                name={name}
                value={formData[name] || ''}
                onChange={handleInputChange}
                required={required}
              />
            )}
          </div>
        ))}
        <Button size="big" variant="primary" type="submit">
          Сохранить изменения
        </Button>
      </form>
    )
  },
)

export default EmployeeForm