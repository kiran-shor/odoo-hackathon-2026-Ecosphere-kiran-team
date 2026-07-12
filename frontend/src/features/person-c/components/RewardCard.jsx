export default function RewardCard({
  reward,
  employeePoints,
  onRedeem,
  submitting,
}) {
  const hasEmployee = employeePoints !== null && employeePoints !== undefined;
  const cannotRedeem =
    !hasEmployee ||
    employeePoints < reward.pointsRequired ||
    reward.stock === 0;
  const reason =
    !hasEmployee
      ? 'Select an employee'
      : reward.stock === 0
        ? 'Out of stock'
        : employeePoints < reward.pointsRequired
          ? 'Not enough points'
          : '';

  return (
    <article className="panel policy-card">
      <div>
        <h2>{reward.name}</h2>
        <p>{reward.description}</p>
        <div className="policy-actions">
          <span className="status-pill">{reward.pointsRequired} pts</span>
          <span
            className={reward.stock === 0 ? 'status-pill' : 'status-pill complete'}
          >
            {reward.stock === 0 ? 'Out of stock' : `${reward.stock} left`}
          </span>
          {reason && <span className="muted">{reason}</span>}
        </div>
      </div>

      <button
        type="button"
        disabled={cannotRedeem || submitting}
        onClick={() => onRedeem(reward)}
      >
        {submitting ? 'Redeeming...' : 'Redeem'}
      </button>
    </article>
  );
}
