import { useEffect, useState } from 'react';
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
import { getErrorMessage } from '../utils/errors';

export default function Dashboard() {
  const [overall, setOverall] = useState(null);
  const [departmentScores, setDepartmentScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      setError('');

      try {
        const [overallResponse, departmentsResponse] = await Promise.all([
          client.get('/scores/overall'),
          client.get('/scores/departments'),
        ]);

        setOverall(overallResponse.data);
        setDepartmentScores(departmentsResponse.data);
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
                  fill="#2f855a"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
