let nextCarbonTransactionId = 4;
let nextPolicyId = 4;

const departments = [
  { id: 1, name: 'Operations', code: 'OPS' },
  { id: 2, name: 'Engineering', code: 'ENG' },
  { id: 3, name: 'People', code: 'PPL' },
];

const employees = [
  {
    id: 1,
    name: 'Aarav Mehta',
    departmentId: 1,
    points: 420,
    badges: ['Policy Champion'],
  },
  {
    id: 2,
    name: 'Isha Rao',
    departmentId: 2,
    points: 360,
    badges: ['Carbon Tracker'],
  },
  {
    id: 3,
    name: 'Kabir Sen',
    departmentId: 3,
    points: 285,
    badges: [],
  },
];

const emissionFactors = [
  { id: 1, activityType: 'Electricity', unit: 'kWh', co2PerUnit: 0.71 },
  { id: 2, activityType: 'Business Travel', unit: 'km', co2PerUnit: 0.18 },
  { id: 3, activityType: 'Office Waste', unit: 'kg', co2PerUnit: 0.42 },
];

const carbonTransactions = [
  {
    id: 1,
    departmentId: 1,
    departmentName: 'Operations',
    emissionFactorId: 1,
    activityType: 'Electricity',
    quantity: 240,
    date: '2026-07-08',
    co2Calculated: 170.4,
  },
  {
    id: 2,
    departmentId: 2,
    departmentName: 'Engineering',
    emissionFactorId: 2,
    activityType: 'Business Travel',
    quantity: 410,
    date: '2026-07-09',
    co2Calculated: 73.8,
  },
  {
    id: 3,
    departmentId: 3,
    departmentName: 'People',
    emissionFactorId: 3,
    activityType: 'Office Waste',
    quantity: 55,
    date: '2026-07-10',
    co2Calculated: 23.1,
  },
];

const policies = [
  {
    id: 1,
    title: 'Sustainable Travel Policy',
    description: 'Prefer rail, shared transport, or virtual meetings where practical.',
  },
  {
    id: 2,
    title: 'Waste Segregation Policy',
    description: 'Separate recyclable, organic, and landfill waste at source.',
  },
  {
    id: 3,
    title: 'Data Ethics Policy',
    description: 'Use employee and ESG data only for approved reporting workflows.',
  },
];

const acknowledgedPolicyIdsByEmployee = {
  1: new Set([1]),
  2: new Set([1, 2]),
  3: new Set([]),
};

const departmentScores = [
  {
    departmentId: 1,
    name: 'Operations',
    environmentalScore: 64,
    socialScore: 78,
    governanceScore: 72,
    totalScore: 71,
  },
  {
    departmentId: 2,
    name: 'Engineering',
    environmentalScore: 76,
    socialScore: 69,
    governanceScore: 82,
    totalScore: 76,
  },
  {
    departmentId: 3,
    name: 'People',
    environmentalScore: 70,
    socialScore: 88,
    governanceScore: 80,
    totalScore: 79,
  },
];

export async function mockAdapter(config) {
  await delay(180);

  const method = (config.method || 'get').toLowerCase();
  const path = normalizePath(config.url);
  const body = parseBody(config.data);

  try {
    if (method === 'get' && path === '/employees') {
      return ok(config, employees);
    }

    if (method === 'get' && path.match(/^\/employees\/\d+$/)) {
      const employeeId = Number(path.split('/')[2]);
      const employee = employees.find((item) => item.id === employeeId);
      return employee ? ok(config, employee) : notFound(config, 'Employee not found');
    }

    if (
      method === 'get' &&
      path.match(/^\/employees\/\d+\/acknowledgement-status$/)
    ) {
      const employeeId = Number(path.split('/')[2]);
      return ok(config, getAcknowledgementStatus(employeeId));
    }

    if (method === 'get' && path === '/departments') {
      return ok(config, departments);
    }

    if (method === 'get' && path === '/emission-factors') {
      return ok(config, emissionFactors);
    }

    if (method === 'get' && path === '/carbon-transactions') {
      return ok(config, carbonTransactions);
    }

    if (method === 'get' && path === '/carbon-transactions/summary') {
      return ok(config, getCarbonSummary());
    }

    if (method === 'post' && path === '/carbon-transactions') {
      const transaction = createCarbonTransaction(body);
      carbonTransactions.unshift(transaction);
      return ok(config, transaction, 201);
    }

    if (method === 'get' && path === '/policies') {
      return ok(config, policies);
    }

    if (method === 'post' && path === '/policies') {
      const policy = {
        id: nextPolicyId,
        title: body.title,
        description: body.description,
      };
      nextPolicyId += 1;
      policies.unshift(policy);
      return ok(config, policy, 201);
    }

    if (method === 'post' && path.match(/^\/policies\/\d+\/acknowledge$/)) {
      const policyId = Number(path.split('/')[2]);
      const employeeId = Number(body.employeeId);
      const acknowledgedIds =
        acknowledgedPolicyIdsByEmployee[employeeId] || new Set();

      if (acknowledgedIds.has(policyId)) {
        return conflict(config, 'Policy already acknowledged');
      }

      acknowledgedIds.add(policyId);
      acknowledgedPolicyIdsByEmployee[employeeId] = acknowledgedIds;
      return ok(config, { policyId, employeeId, acknowledged: true }, 201);
    }

    if (method === 'get' && path === '/scores/departments') {
      return ok(config, departmentScores);
    }

    if (method === 'get' && path === '/scores/overall') {
      return ok(config, getOverallScore());
    }

    if (method === 'get' && path === '/reports/esg-summary') {
      return ok(config, getReportRows());
    }

    if (method === 'get' && path === '/reports/esg-summary/csv') {
      return ok(config, createCsvBlob(getReportRows()));
    }

    return notFound(config, 'Mock endpoint not found');
  } catch (err) {
    return error(config, err.message || 'Mock API error');
  }
}

function createCarbonTransaction(body) {
  const department = departments.find((item) => item.id === Number(body.departmentId));
  const factor = emissionFactors.find(
    (item) => item.id === Number(body.emissionFactorId)
  );
  const quantity = Number(body.quantity);
  const co2Calculated = Number((quantity * factor.co2PerUnit).toFixed(2));

  const transaction = {
    id: nextCarbonTransactionId,
    departmentId: department.id,
    departmentName: department.name,
    emissionFactorId: factor.id,
    activityType: factor.activityType,
    quantity,
    date: body.date,
    co2Calculated,
  };

  nextCarbonTransactionId += 1;
  return transaction;
}

function getCarbonSummary() {
  return departments.map((department) => {
    const totalCO2 = carbonTransactions
      .filter((transaction) => transaction.departmentId === department.id)
      .reduce((total, transaction) => total + Number(transaction.co2Calculated), 0);

    return {
      departmentId: department.id,
      departmentName: department.name,
      totalCO2: Number(totalCO2.toFixed(2)),
    };
  });
}

function getAcknowledgementStatus(employeeId) {
  const acknowledgedIds =
    acknowledgedPolicyIdsByEmployee[employeeId] || new Set();

  return policies.map((policy) => ({
    policyId: policy.id,
    title: policy.title,
    acknowledged: acknowledgedIds.has(policy.id),
  }));
}

function getOverallScore() {
  const count = departmentScores.length;
  const average = (key) =>
    Math.round(
      departmentScores.reduce((total, score) => total + score[key], 0) / count
    );

  return {
    overallScore: average('totalScore'),
    environmentalAvg: average('environmentalScore'),
    socialAvg: average('socialScore'),
    governanceAvg: average('governanceScore'),
  };
}

function getReportRows() {
  return departmentScores.map((score) => {
    const departmentSummary = getCarbonSummary().find(
      (summary) => summary.departmentId === score.departmentId
    );

    return {
      departmentId: score.departmentId,
      departmentName: score.name,
      environmentalScore: score.environmentalScore,
      socialScore: score.socialScore,
      governanceScore: score.governanceScore,
      totalScore: score.totalScore,
      totalCO2: departmentSummary?.totalCO2 ?? 0,
    };
  });
}

function createCsvBlob(rows) {
  const columns = Object.keys(rows[0] || {});
  const csvRows = [
    columns.join(','),
    ...rows.map((row) =>
      columns.map((column) => JSON.stringify(row[column] ?? '')).join(',')
    ),
  ];

  return new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8' });
}

function normalizePath(url = '') {
  const parsedUrl = new URL(url, 'http://mock.local');
  return parsedUrl.pathname.replace(/^\/api/, '');
}

function parseBody(data) {
  if (!data) return {};
  if (typeof data === 'string') return JSON.parse(data);
  return data;
}

function ok(config, data, status = 200) {
  return {
    config,
    data,
    headers: {},
    request: {},
    status,
    statusText: status === 201 ? 'Created' : 'OK',
  };
}

function error(config, message, status = 500) {
  return Promise.reject({
    config,
    response: {
      data: { message },
      status,
    },
  });
}

function conflict(config, message) {
  return error(config, message, 409);
}

function notFound(config, message) {
  return error(config, message, 404);
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
