import { motion, useReducedMotion } from 'framer-motion';

export default function ScoreGauge({ label, value }) {
  const score = Number(value ?? 0);
  const clampedScore = Math.max(0, Math.min(100, score));
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="score-card"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="score-ring"
        style={{ '--score-angle': `${clampedScore * 3.6}deg` }}
        aria-label={`${label}: ${Math.round(clampedScore)}`}
      >
        <span>{Math.round(clampedScore)}</span>
      </motion.div>
      <div>
        <p>{label}</p>
        <small>{getScoreLabel(clampedScore)}</small>
      </div>
    </motion.article>
  );
}

function getScoreLabel(score) {
  if (score >= 75) return 'Strong';
  if (score >= 45) return 'Stable';
  return 'Needs focus';
}
