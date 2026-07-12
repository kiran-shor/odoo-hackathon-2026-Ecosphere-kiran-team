import PageContainer from '../components/PageContainer';
import ScoreGauge from '../components/ScoreGauge';

export default function Dashboard() {
  return (
    <PageContainer eyebrow="Dashboard" title="ESG Performance">
      <section className="score-grid">
        <ScoreGauge label="Overall ESG" value={0} />
        <ScoreGauge label="Environmental" value={0} />
        <ScoreGauge label="Social" value={0} />
        <ScoreGauge label="Governance" value={0} />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Department Score Comparison</h2>
          <p>Placeholder for GET /scores/departments.</p>
        </div>
      </section>
    </PageContainer>
  );
}
