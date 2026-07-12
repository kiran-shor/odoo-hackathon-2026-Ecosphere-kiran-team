import { useCallback, useEffect, useState } from 'react';
import client from '../../../api/client';
import { useUser } from '../../../context/UserContext';
import LoadingState from '../../../components/LoadingState';
import ErrorMessage from '../../../components/ErrorMessage';
import ActivityCard from '../components/ActivityCard';
import ActivityForm from '../components/ActivityForm';
import { mockActivities } from '../mocks/data';

function getErrorMessage(err) {
  return err.response?.data?.message || 'Something went wrong';
}

export default function CSRActivities() {
  const { isAdmin } = useUser();
  const [activities, setActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await client.get('/activities');
      setActivities(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  }, []);

  async function createActivity(body) {
    setSubmitting(true);
    setFormError('');

    try {
      await client.post('/activities', body);
      setShowForm(false);
      await loadActivities();
      return true;
    } catch (err) {
      setFormError(getErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Social</p>
          <h1>CSR Activities</h1>
        </div>

        {isAdmin && (
          <button type="button" onClick={() => setShowForm((current) => !current)}>
            {showForm ? 'Close' : '+ New Activity'}
          </button>
        )}
      </section>

      {isAdmin && showForm && (
        <ActivityForm
          error={formError}
          onSubmit={createActivity}
          submitting={submitting}
        />
      )}

      {loading ? (
        <LoadingState label="Loading CSR activities..." />
      ) : (
        <>
          <ErrorMessage message={error} />

          {activities.length === 0 ? (
            <section className="panel">
              <p className="muted">No CSR activities are available yet.</p>
            </section>
          ) : (
            activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </>
      )}
    </main>
  );
}
