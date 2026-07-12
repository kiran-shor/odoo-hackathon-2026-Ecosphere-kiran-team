export default function RewardCard({
  reward,
  employeePoints,
  onRedeem,
  submitting,
}) {
  const cannotRedeem =
    employeePoints === null ||
    employeePoints === undefined ||
    employeePoints < reward.pointsRequired ||
    reward.stock === 0;

  return (
    <article className="panel policy-card">
      <div>
        <h2>{reward.name}</h2>
        <p>{reward.description}</p>
        <div className="policy-actions">
          <span className="status-pill">{reward.pointsRequired} pts</span>
          <span className={reward.stock === 0 ? 'status-pill' : 'status-pill complete'}>
            {reward.stock === 0 ? 'Out of stock' : `${reward.stock} left`}
          </span>
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
