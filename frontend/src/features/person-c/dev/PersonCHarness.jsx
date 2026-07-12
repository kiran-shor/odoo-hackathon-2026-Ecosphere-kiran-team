import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { personCRoutes } from '../routes';

export default function PersonCHarness() {
  return (
    <BrowserRouter>
      <nav>
        {personCRoutes.map((route) => (
          <Link key={route.path} to={route.path}>
            {route.label}
          </Link>
        ))}
      </nav>

      <Routes>
        {personCRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
