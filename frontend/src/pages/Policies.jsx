import { useCallback, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import { useUser } from '../context/UserContext';
import { getErrorMessage } from '../utils/errors';

export default function Policies() {
  const { currentEmployeeId, isAdmin } = useUser();
  const [policies, setPolicies] = useState([]);
  const [acknowledgements, setAcknowledgements] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingPolicy, setIsSubmittingPolicy] = useState(false);
  const [acknowledgingPolicyId, setAcknowledgingPolicyId] = useState(null);
  const [error, setError] = useState('');

  const acknowledgementByPolicyId = useMemo(
    () =>
      acknowledgements.reduce((lookup, acknowledgement) => {
        lookup[acknowledgement.policyId] = acknowledgement;
        return lookup;
      }, {}),
    [acknowledgements]
  );

  const loadPolicies = useCallback(async () => {
    const { data } = await client.get('/policies');
    setPolicies(data);
  }, []);

  const loadAcknowledgementStatus = useCallback(async () => {
    if (!currentEmployeeId) {
      setAcknowledgements([]);
      return;
    }

    const { data } = await client.get(
      `/employees/${currentEmployeeId}/acknowledgement-status`
    );
    setAcknowledgements(data);
  }, [currentEmployeeId]);

  useEffect(() => {
    async function loadGovernancePage() {
      setIsLoading(true);
      setError('');

      try {
        await Promise.all([loadPolicies(), loadAcknowledgementStatus()]);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load policies'));
      } finally {
        setIsLoading(false);
      }
    }

    loadGovernancePage();
  }, [loadAcknowledgementStatus, loadPolicies]);

  async function handleCreatePolicy(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) return;

    setIsSubmittingPolicy(true);
    setError('');

    try {
      await client.post('/policies', {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setForm({ title: '', description: '' });
      await loadPolicies();
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create policy'));
    } finally {
      setIsSubmittingPolicy(false);
    }
  }

  async function handleAcknowledge(policyId) {
    if (!currentEmployeeId) return;

    setAcknowledgingPolicyId(policyId);
    setError('');

    try {
      await client.post(`/policies/${policyId}/acknowledge`, {
        employeeId: Number(currentEmployeeId),
      });
      await loadAcknowledgementStatus();
    } catch (err) {
      if (err.response?.status === 409) {
        await loadAcknowledgementStatus();
        return;
      }

      setError(getErrorMessage(err, 'Unable to acknowledge policy'));
    } finally {
      setAcknowledgingPolicyId(null);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading governance policies..." />;
  }

  return (
    <PageContainer eyebrow="Governance" title="Policies">
      <ErrorMessage message={error} />

      {isAdmin && (
        <form className="panel form-panel" onSubmit={handleCreatePolicy}>
          <div className="panel-heading">
            <h2>Create Policy</h2>
            <p>Admin-only policy creation</p>
          </div>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
            />
          </label>

          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>

          <button
            type="submit"
            disabled={
              isSubmittingPolicy ||
              !form.title.trim() ||
              !form.description.trim()
            }
          >
            {isSubmittingPolicy ? 'Creating...' : 'Create policy'}
          </button>
        </form>
      )}

      <section className="policy-list">
        {policies.length === 0 ? (
          <section className="panel">
            <p className="empty-state">No active policies available yet.</p>
          </section>
        ) : (
          policies.map((policy) => {
            const acknowledgement = acknowledgementByPolicyId[policy.id];
            const isAcknowledged = Boolean(acknowledgement?.acknowledged);
            const isAcknowledging = acknowledgingPolicyId === policy.id;

            return (
              <article className="panel policy-card" key={policy.id}>
                <div>
                  <h2>{policy.title}</h2>
                  <p>{policy.description}</p>
                </div>

                <div className="policy-actions">
                  <span
                    className={
                      isAcknowledged ? 'status-pill complete' : 'status-pill'
                    }
                  >
                    {isAcknowledged ? 'Acknowledged' : 'Pending'}
                  </span>
                  <button
                    type="button"
                    disabled={
                      isAcknowledged || isAcknowledging || !currentEmployeeId
                    }
                    onClick={() => handleAcknowledge(policy.id)}
                  >
                    {isAcknowledging ? 'Saving...' : 'Acknowledge'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </PageContainer>
  );
}
