import { makeAutoObservable, runInAction, toJS } from 'mobx'
import ky from 'ky'
import { Employee } from './utils/types'

export class EmployeeStore {
  employees: Employee[] = []
  loading = false
  lastPage = 1
  currentPage = 1
  host = import.meta.env.VITE_API_HOST

  constructor() {
    makeAutoObservable(this)
    this.loadEmployeesFromLocalStorage()
  }

  async createUser(newEmployee) {
    try {
      const response = await ky.post(`${this.host}/api/v1/users`, {
        json: newEmployee,
      })

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      runInAction(() => {
        if (!this.employees.some((emp) => emp.id === data.data.id)) {
          this.employees.push(data.data) // Добавляем нового сотрудника
          this.saveEmployeesToLocalStorage() // Сохраняем в localStorage
        }
        console.log('Сотрудник успешно добавлен:', data)
      })
    } catch (error) {
      console.error('Ошибка при добавлении сотрудника:', error)
    }
  }

  saveEmployeesToLocalStorage() {
    localStorage.setItem('employees', JSON.stringify(toJS(this.employees)))
    localStorage.setItem('currentPage', this.currentPage.toString()) // Сохраняем текущую страницу
    console.log('Сохраненные сотрудники в localStorage:', toJS(this.employees))
  }

  loadEmployeesFromLocalStorage() {
    const localStorageEmployees = localStorage.getItem('employees')
    const localStorageCurrentPage = localStorage.getItem('currentPage')

    if (localStorageEmployees) {
      try {
        this.employees = JSON.parse(localStorageEmployees)
        console.log(
          'Загруженные сотрудники из localStorage:',
          toJS(this.employees),
        )
      } catch (error) {
        console.error('Ошибка при парсинге сотрудников из localStorage:', error)
      }
    }

    if (localStorageCurrentPage) {
      this.currentPage = parseInt(localStorageCurrentPage, 10) || 1 // Устанавливаем текущую страницу
    }
  }

  async fetchEmployees(
    page = this.currentPage,
    perPage = 5,
    showFired = false,
    showBlocked = false,
  ) {
    this.loading = true // Устанавливаем статус загрузки
    try {
      const response = await fetch(
        `${this.host}/api/v1/users?per_page=${perPage}&page=${page}${showFired ? '&filter[status]=dismissed' : ''}${showBlocked ? '&filter[status]=blocked' : ''}`,
      )
      if (!response.ok) {
        throw new Error('Ошибка при загрузке данных')
      }
      const data = await response.json()
      runInAction(() => {
        this.employees = data.data.items
        this.lastPage = Math.min(data.data.pagination.last_page, 10)
        this.saveEmployeesToLocalStorage() // Сохраняем в localStorage
        this.loading = false
      })
    } catch (error) {
      alert(`Ошибка: ${error.message}`)
      console.error(error)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async deleteEmployee(userId) {
    try {
      await ky.delete(`${this.host}/api/v1/users/${userId}`)
      runInAction(() => {
        this.employees = this.employees.filter((emp) => emp.id !== userId)
        this.saveEmployeesToLocalStorage() // Обновляем localStorage после удаления
      })
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error)
    }
  }

  async updateEmployeeStatus(userId, newStatus) {
    runInAction(() => {
      const employeeIndex = this.employees.findIndex((emp) => emp.id === userId)
      if (employeeIndex !== -1) {
        this.employees[employeeIndex].status = newStatus // Обновляем статус
        this.saveEmployeesToLocalStorage() // Сохраняем изменения в локальное хранилище
      }
    })
  }

  async updateUser(userId, updatedData) {
    try {
      const response = await ky.put(`${this.host}/api/v1/users/${userId}`, {
        json: updatedData,
      })

      if (!response.ok) {
        throw new Error('Ошибка при обновлении данных')
      }

      const data = await response.json() // Получаем обновленные данные

      runInAction(() => {
        this.employees = this.employees.map(
          (emp) => (emp.id === userId ? { ...emp, ...data.data } : emp), // Обновляем данные
        )
        this.saveEmployeesToLocalStorage() // Сохранение обновленных данных в Local Storage
      })
    } catch (error) {
      console.error('Ошибка при обновлении сотрудника:', error)
    }
  }

  async getRoles() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/roles')
      const data = await response.json()
      runInAction(() => {
        this.roles = data.data.items
        console.log('Полученные роли:', this.roles)
      })
    } catch (error) {
      console.error('Ошибка при получении ролей:', error)
    }
  }

  async getDepartments() {
    try {
      const response = await ky.get(
        'https://api.mock.sb21.ru/api/v1/departments',
      )
      const data = await response.json()
      runInAction(() => {
        this.departments = data.data.items
        console.log('Полученные подразделения:', this.departments)
      })
    } catch (error) {
      console.error('Ошибка при получении подразделений:', error)
    }
  }
  async getPositions() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/positions')
      const data = await response.json()
      runInAction(() => {
        this.positions = data.data.items
        console.log('Полученные должности:', this.positions)
      })
    } catch (error) {
      console.error('Ошибка при получении должностей:', error)
    }
  }
}

export const employeeStore = new EmployeeStore();

