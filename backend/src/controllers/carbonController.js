const pool = require("../db/pool");
const { httpError } = require("../utils/httpError");
const { mapCarbonTransaction } = require("../utils/mappers");

async function createCarbonTransaction(req, res, next) {
  try {
    const { departmentId, emissionFactorId, quantity, date } = req.body;
    const [[factor]] = await pool.query(
      "select co2_per_unit from emission_factors where id = ?",
      [emissionFactorId],
    );
    if (!factor) throw httpError(400, "Invalid emission factor");

    const [[department]] = await pool.query("select id from departments where id = ?", [
      departmentId,
    ]);
    if (!department) throw httpError(400, "Invalid department");

    const co2Calculated = Number((quantity * factor.co2_per_unit).toFixed(2));
    const [result] = await pool.query(
      `insert into carbon_transactions
        (department_id, emission_factor_id, quantity, co2_calculated, txn_date)
       values (?, ?, ?, ?, ?)`,
      [departmentId, emissionFactorId, quantity, co2Calculated, date || new Date()],
    );

    const [[row]] = await pool.query(
      `select ct.*, d.name as department_name, ef.activity_type, ef.unit
       from carbon_transactions ct
       join departments d on d.id = ct.department_id
       join emission_factors ef on ef.id = ct.emission_factor_id
       where ct.id = ?`,
      [result.insertId],
    );
    res.status(201).json(mapCarbonTransaction(row));
  } catch (error) {
    next(error);
  }
}

async function listCarbonTransactions(req, res, next) {
  try {
    const params = [];
    let where = "";
    if (req.query.departmentId) {
      where = "where ct.department_id = ?";
      params.push(req.query.departmentId);
    }

    const [rows] = await pool.query(
      `select ct.*, d.name as department_name, ef.activity_type, ef.unit
       from carbon_transactions ct
       join departments d on d.id = ct.department_id
       join emission_factors ef on ef.id = ct.emission_factor_id
       ${where}
       order by ct.txn_date desc, ct.id desc`,
      params,
    );
    res.json(rows.map(mapCarbonTransaction));
  } catch (error) {
    next(error);
  }
}

async function getCarbonSummary(req, res, next) {
  try {
    const [rows] = await pool.query(`
      select d.id as departmentId, d.name as departmentName,
        coalesce(sum(ct.co2_calculated), 0) as totalCO2
      from departments d
      left join carbon_transactions ct on ct.department_id = d.id
      where d.status = 'active'
      group by d.id, d.name
      order by d.id
    `);
    res.json(rows.map((row) => ({ ...row, totalCO2: Number(row.totalCO2) })));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCarbonTransaction,
  getCarbonSummary,
  listCarbonTransactions,
};
