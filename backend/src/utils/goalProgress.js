const DAY_MS = 24 * 60 * 60 * 1000;

function dateValue(date) {
  return Date.parse(`${date}T00:00:00Z`);
}

function calculateGoalProgress({ currentValue, targetValue, startDate, deadline, today }) {
  const current = Number(currentValue || 0);
  const target = Number(targetValue);
  const progressPercent = Number(((current / target) * 100).toFixed(2));
  const daysRemaining = Math.round((dateValue(deadline) - dateValue(today)) / DAY_MS);

  let progressStatus;
  if (dateValue(today) < dateValue(startDate)) progressStatus = "upcoming";
  else if (daysRemaining < 0) progressStatus = progressPercent <= 100 ? "completed" : "missed";
  else progressStatus = progressPercent <= 100 ? "on-track" : "exceeded";

  return { currentValue: current, progressPercent, progressStatus, daysRemaining };
}

module.exports = { calculateGoalProgress };
