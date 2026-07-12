const pool = require("../db/pool");

async function acknowledgePolicy(req, res, next) {
  try {
    const { employeeId } = req.body;
    await pool.query(
      "insert into policy_acknowledgements (employee_id, policy_id) values (?, ?)",
      [employeeId, req.params.id],
    );
    res.status(201).json({ message: "Acknowledged" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Already acknowledged" });
    }
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      error.statusCode = 400;
      error.message = "Invalid employee or policy";
    }
    return next(error);
  }
}

module.exports = { acknowledgePolicy };
