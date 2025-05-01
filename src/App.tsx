import React, { useState, Suspense, lazy } from 'react'
import EmployeeList from './components/EmployeeList'
import { Employee } from './stores/utils/types'
import EmployeeModal from './components/EmployeeModal'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import styles from './App.module.css'
import Spinner from './components/Spinner';

const EmployeeForm = lazy(() => import('./components/EmployeeForm'));

function App() {
  const [isFormVisible, setFormVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const openForm = (employee = null) => {
    setSelectedEmployee(employee)
    setFormVisible(true)
  }

  const closeForm = () => {
    setFormVisible(false)
  }

  return (
    <Suspense fallback={<Spinner />}>
          <div className={styles.appContainer}>
            <Sidebar />
            <div className={styles.mainContent}>
              <Header />
              {!isFormVisible && (
                <EmployeeList
                  onEditEmployee={openForm}
                  onAddEmployee={() => openForm()}
                />
              )}
              {isFormVisible && (
                <EmployeeForm
                  closeForm={closeForm}
                  employee={selectedEmployee}
            onBack={() => {
              setFormVisible(false)
            }}
                />
              )}
            </div>
          </div>
        </Suspense>
  )
}

export default App

