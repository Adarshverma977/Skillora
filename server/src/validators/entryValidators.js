const { z } = require("zod");

const createEntrySchema = z.object({
  topic: z
    .string()
    .trim()
    .min(2, "Topic must contain at least 2 characters")
    .max(100, "Topic cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description cannot exceed 5000 characters"),

  studyDurationMinutes: z
    .number()
    .int("Study duration must be a whole number")
    .min(1, "Study duration must be at least 1 minute")
    .max(1440, "Study duration cannot exceed 1440 minutes"),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  learningDate: z.coerce.date().optional(),
});

const entryIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid learning entry ID"),
});

const updateEntrySchema = z
  .object({
    topic: z
      .string()
      .trim()
      .min(2, "Topic must contain at least 2 characters")
      .max(100, "Topic cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(5000, "Description cannot exceed 5000 characters")
      .optional(),

    studyDurationMinutes: z
      .number()
      .int("Study duration must be a whole number")
      .min(1, "Study duration must be at least 1 minute")
      .max(1440, "Study duration cannot exceed 1440 minutes")
      .optional(),

    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),

    learningDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

  const getEntriesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),

    search: z.string().trim().max(100).optional(),

    difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),

    sort: z.enum(["newest", "oldest"]).default("newest"),
  });

module.exports = {
  createEntrySchema,
  entryIdSchema,
  updateEntrySchema,
  getEntriesQuerySchema,
};
