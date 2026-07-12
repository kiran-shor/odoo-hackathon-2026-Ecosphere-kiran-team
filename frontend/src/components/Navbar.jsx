import { NavLink } from 'react-router-dom';
import EmployeeSwitcher from './EmployeeSwitcher';
import { useUser } from '../context/UserContext';

export default function Navbar({ routes }) {
  const { currentEmployee, isAdmin, setIsAdmin } = useUser();

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">E</span>
        <div>
          <strong>EcoSphere Lite</strong>
          <span>ESG workspace</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
            end={route.path === '/'}
          >
            {route.label}
          </NavLink>
        ))}
      </nav>

      <div className="header-tools">
        <EmployeeSwitcher />
        <label className="admin-toggle">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(event) => setIsAdmin(event.target.checked)}
          />
          <span>Admin</span>
        </label>
        {currentEmployee && (
          <span className="points-pill">{currentEmployee.points ?? 0} pts</span>
        )}
      </div>
    </header>
  );
}
