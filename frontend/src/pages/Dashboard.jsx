import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import client from '../api/client';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import ScoreGauge from '../components/ScoreGauge';
import EmissionTrendChart from '../components/EmissionTrendChart';
import { getErrorMessage } from '../utils/errors';

export default function Dashboard() {
  const [overall, setOverall] = useState(null);
  const [departmentScores, setDepartmentScores] = useState([]);
  const [trend, setTrend] = useState([]);
  const [atRiskGoals, setAtRiskGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setError('');

      try {
        const [overallResponse, departmentsResponse, trendResponse, goalsResponse] = await Promise.all([
          client.get('/scores/overall'),
          client.get('/scores/departments'),
          client.get('/carbon-transactions/trend', { params: { groupBy: 'month' } }),
          client.get('/environmental-goals'),
        ]);

        setOverall(overallResponse.data);
        setDepartmentScores(departmentsResponse.data);
        setTrend(trendResponse.data);
        setAtRiskGoals(
          goalsResponse.data.filter(
            (goal) => goal.status === 'active' && ['exceeded', 'missed'].includes(goal.progressStatus)
          )
        );
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load dashboard scores'));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState label="Loading ESG dashboard..." />;
  }

  return (
    <PageContainer eyebrow="Dashboard" title="ESG Performance">
      <ErrorMessage message={error} />

      <section className="score-grid" aria-label="ESG score summary">
        <ScoreGauge label="Overall ESG" value={overall?.overallScore} />
        <ScoreGauge label="Environmental" value={overall?.environmentalAvg} />
        <ScoreGauge label="Social" value={overall?.socialAvg} />
        <ScoreGauge label="Governance" value={overall?.governanceAvg} />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Department Score Comparison</h2>
          <p>Total ESG score by department</p>
        </div>

        {departmentScores.length === 0 ? (
          <p className="empty-state">No department scores available yet.</p>
        ) : (
          <div className="chart-frame">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={departmentScores}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar
                  dataKey="totalScore"
                  fill="#256b4a"
                  radius={[7, 7, 2, 2]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="dashboard-insights">
        <section className="panel trend-panel">
          <div className="panel-heading">
            <h2>Emission trend</h2>
            <p>Recorded CO2e by month</p>
          </div>
          <EmissionTrendChart data={trend} />
        </section>

        <section className="panel goal-alerts">
          <div className="panel-heading">
            <h2>Goals needing attention</h2>
            <p>{atRiskGoals.length ? `${atRiskGoals.length} outside target` : 'All active goals are within target'}</p>
          </div>
          {atRiskGoals.length ? (
            <div className="goal-alert-list">
              {atRiskGoals.map((goal) => (
                <div className="goal-alert" key={goal.id}>
                  <span>{goal.departmentName}</span>
                  <strong>{goal.metricLabel}</strong>
                  <small>{goal.progressPercent}% · {goal.progressStatus}</small>
                </div>
              ))}
            </div>
          ) : <p className="empty-state">No goals need action right now.</p>}
          <Link className="text-link" to="/goals">View environmental goals →</Link>
        </section>
      </section>
    </PageContainer>
  );
}
