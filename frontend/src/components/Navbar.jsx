import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import ApiModeToggle from './ApiModeToggle';
import EmployeeSwitcher from './EmployeeSwitcher';
import { useUser } from '../context/UserContext';

const groupOrder = ['Overview', 'Measure', 'Govern', 'Engage'];

export default function Navbar({ routes }) {
  const { currentEmployee, isAdmin, setIsAdmin } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const groupedRoutes = useMemo(
    () =>
      groupOrder
        .map((group) => ({
          group,
          routes: routes.filter((route) => route.group === group),
        }))
        .filter(({ routes: groupRoutes }) => groupRoutes.length),
    [routes]
  );

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <header className="mobile-header">
        <Brand />
        <button
          className="menu-button secondary-button"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? '×' : '☰'}</span>
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            className="nav-backdrop"
            aria-label="Close navigation"
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        id="primary-navigation"
        className={`app-sidebar ${isOpen ? 'is-open' : ''}`}
      >
        <Brand />

        <nav className="nav-groups" aria-label="Main navigation">
          {groupedRoutes.map(({ group, routes: groupRoutes }) => (
            <section className="sidebar-section" key={group}>
              <span className="sidebar-label">{group}</span>
              <div className="nav-links">
                {groupRoutes.map((route) => (
                  <NavLink
                    key={route.path}
                    to={route.path}
                    className={({ isActive }) => (isActive ? 'active' : undefined)}
                    end={route.path === '/'}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="nav-marker" aria-hidden="true" />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <div className="header-tools">
          <div className="profile-summary">
            <span className="profile-avatar" aria-hidden="true">
              {currentEmployee?.name?.charAt(0) || 'E'}
            </span>
            <span>
              <strong>{currentEmployee?.name || 'EcoSphere user'}</strong>
              <small>{isAdmin ? 'Admin workspace' : 'Employee workspace'}</small>
            </span>
            {currentEmployee && (
              <span className="points-pill">
                <strong>{currentEmployee.points ?? 0}</strong>
                <span>pts</span>
              </span>
            )}
          </div>
          <EmployeeSwitcher />
          <div className="utility-row">
            <ApiModeToggle />
            <label className="admin-toggle">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(event) => setIsAdmin(event.target.checked)}
              />
              <span>Admin mode</span>
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <div>
        <strong>EcoSphere</strong>
        <span>By Green Matters</span>
      </div>
    </div>
  );
}
