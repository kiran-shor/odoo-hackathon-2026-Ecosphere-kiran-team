const pool = require("../db/pool");
const { calculateGoalProgress } = require("../utils/goalProgress");
const { httpError } = require("../utils/httpError");

const goalSelect = `
  select g.*, d.name as department_name,
    date_format(g.start_date, '%Y-%m-%d') as start_date_text,
    date_format(g.deadline, '%Y-%m-%d') as deadline_text,
    date_format(curdate(), '%Y-%m-%d') as today,
    coalesce(sum(case when g.emission_factor_id is null
      then ct.co2_calculated else ct.quantity end), 0) as current_value
  from environmental_goals g
  join departments d on d.id = g.department_id
  left join carbon_transactions ct
    on ct.department_id = g.department_id
    and ct.txn_date >= g.start_date
    and ct.txn_date < date_add(least(g.deadline, curdate()), interval 1 day)
    and (g.emission_factor_id is null or ct.emission_factor_id = g.emission_factor_id)
`;

function mapGoal(row) {
  const progress = calculateGoalProgress({
    currentValue: row.current_value,
    targetValue: row.target_value,
    startDate: row.start_date_text,
    deadline: row.deadline_text,
    today: row.today,
  });
  return {
    id: row.id,
    departmentId: row.department_id,
    departmentName: row.department_name,
    emissionFactorId: row.emission_factor_id,
    metricLabel: row.metric_label,
    unit: row.unit,
    targetValue: Number(row.target_value),
    ...progress,
    startDate: row.start_date_text,
    deadline: row.deadline_text,
    status: row.status,
  };
}

async function selectGoals(where = "", params = []) {
  const [rows] = await pool.query(
    `${goalSelect} ${where} group by g.id, d.name order by g.deadline, g.id`,
    params,
  );
  return rows.map(mapGoal);
}

async function listGoals(req, res, next) {
  try {
    if (!req.query.departmentId) return res.json(await selectGoals());
    const departmentId = Number(req.query.departmentId);
    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      throw httpError(400, "Invalid departmentId");
    }
    return res.json(await selectGoals("where g.department_id = ?", [departmentId]));
  } catch (error) {
    return next(error);
  }
}

async function createGoal(req, res, next) {
  try {
    const goal = req.body;
    const [[department]] = await pool.query("select id from departments where id = ?", [goal.departmentId]);
    if (!department) throw httpError(400, "Invalid department");
    if (goal.emissionFactorId) {
      const [[factor]] = await pool.query("select id from emission_factors where id = ?", [goal.emissionFactorId]);
      if (!factor) throw httpError(400, "Invalid emission factor");
    }
    const [result] = await pool.query(
      `insert into environmental_goals
        (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
       values (?, ?, ?, ?, ?, ?, ?)`,
      [goal.departmentId, goal.emissionFactorId || null, goal.metricLabel, goal.targetValue, goal.unit, goal.startDate, goal.deadline],
    );
    const [created] = await selectGoals("where g.id = ?", [result.insertId]);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateGoal(req, res, next) {
  try {
    const [[goal]] = await pool.query("select start_date from environmental_goals where id = ?", [req.params.id]);
    if (!goal) throw httpError(404, "Goal not found");
    if (req.body.deadline) {
      const startDate = goal.start_date.toISOString().slice(0, 10);
      if (req.body.deadline < startDate) throw httpError(400, "Deadline must be on or after the start date");
    }
    const columns = { targetValue: "target_value", deadline: "deadline", status: "status" };
    const entries = Object.entries(req.body);
    await pool.query(
      `update environmental_goals set ${entries.map(([key]) => `${columns[key]} = ?`).join(", ")} where id = ?`,
      [...entries.map(([, value]) => value), req.params.id],
    );
    res.json({ message: "Goal updated", id: Number(req.params.id) });
  } catch (error) {
    next(error);
  }
}

async function deleteGoal(req, res, next) {
  try {
    const [result] = await pool.query("delete from environmental_goals where id = ?", [req.params.id]);
    if (!result.affectedRows) throw httpError(404, "Goal not found");
    res.json({ message: "Goal deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGoal, deleteGoal, listGoals, updateGoal };
