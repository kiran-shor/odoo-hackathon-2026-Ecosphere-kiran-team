import { NavLink } from 'react-router-dom';
import ApiModeToggle from './ApiModeToggle';
import EmployeeSwitcher from './EmployeeSwitcher';
import { useUser } from '../context/UserContext';

const routeAccents = {
  '/': 'D',
  '/carbon': 'C',
  '/policies': 'G',
  '/reports': 'R',
  '/activities': 'A',
  '/participation': 'P',
  '/leaderboard': 'L',
  '/rewards': 'W',
};

export default function Navbar({ routes }) {
  const { currentEmployee, isAdmin, setIsAdmin } = useUser();

  return (
    <aside className="app-sidebar">
      <div className="brand">
        <span className="brand-mark">E</span>
        <div>
          <strong>EcoSphere Lite</strong>
          <span>ESG operations hub</span>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">Workspace</span>
        <nav className="nav-links" aria-label="Main navigation">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={route.path === '/'}
            >
              <span className="nav-icon">{routeAccents[route.path] || 'E'}</span>
              <span>{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="header-tools">
        <span className="sidebar-label">Controls</span>
        <ApiModeToggle />
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
          <span className="points-pill">
            <strong>{currentEmployee.points ?? 0}</strong>
            <span>points</span>
          </span>
        )}
      </div>
    </aside>
  );
}
