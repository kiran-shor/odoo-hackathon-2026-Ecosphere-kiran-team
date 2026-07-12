export default function ActivityCard({ activity }) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <h2>{activity.title}</h2>
        <p>{activity.category}</p>
      </div>

      <p>{activity.description}</p>
      <p className="points-pill">{activity.pointsReward} pts</p>
    </article>
  );
}
