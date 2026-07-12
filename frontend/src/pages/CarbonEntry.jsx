import DeptEmissionsChart from '../components/DeptEmissionsChart';
import PageContainer from '../components/PageContainer';

export default function CarbonEntry() {
  return (
    <PageContainer eyebrow="Environmental" title="Carbon Entry">
      <section className="two-column">
        <form className="panel form-panel">
          <div className="panel-heading">
            <h2>Record Transaction</h2>
            <p>Scaffold for POST /carbon-transactions.</p>
          </div>

          <label>
            Department
            <select disabled>
              <option>Connect departments</option>
            </select>
          </label>

          <label>
            Activity
            <select disabled>
              <option>Connect emission factors</option>
            </select>
          </label>

          <label>
            Quantity
            <input type="number" disabled placeholder="0" />
          </label>

          <label>
            Date
            <input type="date" disabled />
          </label>

          <button type="button" disabled>
            Save transaction
          </button>
        </form>

        <section className="panel">
          <div className="panel-heading">
            <h2>Department Emissions</h2>
            <p>Placeholder for GET /carbon-transactions/summary.</p>
          </div>
          <DeptEmissionsChart data={[]} />
        </section>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Recent Transactions</h2>
          <p>Placeholder for GET /carbon-transactions.</p>
        </div>
      </section>
    </PageContainer>
  );
}
