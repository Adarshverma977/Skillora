const { z } = require("zod");

const mongoIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID"),
});

module.exports = {
  mongoIdSchema,
};
