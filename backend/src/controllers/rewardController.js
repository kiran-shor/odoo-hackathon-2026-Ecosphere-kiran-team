const pool = require("../db/pool");
const { httpError } = require("../utils/httpError");

async function redeemReward(req, res, next) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [[reward]] = await connection.query(
      "select * from rewards where id = ? and status = 'active' for update",
      [req.params.id],
    );
    if (!reward) throw httpError(404, "Reward not found");
    if (reward.stock <= 0) throw httpError(400, "Out of stock");

    const [[employee]] = await connection.query(
      "select id, points from employees where id = ? for update",
      [req.body.employeeId],
    );
    if (!employee) throw httpError(400, "Invalid employee");
    if (employee.points < reward.points_required) {
      throw httpError(400, "Not enough points");
    }

    await connection.query("update employees set points = points - ? where id = ?", [
      reward.points_required,
      employee.id,
    ]);
    await connection.query("update rewards set stock = stock - 1 where id = ?", [
      reward.id,
    ]);
    const [redemption] = await connection.query(
      `insert into reward_redemptions
        (employee_id, reward_id, points_spent)
       values (?, ?, ?)`,
      [employee.id, reward.id, reward.points_required],
    );

    await connection.commit();
    res.status(201).json({
      message: "Reward redeemed",
      redemptionId: redemption.insertId,
      employeeId: employee.id,
      rewardId: reward.id,
      pointsSpent: reward.points_required,
      remainingPoints: employee.points - reward.points_required,
      remainingStock: reward.stock - 1,
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

module.exports = { redeemReward };
