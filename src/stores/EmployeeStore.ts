import { makeAutoObservable, runInAction, toJS } from 'mobx'
import ky from 'ky'
import {
  Employee,
  Department,
  Position,
  UpdateEmployeeData,
} from './utils/types'

interface ApiResponse<T> {
  data: T
}

export class EmployeeStore {
  employees: Employee[] = []
  roles: any[] = [] 
  departments: Department[] = []
  positions: Position[] = []

  loading = false
  lastPage = 1
  currentPage = 1
  host = import.meta.env.VITE_API_HOST

  constructor() {
    makeAutoObservable(this)
    this.loadEmployeesFromLocalStorage()
  }

  async createUser(newEmployee: {
    name: string
    surname: string
    patronymic: string
    email: string
    phone: string
    department: string | null 
    administrative_position: string | null 
    medical_position: string | null 
    hired_at: number | null
    is_simple_digital_sign_enabled: boolean 
  }) {
    try {
      const response = await ky.post(`${this.host}/api/v1/users`, {
        json: newEmployee,
      })
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`

        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка валидации: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const responseData = (await response.json()) as ApiResponse<Employee> 
      runInAction(() => {
        this.employees.push(responseData.data) 
        this.saveEmployeesToLocalStorage()
      })
      console.log('Сотрудник успешно добавлен:', responseData.data)
    } catch (error: unknown) {
      let errorMessage =
        'Произошла неизвестная ошибка при добавлении сотрудника'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при добавлении сотрудника:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }

  saveEmployeesToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(toJS(this.employees)))
    localStorage.setItem('currentPage', this.currentPage.toString())
  }

  loadEmployeesFromLocalStorage() {
    const localEmployees = localStorage.getItem('employees')
    const localPage = localStorage.getItem('currentPage')

    if (localEmployees) {
      try {
        this.employees = JSON.parse(localEmployees)
      } catch (e) {
        console.error('Ошибка при парсинге из localStorage:', e)
      }
    }
    if (localPage) {
      this.currentPage = parseInt(localPage, 10) || 1
    }
  }

  // Получение сотрудников с сервера
  async fetchEmployees(
    page = this.currentPage,
    perPage = 5,
    showFired = false,
    showBlocked = false,
  ) {
    this.loading = true
    try {
      const response = await fetch(
        `${this.host}/api/v1/users?per_page=${perPage}&page=${page}${showFired ? '&filter[status]=dismissed' : ''}${showBlocked ? '&filter[status]=blocked' : ''}`,
      )
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const data = (await response.json()) as ApiResponse<{
        items: Employee[]
        pagination?: any
      }> 
      runInAction(() => {
        this.employees = data.data.items
        this.lastPage = Math.min(data.data.pagination?.last_page || 1, 10)
        this.saveEmployeesToLocalStorage()
        this.loading = false
      })
    } catch (error: unknown) {
      let errorMessage = 'Произошла неизвестная ошибка при загрузке сотрудников'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при загрузке сотрудников:', error)
      alert(`Ошибка: ${errorMessage}`)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async deleteEmployee(userId: number) {
    try {
      const response = await ky.delete(`${this.host}/api/v1/users/${userId}`)
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      runInAction(() => {
        this.employees = this.employees.filter((emp) => emp.id !== userId)
        this.saveEmployeesToLocalStorage()
      })
      console.log(`Сотрудник с ID ${userId} успешно удален.`)
    } catch (error: unknown) {
      let errorMessage = 'Произошла неизвестная ошибка при удалении сотрудника'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при удалении сотрудника:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }

  // Метод для обновления только статуса
  updateEmployeeStatus(
    userId: number,
    newStatus: { value: string; label: string },
  ) {
    runInAction(() => {
      const index = this.employees.findIndex((emp) => emp.id === userId)
      if (index !== -1) {
        this.employees[index].status = newStatus
        if (newStatus.value === 'dismissed') {
          this.employees[index].fired_at = Math.floor(Date.now() / 1000);
        }
        this.saveEmployeesToLocalStorage()
      }
    })
  }

  // Метод для обновления сотрудника
  async updateUser(userId: number, updatedData: UpdateEmployeeData) {
    try {
      const response = await ky.put(`${this.host}/api/v1/users/${userId}`, {
        json: updatedData,
      })
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const responseData = (await response.json()) as ApiResponse<Employee> 
      runInAction(() => {
        this.employees = this.employees.map((emp) =>
          emp.id === userId ? { ...emp, ...responseData.data } : emp,
        )
        this.saveEmployeesToLocalStorage()
      })
      console.log('Сотрудник успешно обновлен:', responseData.data)
    } catch (error: unknown) {
      let errorMessage =
        'Произошла неизвестная ошибка при обновлении сотрудника'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при обновлении сотрудника:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }

  async getRoles() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/roles')
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const data = (await response.json()) as ApiResponse<{ items: any[] }>
      runInAction(() => {
        this.roles = data.data.items
      })
    } catch (error: unknown) {
      let errorMessage = 'Произошла неизвестная ошибка при получении ролей'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при получении ролей:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }

  async getDepartments() {
    try {
      const response = await ky.get(
        'https://api.mock.sb21.ru/api/v1/departments',
      )
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const data = (await response.json()) as ApiResponse<{
        items: Department[]
      }>
      runInAction(() => {
        this.departments = data.data.items
      })
    } catch (error: unknown) {
      let errorMessage =
        'Произошла неизвестная ошибка при получении подразделений'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при получении подразделений:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }

  async getPositions() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/positions')
      if (!response.ok) {
        const errorBody = await response.text()
        let apiErrorMessage = `Ошибка: ${response.status} - ${response.statusText}`
        try {
          const jsonError = JSON.parse(errorBody)
          if (jsonError.message) {
            apiErrorMessage = jsonError.message
          } else if (jsonError.errors) {
            apiErrorMessage =
              'Ошибка: ' +
              Object.entries(jsonError.errors)
                .map(
                  ([field, messages]) =>
                    `${field}: ${(messages as string[]).join(', ')}`,
                )
                .join('; ')
          }
        } catch (parseError) {
          /* ignore */
        }
        throw new Error(apiErrorMessage)
      }
      const data = (await response.json()) as ApiResponse<{ items: Position[] }>
      runInAction(() => {
        this.positions = data.data.items
      })
    } catch (error: unknown) {
      let errorMessage = 'Произошла неизвестная ошибка при получении должностей'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      console.error('Ошибка при получении должностей:', error)
      alert(`Ошибка: ${errorMessage}`)
    }
  }
}

export const employeeStore = new EmployeeStore()
