function mapDepartment(row) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
  };
}

function mapBadge(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    unlockType: row.unlock_type,
    unlockValue: row.unlock_value,
  };
}

function mapEmployee(row, badges = []) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    departmentId: row.department_id,
    departmentName: row.department_name,
    points: row.points,
    role: row.role,
    badges,
  };
}

function mapEmissionFactor(row) {
  return {
    id: row.id,
    activityType: row.activity_type,
    unit: row.unit,
    co2PerUnit: Number(row.co2_per_unit),
  };
}

function mapCarbonTransaction(row) {
  return {
    id: row.id,
    departmentId: row.department_id,
    departmentName: row.department_name,
    emissionFactorId: row.emission_factor_id,
    activityType: row.activity_type,
    unit: row.unit,
    quantity: Number(row.quantity),
    co2Calculated: Number(row.co2_calculated),
    date: row.txn_date,
  };
}

function mapActivity(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    departmentId: row.department_id,
    departmentName: row.department_name,
    pointsReward: row.points_reward,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapParticipation(row) {
  return {
    id: row.id,
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    activityId: row.activity_id,
    activityTitle: row.activity_title,
    proof: row.proof,
    status: row.status,
    pointsAwarded: row.points_awarded,
    createdAt: row.created_at,
  };
}

function mapPolicy(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapReward(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    pointsRequired: row.points_required,
    stock: row.stock,
    status: row.status,
  };
}

module.exports = {
  mapActivity,
  mapBadge,
  mapCarbonTransaction,
  mapDepartment,
  mapEmployee,
  mapEmissionFactor,
  mapParticipation,
  mapPolicy,
  mapReward,
};
