const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateGoalProgress } = require("../src/utils/goalProgress");

const base = { targetValue: 100, startDate: "2026-01-01", deadline: "2026-12-31" };

test("derives every goal status and preserves uncapped progress", () => {
  assert.equal(calculateGoalProgress({ ...base, currentValue: 0, today: "2025-12-31" }).progressStatus, "upcoming");
  assert.equal(calculateGoalProgress({ ...base, currentValue: 50, today: "2026-07-12" }).progressStatus, "on-track");
  const exceeded = calculateGoalProgress({ ...base, currentValue: 125, today: "2026-07-12" });
  assert.equal(exceeded.progressStatus, "exceeded");
  assert.equal(exceeded.progressPercent, 125);
  assert.equal(calculateGoalProgress({ ...base, currentValue: 100, today: "2027-01-01" }).progressStatus, "completed");
  assert.equal(calculateGoalProgress({ ...base, currentValue: 101, today: "2027-01-01" }).progressStatus, "missed");
});

test("treats deadline day as active and handles zero activity", () => {
  const result = calculateGoalProgress({ ...base, currentValue: 0, today: "2026-12-31" });
  assert.deepEqual(result, {
    currentValue: 0,
    progressPercent: 0,
    progressStatus: "on-track",
    daysRemaining: 0,
  });
});
