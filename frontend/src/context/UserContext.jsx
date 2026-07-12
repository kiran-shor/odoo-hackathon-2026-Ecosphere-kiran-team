import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import client from '../api/client';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [employees, setEmployees] = useState([]);
  const [currentEmployeeId, setCurrentEmployeeId] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      const { data } = await client.get('/employees');
      setEmployees(data);

      setCurrentEmployeeId((selectedId) => selectedId || data[0]?.id || null);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshCurrentEmployee = useCallback(async () => {
    if (!currentEmployeeId) return;

    try {
      const { data } = await client.get(`/employees/${currentEmployeeId}`);
      setCurrentEmployee(data);
    } catch (err) {
      console.error(err);
      setCurrentEmployee(null);
    }
  }, [currentEmployeeId]);

  useEffect(() => {
    async function loadInitialEmployees() {
      await loadEmployees();
    }

    loadInitialEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    async function loadCurrentEmployee() {
      await refreshCurrentEmployee();
    }

    loadCurrentEmployee();
  }, [refreshCurrentEmployee]);

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
