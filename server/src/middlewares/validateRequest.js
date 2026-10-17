const { ZodError } = require("zod");
const AppError = require("../utils/AppError");

const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);

      if (!result.success) {
        const message = result.error.issues
          .map((issue) => {
            const field = issue.path.join(".") || source;
            return `${field}: ${issue.message}`;
          })
          .join(", ");

        return next(new AppError(message, 400));
      }

      req[source] = result.data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new AppError("Invalid request data", 400));
      }

      next(error);
    }
  };
};

module.exports = validateRequest;
