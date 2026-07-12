import { useEffect, useState } from 'react';
import client from '../../../api/client';
import { useUser } from '../../../context/UserContext';
import LoadingState from '../../../components/LoadingState';
import ErrorMessage from '../../../components/ErrorMessage';
import RewardCard from '../components/RewardCard';
import RedeemDialog from '../components/RedeemDialog';
import { mockRewards } from '../mocks/data';

function getErrorMessage(err) {
  return err.response?.data?.message || 'Something went wrong';
}

export default function Rewards() {
  const { currentEmployee, refreshCurrentEmployee } = useUser();
  const [rewards, setRewards] = useState(mockRewards);
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadRewards() {
    const { data } = await client.get('/rewards');
    setRewards(data);
  }

  useEffect(() => {
    async function loadRewardsPage() {
      setLoading(true);
      setError('');

      try {
        await loadRewards();
      } catch (err) {
        setError(getErrorMessage(err));
        setRewards(mockRewards);
      } finally {
        setLoading(false);
      }
    }

    loadRewardsPage();
  }, []);

  function openRedeemDialog(reward) {
    setSelectedReward(reward);
    setError('');
    setSuccess('');
  }

  async function confirmRedemption() {
    if (!selectedReward || !currentEmployee) return;

    setSubmittingId(selectedReward.id);
    setError('');
    setSuccess('');

    try {
      await client.post(`/rewards/${selectedReward.id}/redeem`, {
        employeeId: Number(currentEmployee.id),
      });
      await refreshCurrentEmployee();
      await loadRewards();
      setSuccess(`${selectedReward.name} redeemed successfully`);
      setSelectedReward(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmittingId(null);
    }
  }

  if (loading) {
    return <LoadingState label="Loading rewards..." />;
  }

  return (
    <main className="page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Rewards</p>
          <h1>Rewards</h1>
        </div>
      </section>

      <ErrorMessage message={error} />

      {success && (
        <p className="success-message" role="status">
          {success}
        </p>
      )}

      {!currentEmployee && (
        <section className="panel">
          <p className="empty-state">Select an employee before redeeming rewards.</p>
        </section>
      )}

      <RedeemDialog
        employeePoints={currentEmployee?.points}
        onCancel={() => setSelectedReward(null)}
        onConfirm={confirmRedemption}
        reward={selectedReward}
        submitting={Boolean(submittingId)}
      />

      <section className="policy-list">
        {rewards.length === 0 ? (
          <section className="panel">
            <p className="empty-state">No active rewards available yet.</p>
          </section>
        ) : (
          rewards.map((reward) => (
            <RewardCard
              employeePoints={currentEmployee?.points}
              key={reward.id}
              onRedeem={openRedeemDialog}
              reward={reward}
              submitting={submittingId === reward.id}
            />
          ))
        )}
      </section>
    </main>
  );
}
