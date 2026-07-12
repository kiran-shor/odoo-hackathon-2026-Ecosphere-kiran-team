const pool = require("../db/pool");
const { checkAndAwardBadges } = require("../utils/badgeChecker");
const { httpError } = require("../utils/httpError");
const { mapParticipation } = require("../utils/mappers");

async function createParticipation(req, res, next) {
  try {
    const { employeeId, activityId, proof } = req.body;
    const [result] = await pool.query(
      "insert into participation (employee_id, activity_id, proof) values (?, ?, ?)",
      [employeeId, activityId, proof || null],
    );
    const [[row]] = await pool.query(
      `select p.*, e.name as employee_name, a.title as activity_title
       from participation p
       join employees e on e.id = p.employee_id
       join csr_activities a on a.id = p.activity_id
       where p.id = ?`,
      [result.insertId],
    );
    res.status(201).json(mapParticipation(row));
  } catch (error) {
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      error.statusCode = 400;
      error.message = "Invalid employee or activity";
    }
    next(error);
  }
}

async function listParticipation(req, res, next) {
  try {
    const params = [];
    let where = "";
    if (req.query.status) {
      where = "where p.status = ?";
      params.push(req.query.status);
    }
    const [rows] = await pool.query(
      `select p.*, e.name as employee_name, a.title as activity_title
       from participation p
       join employees e on e.id = p.employee_id
       join csr_activities a on a.id = p.activity_id
       ${where}
       order by p.created_at desc, p.id desc`,
      params,
    );
    res.json(rows.map(mapParticipation));
  } catch (error) {
    next(error);
  }
}

async function approveParticipation(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[participation]] = await connection.query(
      `select p.*, a.points_reward
       from participation p
       join csr_activities a on a.id = p.activity_id
       where p.id = ?
       for update`,
      [req.params.id],
    );
    if (!participation) throw httpError(404, "Participation not found");
    if (participation.status === "approved") {
      throw httpError(400, "Participation already approved");
    }
    if (participation.status === "rejected") {
      throw httpError(400, "Rejected participation cannot be approved");
    }

    await connection.query(
      "update participation set status = 'approved', points_awarded = ? where id = ?",
      [participation.points_reward, req.params.id],
    );
    await connection.query("update employees set points = points + ? where id = ?", [
      participation.points_reward,
      participation.employee_id,
    ]);
    const awardedBadges = await checkAndAwardBadges(
      participation.employee_id,
      connection,
    );

    await connection.commit();
    res.json({
      message: "Approved",
      pointsAwarded: participation.points_reward,
      awardedBadges: awardedBadges.map((badge) => badge.name),
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function rejectParticipation(req, res, next) {
  try {
    const [result] = await pool.query(
      "update participation set status = 'rejected', points_awarded = 0 where id = ? and status = 'pending'",
      [req.params.id],
    );
    if (result.affectedRows === 0) {
      throw httpError(404, "Pending participation not found");
    }
    res.json({ message: "Rejected" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  approveParticipation,
  createParticipation,
  listParticipation,
  rejectParticipation,
};
