import { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadEmployees() {
    const { data } = await client.get('/employees');
    setEmployees(data);

    if (!currentEmployeeId && data.length > 0) {
      setCurrentEmployeeId(data[0].id);
    }
  }

  async function refreshCurrentEmployee() {
    if (!currentEmployeeId) return;

    const { data } = await client.get(`/employees/${currentEmployeeId}`);
    setCurrentEmployee(data);
  }

  useEffect(() => {
    loadEmployees().catch(console.error);
  }, []);

  useEffect(() => {
    refreshCurrentEmployee().catch(console.error);
  }, [currentEmployeeId]);

  return (
    <UserContext.Provider
      value={{
        employees,
        currentEmployeeId,
        setCurrentEmployeeId,
        currentEmployee,
        refreshCurrentEmployee,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}
