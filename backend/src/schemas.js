const { z } = require("zod");

const id = z.coerce.number().int().positive();
const optionalText = z.string().trim().max(1000).optional();

const carbonTransactionSchema = z.object({
  departmentId: id,
  emissionFactorId: id,
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  date: z.coerce.date().optional(),
});

const activitySchema = z.object({
  title: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(80),
  description: optionalText,
  departmentId: id.optional().nullable(),
  pointsReward: z.coerce.number().int().positive(),
});

const participationSchema = z.object({
  employeeId: id,
  activityId: id,
  proof: optionalText,
});

const policySchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().min(5).max(2000),
});

const employeeIdSchema = z.object({
  employeeId: id,
});

const date = z.string().refine((value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}, "Use a valid date in YYYY-MM-DD format");
const goalSchema = z
  .object({
    departmentId: id,
    emissionFactorId: id.nullable().optional(),
    metricLabel: z.string().trim().min(2).max(180),
    targetValue: z.coerce.number().positive("Target must be greater than 0"),
    unit: z.string().trim().min(1).max(40),
    startDate: date,
    deadline: date,
  })
  .refine((goal) => goal.deadline >= goal.startDate, {
    message: "Deadline must be on or after the start date",
    path: ["deadline"],
  });

const goalUpdateSchema = z
  .object({
    targetValue: z.coerce.number().positive("Target must be greater than 0").optional(),
    deadline: date.optional(),
    status: z.enum(["active", "inactive"]).optional(),
  })
  .refine((update) => Object.keys(update).length > 0, "Provide at least one field to update");

module.exports = {
  activitySchema,
  carbonTransactionSchema,
  employeeIdSchema,
  goalSchema,
  goalUpdateSchema,
  participationSchema,
  policySchema,
};
