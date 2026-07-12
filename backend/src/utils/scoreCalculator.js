const pool = require("../db/pool");

function clampScore(value) {
  return Math.max(0, Math.min(100, Number(value.toFixed(2))));
}

async function calculateDepartmentScores() {
  const [departments] = await pool.query(
    "select id, name from departments where status = 'active' order by id",
  );
  const [carbonRows] = await pool.query(
    "select department_id, sum(co2_calculated) as total_co2 from carbon_transactions group by department_id",
  );
  const [socialRows] = await pool.query(`
    select e.department_id, count(*) as approved_count
    from participation p
    join employees e on e.id = p.employee_id
    where p.status = 'approved'
    group by e.department_id
  `);
  const [[policyStats]] = await pool.query(
    "select count(*) as total_active_policies from policies where status = 'active'",
  );
  const [ackRows] = await pool.query(`
    select e.department_id, e.id as employee_id, count(pa.id) as ack_count
    from employees e
    left join policy_acknowledgements pa on pa.employee_id = e.id
    left join policies p on p.id = pa.policy_id and p.status = 'active'
    group by e.department_id, e.id
  `);

  const carbonByDept = new Map(
    carbonRows.map((row) => [row.department_id, Number(row.total_co2 || 0)]),
  );
  const maxEmissions = Math.max(0, ...carbonByDept.values());

  const socialByDept = new Map(
    socialRows.map((row) => [row.department_id, Number(row.approved_count)]),
  );

  const ackRatesByDept = new Map();
  const totalActivePolicies = Number(policyStats.total_active_policies || 0);
  for (const row of ackRows) {
    const rate =
      totalActivePolicies === 0
        ? 100
        : (Number(row.ack_count || 0) / totalActivePolicies) * 100;
    const existing = ackRatesByDept.get(row.department_id) || [];
    existing.push(rate);
    ackRatesByDept.set(row.department_id, existing);
  }

  return departments.map((department) => {
    const totalCO2 = carbonByDept.get(department.id) || 0;
    const environmentalScore =
      maxEmissions === 0 ? 100 : 100 - (totalCO2 / maxEmissions) * 100;
    const socialScore = Math.min(100, (socialByDept.get(department.id) || 0) * 10);
    const ackRates = ackRatesByDept.get(department.id) || [];
    const governanceScore =
      ackRates.length === 0
        ? 0
        : ackRates.reduce((sum, rate) => sum + rate, 0) / ackRates.length;
    const totalScore =
      environmentalScore * 0.4 + socialScore * 0.3 + governanceScore * 0.3;

    return {
      departmentId: department.id,
      name: department.name,
      environmentalScore: clampScore(environmentalScore),
      socialScore: clampScore(socialScore),
      governanceScore: clampScore(governanceScore),
      totalScore: clampScore(totalScore),
    };
  });
}

async function calculateOverallScore() {
  const scores = await calculateDepartmentScores();
  const divisor = scores.length || 1;
  const average = (key) =>
    clampScore(scores.reduce((sum, score) => sum + score[key], 0) / divisor);

  return {
    overallScore: average("totalScore"),
    environmentalAvg: average("environmentalScore"),
    socialAvg: average("socialScore"),
    governanceAvg: average("governanceScore"),
  };
}

module.exports = { calculateDepartmentScores, calculateOverallScore };
