export default function ScoreGauge({ label, value }) {
  const score = Number(value ?? 0);
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <article className="score-card">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(#2f855a ${clampedScore * 3.6}deg, #d7e2dd 0deg)`,
        }}
        aria-label={`${label}: ${Math.round(clampedScore)}`}
      >
        <span>{Math.round(clampedScore)}</span>
      </div>
      <p>{label}</p>
    </article>
  );
}
