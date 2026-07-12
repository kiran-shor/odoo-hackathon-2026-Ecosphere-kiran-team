import { useState } from 'react';
import client from '../../../api/client';
import ErrorMessage from '../../../components/ErrorMessage';

function getErrorMessage(err) {
  return err.response?.data?.message || 'Something went wrong';
}

export default function ParticipationForm({ activities, employeeId, onSubmitted }) {
  const [activityId, setActivityId] = useState('');
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!employeeId || !activityId || !proof.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await client.post('/participation', {
        employeeId: Number(employeeId),
        activityId: Number(activityId),
        proof: proof.trim(),
      });

      setActivityId('');
      setProof('');
      onSubmitted();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h2>Submit Participation</h2>
        <p>Send proof for admin approval.</p>
      </div>

      <ErrorMessage message={error} />

      {!employeeId && (
        <p className="empty-state">Select an employee before submitting.</p>
      )}

      {activities.length === 0 && (
        <p className="empty-state">No active activities are available yet.</p>
      )}

      <label>
        Activity
        <select
          disabled={activities.length === 0 || submitting}
          value={activityId}
          onChange={(event) => setActivityId(Number(event.target.value))}
          required
        >
          <option value="">Select an activity</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.title} - {activity.pointsReward} pts
            </option>
          ))}
        </select>
      </label>

      <label>
        Proof text or URL
        <textarea
          disabled={submitting}
          rows="4"
          value={proof}
          onChange={(event) => setProof(event.target.value)}
          placeholder="https://example.com/proof"
          required
        />
      </label>

      <button
        type="submit"
        disabled={
          submitting ||
          !employeeId ||
          !activityId ||
          !proof.trim() ||
          activities.length === 0
        }
      >
        {submitting ? 'Submitting...' : 'Submit for approval'}
      </button>
    </form>
  );
}
