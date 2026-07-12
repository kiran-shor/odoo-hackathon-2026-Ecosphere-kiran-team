import PageContainer from '../components/PageContainer';

export default function Reports() {
  return (
    <PageContainer eyebrow="Reports" title="ESG Summary">
      <section className="panel">
        <div className="panel-heading">
          <h2>Summary Table</h2>
          <p>Placeholder for GET /reports/esg-summary and CSV export.</p>
        </div>
      </section>
    </PageContainer>
  );
}
