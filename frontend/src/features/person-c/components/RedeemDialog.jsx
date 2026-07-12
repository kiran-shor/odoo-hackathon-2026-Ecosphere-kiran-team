export default function RedeemDialog({
  reward,
  employeePoints,
  onCancel,
  onConfirm,
  submitting,
}) {
  if (!reward) return null;

  const remainingPoints = Number(employeePoints ?? 0) - reward.pointsRequired;

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Confirm Redemption</h2>
        <p>{reward.name}</p>
      </div>

      <p>
        Redeem this reward for {reward.pointsRequired} points? You will have{' '}
        {remainingPoints} points left after the backend confirms the redemption.
      </p>

      <div className="policy-actions">
        <button type="button" disabled={submitting} onClick={onConfirm}>
          {submitting ? 'Redeeming...' : 'Confirm'}
        </button>
        <button type="button" disabled={submitting} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}
