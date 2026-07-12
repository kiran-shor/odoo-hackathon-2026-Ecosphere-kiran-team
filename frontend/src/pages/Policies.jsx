import { useUser } from '../context/UserContext';
import PageContainer from '../components/PageContainer';

export default function Policies() {
  const { isAdmin } = useUser();

  return (
    <PageContainer eyebrow="Governance" title="Policies">
      {isAdmin && (
        <section className="panel form-panel">
          <div className="panel-heading">
            <h2>Create Policy</h2>
            <p>Scaffold for POST /policies.</p>
          </div>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading">
          <h2>Employee Acknowledgements</h2>
          <p>Placeholder for GET /employees/:id/acknowledgement-status.</p>
        </div>
      </section>
    </PageContainer>
  );
}
