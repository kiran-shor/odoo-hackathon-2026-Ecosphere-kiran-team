export default function ActivityCard({ activity }) {
  return (
    <article className="panel policy-card">
      <div>
        <h2>{activity.title}</h2>
        <p>{activity.description}</p>
        <div className="policy-actions">
          <span className="status-pill complete">{activity.category}</span>
          <span className="status-pill">{activity.pointsReward} pts</span>
        </div>
      </div>
    </article>
  );
}
