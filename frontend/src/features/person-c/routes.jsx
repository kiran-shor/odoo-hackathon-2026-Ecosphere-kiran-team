/* eslint-disable react-refresh/only-export-components */
const TemporaryPage = ({ title }) => (
  <main className="page">
    <section className="page-header">
      <p className="eyebrow">Person C</p>
      <h1>{title}</h1>
    </section>
    <p className="muted">This route is reserved for the Person C feature branch.</p>
  </main>
);

export const personCRoutes = [
  {
    path: '/activities',
    element: <TemporaryPage title="CSR Activities" />,
    label: 'CSR Activities',
  },
  {
    path: '/participation',
    element: <TemporaryPage title="Participation" />,
    label: 'Participation',
  },
  {
    path: '/leaderboard',
    element: <TemporaryPage title="Leaderboard" />,
    label: 'Leaderboard',
  },
  {
    path: '/rewards',
    element: <TemporaryPage title="Rewards" />,
    label: 'Rewards',
  },
];
