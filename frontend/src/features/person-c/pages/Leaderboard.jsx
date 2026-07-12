import { useEffect, useState } from 'react';
import client from '../../../api/client';
import { useUser } from '../../../context/UserContext';
import LoadingState from '../../../components/LoadingState';
import ErrorMessage from '../../../components/ErrorMessage';
import BadgeCard from '../components/BadgeCard';
import { mockLeaderboard } from '../mocks/data';

function getErrorMessage(err) {
  return err.response?.data?.message || 'Something went wrong';
}

export default function Leaderboard() {
  const { currentEmployeeId } = useUser();
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true);
      setError('');

      try {
        const { data } = await client.get('/leaderboard');
        setLeaderboard(data);
      } catch (err) {
        setError(getErrorMessage(err));
        setLeaderboard(mockLeaderboard);
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (loading) {
    return <LoadingState label="Loading leaderboard..." />;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Gamification</p>
          <h1>Leaderboard</h1>
        </div>
      </section>

      <ErrorMessage message={error} />

      <section className="panel">
        <div className="panel-heading">
          <h2>Top Employees</h2>
          <p>Backend-ranked employees by points.</p>
        </div>

        {leaderboard.length === 0 ? (
          <p className="empty-state">No leaderboard data available yet.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Points</th>
                  <th>Badges</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((employee, index) => {
                  const isSelected =
                    Number(employee.id) === Number(currentEmployeeId);

                  return (
                    <tr
                      key={employee.id}
                      style={isSelected ? { background: '#edf8f1' } : undefined}
                    >
                      <td>#{index + 1}</td>
                      <td>{employee.name}</td>
                      <td>
                        {employee.departmentName ||
                          `Department #${employee.departmentId}`}
                      </td>
                      <td>{employee.points ?? 0}</td>
                      <td>
                        <div className="policy-actions">
                          {employee.badges?.length > 0 ? (
                            employee.badges.map((badge, badgeIndex) => (
                              <BadgeCard
                                key={badge.id || badge.name || badgeIndex}
                                badge={badge}
                              />
                            ))
                          ) : (
                            <span className="muted">No badges</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
