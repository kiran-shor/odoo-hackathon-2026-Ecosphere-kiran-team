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

module.exports = {
  activitySchema,
  carbonTransactionSchema,
  employeeIdSchema,
  participationSchema,
  policySchema,
};
