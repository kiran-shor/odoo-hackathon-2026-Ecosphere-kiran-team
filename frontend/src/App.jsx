import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CarbonEntry from './pages/CarbonEntry';
import Policies from './pages/Policies';
import Reports from './pages/Reports';
import { personCRoutes } from './features/person-c/routes';

const personBRoutes = [
  { path: '/', element: <Dashboard />, label: 'Dashboard' },
  { path: '/carbon', element: <CarbonEntry />, label: 'Carbon' },
  { path: '/policies', element: <Policies />, label: 'Policies' },
  { path: '/reports', element: <Reports />, label: 'Reports' },
];

export default function App() {
  const allRoutes = [...personBRoutes, ...personCRoutes];

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar routes={allRoutes} />
        <Routes>
          {allRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
