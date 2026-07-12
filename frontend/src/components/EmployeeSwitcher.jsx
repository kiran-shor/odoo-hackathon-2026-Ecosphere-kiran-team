import { useUser } from '../context/UserContext';

export default function EmployeeSwitcher() {
  const { employees, currentEmployeeId, setCurrentEmployeeId } = useUser();

  return (
    <label className="field-inline">
      <span>Employee</span>
      <select
        value={currentEmployeeId || ''}
        onChange={(event) => setCurrentEmployeeId(Number(event.target.value))}
      >
        {employees.length === 0 && <option value="">No employees</option>}
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
    </label>
  );
}
