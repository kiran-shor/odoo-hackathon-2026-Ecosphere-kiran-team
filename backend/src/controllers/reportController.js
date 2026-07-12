const { calculateDepartmentScores } = require("../utils/scoreCalculator");

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

async function buildSummary() {
  const departments = await calculateDepartmentScores();
  const divisor = departments.length || 1;
  const average = (key) =>
    Number(
      (
        departments.reduce((sum, department) => sum + department[key], 0) /
        divisor
      ).toFixed(2),
    );

  const overall = {
    overallScore: average("totalScore"),
    environmentalAvg: average("environmentalScore"),
    socialAvg: average("socialScore"),
    governanceAvg: average("governanceScore"),
  };

  return {
    generatedAt: new Date().toISOString(),
    overall,
    departments,
  };
}

async function getEsgSummary(req, res, next) {
  try {
    res.json(await buildSummary());
  } catch (error) {
    next(error);
  }
}

async function getEsgSummaryCsv(req, res, next) {
  try {
    const summary = await buildSummary();
    const header = [
      "Department",
      "Environmental Score",
      "Social Score",
      "Governance Score",
      "Total Score",
    ];
    const lines = [
      header.join(","),
      ...summary.departments.map((department) =>
        [
          department.name,
          department.environmentalScore,
          department.socialScore,
          department.governanceScore,
          department.totalScore,
        ]
          .map(csvEscape)
          .join(","),
      ),
    ];

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="esg-summary.csv"',
    );
    res.send(lines.join("\n"));
  } catch (error) {
    next(error);
  }
}

module.exports = { getEsgSummary, getEsgSummaryCsv };
