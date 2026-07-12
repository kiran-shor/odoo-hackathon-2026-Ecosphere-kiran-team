import CSRActivities from './pages/CSRActivities';
import Participation from './pages/Participation';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';

export const personCRoutes = [
  {
    path: '/activities',
    element: <CSRActivities />,
    label: 'CSR Activities',
  },
  {
    path: '/participation',
    element: <Participation />,
    label: 'Participation',
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
    label: 'Leaderboard',
  },
  {
    path: '/rewards',
    element: <Rewards />,
    label: 'Rewards',
  },
];
