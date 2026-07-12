const {
  calculateDepartmentScores,
  calculateOverallScore,
} = require("../utils/scoreCalculator");

async function getDepartmentScores(req, res, next) {
  try {
    res.json(await calculateDepartmentScores());
  } catch (error) {
    next(error);
  }
}

async function getOverallScore(req, res, next) {
  try {
    res.json(await calculateOverallScore());
  } catch (error) {
    next(error);
  }
}

module.exports = { getDepartmentScores, getOverallScore };
