const pool = require("../db/pool");
const { httpError } = require("../utils/httpError");
const { mapBadge, mapEmployee } = require("../utils/mappers");

async function getBadgesForEmployees(employeeIds) {
  if (employeeIds.length === 0) return new Map();

  const [rows] = await pool.query(
    `select eb.employee_id, b.*
     from employee_badges eb
     join badges b on b.id = eb.badge_id
     where eb.employee_id in (?)`,
    [employeeIds],
  );

  const badgesByEmployee = new Map();
  for (const row of rows) {
    const existing = badgesByEmployee.get(row.employee_id) || [];
    existing.push(mapBadge(row));
    badgesByEmployee.set(row.employee_id, existing);
  }
  return badgesByEmployee;
}

async function listEmployees(req, res, next) {
  try {
    const [rows] = await pool.query(`
      select e.*, d.name as department_name
      from employees e
      join departments d on d.id = e.department_id
      order by e.id
    `);
    const badgesByEmployee = await getBadgesForEmployees(rows.map((row) => row.id));
    res.json(
      rows.map((row) => mapEmployee(row, badgesByEmployee.get(row.id) || [])),
    );
  } catch (error) {
    next(error);
  }
}

async function getEmployee(req, res, next) {
  try {
    const [[row]] = await pool.query(
      `select e.*, d.name as department_name
       from employees e
       join departments d on d.id = e.department_id
       where e.id = ?`,
      [req.params.id],
    );

    if (!row) throw httpError(404, "Employee not found");

    const badgesByEmployee = await getBadgesForEmployees([row.id]);
    res.json(mapEmployee(row, badgesByEmployee.get(row.id) || []));
  } catch (error) {
    next(error);
  }
}

async function getAcknowledgementStatus(req, res, next) {
  try {
    const [[employee]] = await pool.query("select id from employees where id = ?", [
      req.params.id,
    ]);
    if (!employee) throw httpError(404, "Employee not found");

    const [rows] = await pool.query(
      `select p.id as policyId, p.title,
        case when pa.id is null then false else true end as acknowledged
       from policies p
       left join policy_acknowledgements pa
         on pa.policy_id = p.id and pa.employee_id = ?
       where p.status = 'active'
       order by p.id`,
      [req.params.id],
    );
    res.json(rows.map((row) => ({ ...row, acknowledged: Boolean(row.acknowledged) })));
  } catch (error) {
    next(error);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const [rows] = await pool.query(`
      select e.id, e.name, e.department_id, d.name as department_name, e.points
      from employees e
      join departments d on d.id = e.department_id
      order by e.points desc, e.name asc
      limit 20
    `);
    res.json(
      rows.map((row, index) => ({
        rank: index + 1,
        id: row.id,
        name: row.name,
        departmentId: row.department_id,
        departmentName: row.department_name,
        points: row.points,
      })),
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAcknowledgementStatus,
  getEmployee,
  getLeaderboard,
  listEmployees,
};
