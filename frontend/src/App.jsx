import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CarbonEntry from './pages/CarbonEntry';
import Policies from './pages/Policies';
import Reports from './pages/Reports';
import Goals from './pages/Goals';
import { personCRoutes } from './features/person-c/routes';

const personBRoutes = [
  { path: '/', element: <Dashboard />, label: 'Dashboard', group: 'Overview' },
  { path: '/carbon', element: <CarbonEntry />, label: 'Carbon', group: 'Measure' },
  { path: '/reports', element: <Reports />, label: 'Reports', group: 'Measure' },
  { path: '/goals', element: <Goals />, label: 'Goals', group: 'Measure' },
  { path: '/policies', element: <Policies />, label: 'Policies', group: 'Govern' },
];

export default function App() {
  const allRoutes = [...personBRoutes, ...personCRoutes];

  return (
    <UserProvider>
      <BrowserRouter>
        <AppShell routes={allRoutes} />
      </BrowserRouter>
    </UserProvider>
  );
}

function AppShell({ routes }) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="app-shell">
      <Navbar routes={routes} />
      <div className="app-main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
