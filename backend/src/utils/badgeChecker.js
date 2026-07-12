const pool = require("../db/pool");

async function checkAndAwardBadges(employeeId, connection = pool) {
  const [[employee]] = await connection.query(
    "select points from employees where id = ?",
    [employeeId],
  );

  if (!employee) return [];

  const [existingRows] = await connection.query(
    "select badge_id from employee_badges where employee_id = ?",
    [employeeId],
  );
  const existingBadgeIds = new Set(existingRows.map((row) => row.badge_id));

  const [[participationStats]] = await connection.query(
    "select count(*) as approved_count from participation where employee_id = ? and status = 'approved'",
    [employeeId],
  );

  const [badges] = await connection.query("select * from badges");
  const awarded = [];

  for (const badge of badges) {
    if (existingBadgeIds.has(badge.id)) continue;

    const qualifies =
      (badge.unlock_type === "points_threshold" &&
        employee.points >= badge.unlock_value) ||
      (badge.unlock_type === "participation_count" &&
        participationStats.approved_count >= badge.unlock_value);

    if (qualifies) {
      await connection.query(
        "insert into employee_badges (employee_id, badge_id) values (?, ?)",
        [employeeId, badge.id],
      );
      awarded.push(badge);
    }
  }

  return awarded;
}

module.exports = { checkAndAwardBadges };
