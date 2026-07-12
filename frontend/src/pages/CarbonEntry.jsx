import { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import DeptEmissionsChart from '../components/DeptEmissionsChart';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import { getErrorMessage } from '../utils/errors';

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export default function CarbonEntry() {
  const [departments, setDepartments] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);
  const [form, setForm] = useState({
    departmentId: '',
    emissionFactorId: '',
    quantity: '',
    date: getTodayDate(),
  });
  const [lastCalculatedCO2, setLastCalculatedCO2] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedFactor = useMemo(
    () =>
      emissionFactors.find(
        (factor) => factor.id === Number(form.emissionFactorId)
      ),
    [emissionFactors, form.emissionFactorId]
  );

  const canSubmit =
    Boolean(form.departmentId) &&
    Boolean(form.emissionFactorId) &&
    Number(form.quantity) > 0 &&
    Boolean(form.date);

  async function loadTransactions() {
    const { data } = await client.get('/carbon-transactions');
    setTransactions(data);
  }

  async function loadSummary() {
    const { data } = await client.get('/carbon-transactions/summary');
    setSummary(data);
  }

  useEffect(() => {
    async function loadCarbonPage() {
      setIsLoading(true);
      setError('');

      try {
        const [
          departmentsResponse,
          factorsResponse,
          transactionsResponse,
          summaryResponse,
        ] = await Promise.all([
          client.get('/departments'),
          client.get('/emission-factors'),
          client.get('/carbon-transactions'),
          client.get('/carbon-transactions/summary'),
        ]);

        setDepartments(departmentsResponse.data);
        setEmissionFactors(factorsResponse.data);
        setTransactions(transactionsResponse.data);
        setSummary(summaryResponse.data);
        setForm((currentForm) => ({
          ...currentForm,
          departmentId:
            currentForm.departmentId || departmentsResponse.data[0]?.id || '',
          emissionFactorId:
            currentForm.emissionFactorId || factorsResponse.data[0]?.id || '',
        }));
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load carbon data'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCarbonPage();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    setIsSubmitting(true);
    setError('');
    setLastCalculatedCO2(null);

    try {
      const { data } = await client.post('/carbon-transactions', {
        departmentId: Number(form.departmentId),
        emissionFactorId: Number(form.emissionFactorId),
        quantity: Number(form.quantity),
        date: form.date,
      });

      setLastCalculatedCO2(data.co2Calculated);
      setForm((currentForm) => ({ ...currentForm, quantity: '' }));
      await Promise.all([loadTransactions(), loadSummary()]);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to save carbon transaction'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading carbon workspace..." />;
  }

  return (
    <PageContainer eyebrow="Environmental" title="Carbon Entry">
      <ErrorMessage message={error} />

      <section className="two-column">
        <form className="panel form-panel" onSubmit={handleSubmit}>
          <div className="panel-heading">
            <h2>Record Transaction</h2>
            <p>CO2 totals are calculated by the backend.</p>
          </div>

          <label>
            Department
            <select
              value={form.departmentId}
              onChange={(event) =>
                setForm({ ...form, departmentId: event.target.value })
              }
            >
              {departments.length === 0 && (
                <option value="">No departments available</option>
              )}
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Activity
            <select
              value={form.emissionFactorId}
              onChange={(event) =>
                setForm({ ...form, emissionFactorId: event.target.value })
              }
            >
              {emissionFactors.length === 0 && (
                <option value="">No emission factors available</option>
              )}
              {emissionFactors.map((factor) => (
                <option key={factor.id} value={factor.id}>
                  {factor.activityType} ({factor.unit})
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity{selectedFactor ? ` (${selectedFactor.unit})` : ''}
            <input
              min="0"
              step="0.01"
              type="number"
              value={form.quantity}
              onChange={(event) =>
                setForm({ ...form, quantity: event.target.value })
              }
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => setForm({ ...form, date: event.target.value })}
            />
          </label>

          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save transaction'}
          </button>

          {lastCalculatedCO2 !== null && (
            <p className="success-message">
              Server calculated {Number(lastCalculatedCO2).toFixed(2)} CO2.
            </p>
          )}
        </form>

        <section className="panel">
          <div className="panel-heading">
            <h2>Department Emissions</h2>
            <p>Total CO2 by department</p>
          </div>
          {summary.length === 0 ? (
            <p className="empty-state">No emissions summary available yet.</p>
          ) : (
            <DeptEmissionsChart data={summary} />
          )}
        </section>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Recent Transactions</h2>
          <p>{transactions.length} records</p>
        </div>

        <DataTable
          emptyMessage="No carbon transactions available yet."
          rows={transactions}
          columns={[
            ['date', 'Date'],
            ['departmentName', 'Department'],
            ['activityType', 'Activity'],
            ['quantity', 'Quantity'],
            ['co2Calculated', 'CO2'],
          ]}
        />
      </section>
    </PageContainer>
  );
}

function DataTable({ columns, rows, emptyMessage }) {
  if (rows.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {columns.map(([key, label]) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map(([key]) => (
                <td key={key}>{formatTransactionCell(row, key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTransactionCell(row, key) {
  if (key === 'departmentName') {
    return row.departmentName || row.department?.name || row.departmentId || '-';
  }

  if (key === 'activityType') {
    return (
      row.activityType ||
      row.emissionFactor?.activityType ||
      row.emissionFactorId ||
      '-'
    );
  }

  return row[key] ?? '-';
}
