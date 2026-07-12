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
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchActivities = useCallback(async () => {
    const { data } = await client.get('/activities');
    return data;
  }, []);

  async function loadActivities() {
    try {
      const data = await fetchActivities();
      setActivities(data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  }

  async function createActivity(body) {
    setSubmitting(true);
    setFormError('');
    setSuccess('');

    try {
      await client.post('/activities', body);
      setShowForm(false);
      await loadActivities();
      setSuccess('Activity created successfully');
      return true;
    } catch (err) {
      setFormError(getErrorMessage(err));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    async function loadActivitiesPage() {
      setLoading(true);

      try {
        const data = await fetchActivities();
        setActivities(data);
        setError('');
      } catch (err) {
        setError(getErrorMessage(err));
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    }

    loadActivitiesPage();
  }, [fetchActivities]);

  return (
    <main className="page">
      <section className="page-header impact-contours">
        <div>
          <p className="eyebrow">Social</p>
          <h1>CSR Activities</h1>
        </div>

        {isAdmin && (
          <button
            type="button"
            disabled={submitting}
            onClick={() => {
              setFormError('');
              setShowForm((current) => !current);
            }}
          >
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

          {success && (
            <p className="success-message" role="status">
              {success}
            </p>
          )}

          {activities.length === 0 ? (
            <section className="panel">
              <p className="empty-state">No CSR activities are available yet.</p>
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
