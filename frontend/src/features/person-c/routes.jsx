import CSRActivities from './pages/CSRActivities';
import Participation from './pages/Participation';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';

export const personCRoutes = [
  {
    path: '/activities',
    element: <CSRActivities />,
    label: 'CSR Activities',
    group: 'Engage',
  },
  {
    path: '/participation',
    element: <Participation />,
    label: 'Participation',
    group: 'Engage',
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />,
    label: 'Leaderboard',
    group: 'Engage',
  },
  {
    path: '/rewards',
    element: <Rewards />,
    label: 'Rewards',
    group: 'Engage',
  },
];
