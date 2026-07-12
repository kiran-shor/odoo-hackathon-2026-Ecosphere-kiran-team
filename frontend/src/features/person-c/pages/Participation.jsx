import { useCallback, useEffect, useState } from 'react';
import client from '../../../api/client';
import { useUser } from '../../../context/UserContext';
import LoadingState from '../../../components/LoadingState';
import ErrorMessage from '../../../components/ErrorMessage';
import ParticipationForm from '../components/ParticipationForm';
import PendingParticipationTable from '../components/PendingParticipationTable';
import { mockActivities, mockPendingParticipation } from '../mocks/data';

function getErrorMessage(err) {
  return err.response?.data?.message || 'Something went wrong';
}

export default function Participation() {
  const {
    currentEmployeeId,
    refreshCurrentEmployee,
    isAdmin,
  } = useUser();
  const [activities, setActivities] = useState(mockActivities);
  const [pendingItems, setPendingItems] = useState(mockPendingParticipation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busyId, setBusyId] = useState(null);

  const fetchActivities = useCallback(async () => {
    const { data } = await client.get('/activities');
    return data;
  }, []);

  const fetchPendingParticipation = useCallback(async () => {
    const { data } = await client.get('/participation?status=pending');
    return data;
  }, []);

  useEffect(() => {
    async function loadParticipationPage() {
      setLoading(true);
      setError('');
      setSuccess('');

      try {
        if (isAdmin) {
          const data = await fetchPendingParticipation();
          setPendingItems(data);
        } else {
          const data = await fetchActivities();
          setActivities(data);
        }
      } catch (err) {
        setError(getErrorMessage(err));

        if (isAdmin) {
          setPendingItems(mockPendingParticipation);
        } else {
          setActivities(mockActivities);
        }
      } finally {
        setLoading(false);
      }
    }

    loadParticipationPage();
  }, [fetchActivities, fetchPendingParticipation, isAdmin]);

  function handleSubmitted() {
    setSuccess('Submitted for approval');
  }

  async function handleApprove(item) {
    setBusyId(item.id);
    setError('');
    setSuccess('');

    try {
      await client.patch(`/participation/${item.id}/approve`);
      setPendingItems((current) =>
        current.filter((pendingItem) => pendingItem.id !== item.id)
      );

      if (Number(item.employeeId) === Number(currentEmployeeId)) {
        await refreshCurrentEmployee();
      }

      setSuccess('Participation approved');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(item) {
    setBusyId(item.id);
    setError('');
    setSuccess('');

    try {
      await client.patch(`/participation/${item.id}/reject`);
      setPendingItems((current) =>
        current.filter((pendingItem) => pendingItem.id !== item.id)
      );
      setSuccess('Participation rejected');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <LoadingState label="Loading participation..." />;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Participation</p>
          <h1>{isAdmin ? 'Review Participation' : 'Submit Participation'}</h1>
        </div>
      </section>

      <ErrorMessage message={error} />

      {success && (
        <p className="success-message" role="status">
          {success}
        </p>
      )}

      {isAdmin ? (
        <PendingParticipationTable
          busyId={busyId}
          items={pendingItems}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ) : (
        <ParticipationForm
          activities={activities}
          employeeId={currentEmployeeId}
          onSubmitted={handleSubmitted}
        />
      )}
    </main>
  );
}
