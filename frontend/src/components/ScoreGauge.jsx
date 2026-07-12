export default function ScoreGauge({ label, value }) {
  const score = Number(value ?? 0);
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <article className="score-card">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(#14b8a6 ${clampedScore * 3.6}deg, #e7eef3 0deg)`,
        }}
        aria-label={`${label}: ${Math.round(clampedScore)}`}
      >
        <span>{Math.round(clampedScore)}</span>
      </div>
      <div>
        <p>{label}</p>
        <small>{getScoreLabel(clampedScore)}</small>
      </div>
    </article>
  );
}

function getScoreLabel(score) {
  if (score >= 75) return 'Strong';
  if (score >= 45) return 'Stable';
  return 'Needs focus';
}
