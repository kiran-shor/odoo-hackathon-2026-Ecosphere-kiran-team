import { useEffect, useState } from 'react';
import client from '../api/client';
import EmissionTrendChart from '../components/EmissionTrendChart';
import ErrorMessage from '../components/ErrorMessage';
import GoalProgressCard from '../components/GoalProgressCard';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import { useUser } from '../context/UserContext';
import { getErrorMessage } from '../utils/errors';

const emptyForm = {
  departmentId: '', emissionFactorId: '', metricLabel: 'Total Carbon Emissions',
  targetValue: '', unit: 'kg CO2e', startDate: '', deadline: '',
};

async function fetchGoalData(departmentId) {
  const params = departmentId ? { departmentId } : {};
  const [goalsResponse, trendResponse] = await Promise.all([
    client.get('/environmental-goals', { params }),
    client.get('/carbon-transactions/trend', { params: { ...params, groupBy: 'month' } }),
  ]);
  return { goals: goalsResponse.data, trend: trendResponse.data };
}

export default function Goals() {
  const { isAdmin } = useUser();
  const [goals, setGoals] = useState([]);
  const [trend, setTrend] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [emissionFactors, setEmissionFactors] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGoalsPage() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchGoalData(departmentId);
        setGoals(data.goals);
        setTrend(data.trend);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load environmental goals'));
      } finally {
        setLoading(false);
      }
    }
    loadGoalsPage();
  }, [departmentId]);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [departmentsResponse, factorsResponse] = await Promise.all([
          client.get('/departments'), client.get('/emission-factors'),
        ]);
        setDepartments(departmentsResponse.data);
        setEmissionFactors(factorsResponse.data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load goal options'));
      }
    }
    loadCatalogs();
  }, []);

  function selectFactor(value) {
    const factor = emissionFactors.find((item) => String(item.id) === value);
    setForm((current) => ({
      ...current,
      emissionFactorId: value,
      metricLabel: factor ? `${factor.activityType} Usage` : 'Total Carbon Emissions',
      unit: factor?.unit || 'kg CO2e',
    }));
  }

  async function createGoal(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await client.post('/environmental-goals', {
        ...form,
        departmentId: Number(form.departmentId),
        emissionFactorId: form.emissionFactorId ? Number(form.emissionFactorId) : null,
        targetValue: Number(form.targetValue),
      });
      setForm(emptyForm);
      setShowForm(false);
      const data = await fetchGoalData(departmentId);
      setGoals(data.goals);
      setTrend(data.trend);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create environmental goal'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer
      eyebrow="Environmental"
      title="Department Goals"
      actions={isAdmin && <button type="button" onClick={() => setShowForm((open) => !open)}>{showForm ? 'Close form' : 'New goal'}</button>}
    >
      <ErrorMessage message={error} />
      <section className="goal-toolbar panel">
        <label>Department
          <select value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
            <option value="">All departments</option>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
        </label>
        <p>Track resource caps against recorded environmental activity.</p>
      </section>

      {isAdmin && showForm && (
        <form className="panel form-panel goal-form" onSubmit={createGoal}>
          <div className="panel-heading"><h2>Create environmental goal</h2><p>Progress updates automatically from carbon transactions.</p></div>
          <label>Department<select required value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })}><option value="">Select department</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
          <label>Measurement<select value={form.emissionFactorId} onChange={(event) => selectFactor(event.target.value)}><option value="">Total carbon emissions</option>{emissionFactors.map((factor) => <option key={factor.id} value={factor.id}>{factor.activityType} ({factor.unit})</option>)}</select></label>
          <label>Goal label<input required value={form.metricLabel} onChange={(event) => setForm({ ...form, metricLabel: event.target.value })} /></label>
          <label>Target ({form.unit})<input required min="0.01" step="0.01" type="number" value={form.targetValue} onChange={(event) => setForm({ ...form, targetValue: event.target.value })} /></label>
          <label>Unit<input required value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })} /></label>
          <label>Start date<input required type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label>
          <label>Deadline<input required min={form.startDate || undefined} type="date" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} /></label>
          <button disabled={submitting} type="submit">{submitting ? 'Saving…' : 'Save goal'}</button>
        </form>
      )}

      {loading ? <LoadingState label="Loading environmental goals…" /> : (
        <>
          <section className="goals-grid" aria-label="Environmental goals">
            {goals.map((goal) => <GoalProgressCard key={goal.id} goal={goal} />)}
            {!goals.length && <div className="panel"><p className="empty-state">No goals are set for this selection yet.</p></div>}
          </section>
          <section className="panel trend-panel"><div className="panel-heading"><h2>Emission trend</h2><p>Recorded CO2e by month</p></div><EmissionTrendChart data={trend} /></section>
        </>
      )}
    </PageContainer>
  );
}
