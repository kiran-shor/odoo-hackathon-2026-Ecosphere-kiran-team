export const mockActivities = [
  {
    id: 1,
    title: 'Tree Plantation Drive',
    category: 'Environment',
    description: 'Plant saplings around the campus',
    departmentId: 1,
    pointsReward: 30,
    status: 'active',
  },
];

export const mockPendingParticipation = [
  {
    id: 1,
    employeeId: 2,
    employeeName: 'Vikram Shah',
    activityId: 1,
    activityTitle: 'Tree Plantation Drive',
    proof: 'drive-photo-link',
    status: 'pending',
    createdAt: '2026-07-12T09:00:00Z',
  },
];

export const mockLeaderboard = [
  {
    id: 1,
    name: 'Asha Rao',
    departmentId: 1,
    departmentName: 'Operations',
    points: 150,
    badges: [
      {
        id: 2,
        name: 'Sustainability Champion',
        description: 'Serious ESG contributor',
        icon: 'Trophy',
      },
    ],
  },
];

export const mockRewards = [
  {
    id: 1,
    name: 'Company Merch Kit',
    description: 'Branded swag bag',
    pointsRequired: 100,
    stock: 20,
    status: 'active',
  },
];
