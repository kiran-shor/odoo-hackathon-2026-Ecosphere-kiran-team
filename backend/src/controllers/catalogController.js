const pool = require("../db/pool");
const {
  mapActivity,
  mapBadge,
  mapDepartment,
  mapEmissionFactor,
  mapPolicy,
  mapReward,
} = require("../utils/mappers");

async function listDepartments(req, res, next) {
  try {
    const [rows] = await pool.query(
      "select id, name, code from departments where status = 'active' order by id",
    );
    res.json(rows.map(mapDepartment));
  } catch (error) {
    next(error);
  }
}

async function listEmissionFactors(req, res, next) {
  try {
    const [rows] = await pool.query("select * from emission_factors order by id");
    res.json(rows.map(mapEmissionFactor));
  } catch (error) {
    next(error);
  }
}

async function listActivities(req, res, next) {
  try {
    const [rows] = await pool.query(`
      select a.*, d.name as department_name
      from csr_activities a
      left join departments d on d.id = a.department_id
      where a.status = 'active'
      order by a.id
    `);
    res.json(rows.map(mapActivity));
  } catch (error) {
    next(error);
  }
}

async function createActivity(req, res, next) {
  try {
    const { title, category, description, departmentId, pointsReward } = req.body;
    const [result] = await pool.query(
      `insert into csr_activities
        (title, category, description, department_id, points_reward)
       values (?, ?, ?, ?, ?)`,
      [title, category, description || null, departmentId || null, pointsReward],
    );
    const [[row]] = await pool.query(
      `select a.*, d.name as department_name
       from csr_activities a
       left join departments d on d.id = a.department_id
       where a.id = ?`,
      [result.insertId],
    );
    res.status(201).json(mapActivity(row));
  } catch (error) {
    next(error);
  }
}

async function listPolicies(req, res, next) {
  try {
    const [rows] = await pool.query(
      "select * from policies where status = 'active' order by id",
    );
    res.json(rows.map(mapPolicy));
  } catch (error) {
    next(error);
  }
}

async function createPolicy(req, res, next) {
  try {
    const { title, description } = req.body;
    const [result] = await pool.query(
      "insert into policies (title, description) values (?, ?)",
      [title, description],
    );
    const [[row]] = await pool.query("select * from policies where id = ?", [
      result.insertId,
    ]);
    res.status(201).json(mapPolicy(row));
  } catch (error) {
    next(error);
  }
}

async function listBadges(req, res, next) {
  try {
    const [rows] = await pool.query("select * from badges order by id");
    res.json(rows.map(mapBadge));
  } catch (error) {
    next(error);
  }
}

async function listRewards(req, res, next) {
  try {
    const [rows] = await pool.query(
      "select * from rewards where status = 'active' order by points_required",
    );
    res.json(rows.map(mapReward));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createActivity,
  createPolicy,
  listActivities,
  listBadges,
  listDepartments,
  listEmissionFactors,
  listPolicies,
  listRewards,
};
