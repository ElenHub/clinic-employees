import { useState, Suspense, lazy } from 'react'
import EmployeeList from './components/EmployeeList'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import styles from './App.module.css'
import Spinner from './components/Spinner';
import { Employee } from './stores/utils/types';

const EmployeeForm = lazy(() => import('./components/EmployeeForm'));


function App() {
  const [isFormVisible, setFormVisible] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const openForm = (employee: Employee | null) => {
    setSelectedEmployee(employee);
    setFormVisible(true);
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

