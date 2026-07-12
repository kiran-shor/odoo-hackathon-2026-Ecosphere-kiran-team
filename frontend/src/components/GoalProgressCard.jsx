import { motion, useReducedMotion } from 'framer-motion';

const statuses = {
  'on-track': { label: 'On track', tone: 'positive' },
  exceeded: { label: 'Target exceeded', tone: 'warning' },
  completed: { label: 'Completed within target', tone: 'complete' },
  missed: { label: 'Missed', tone: 'danger' },
  upcoming: { label: 'Upcoming', tone: 'neutral' },
};

export default function GoalProgressCard({ goal }) {
  const reduceMotion = useReducedMotion();
  const status = statuses[goal.progressStatus] || statuses['on-track'];
  const width = Math.max(0, Math.min(Number(goal.progressPercent), 100));

  return (
    <motion.article
      className="goal-card"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="goal-card-header">
        <span className="goal-department">{goal.departmentName}</span>
        <span className={`goal-status ${status.tone}`}>{status.label}</span>
      </header>
      <h2>{goal.metricLabel}</h2>
      <div
        className="goal-track"
        role="progressbar"
        aria-label={`${goal.metricLabel}: ${formatNumber(goal.progressPercent)} percent of target`}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.min(width, 100)}
      >
        <motion.span
          className={`goal-fill ${status.tone}`}
          initial={reduceMotion ? { width: `${width}%` } : { width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="goal-numbers">
        <strong>{formatNumber(goal.currentValue)} / {formatNumber(goal.targetValue)} {goal.unit}</strong>
        <span>{formatNumber(goal.progressPercent)}%</span>
      </div>
      <footer className="goal-card-footer">
        <span>{goal.daysRemaining >= 0 ? `${goal.daysRemaining} days left` : `${Math.abs(goal.daysRemaining)} days overdue`}</span>
        <time dateTime={goal.deadline}>Due {formatDate(goal.deadline)}</time>
      </footer>
    </motion.article>
  );
}

function formatNumber(value) {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(Number(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
    new Date(`${value}T00:00:00Z`)
  );
}
