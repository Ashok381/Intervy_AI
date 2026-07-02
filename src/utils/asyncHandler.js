import { Apierror } from "./Apierror.js";

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (res.headersSent) {
        return next(err);
      }

      const statusCode = err instanceof Apierror ? err.statusCode : 500;
      const message = err instanceof Error && err.message ? err.message : "Something went wrong";
      const errors = err instanceof Apierror ? err.errors : null;

      res.status(statusCode).json({
        statusCode,
        success: false,
        message: Array.isArray(errors) && errors.length ? errors : message,
        errors,
      });
    }
  };
};

export default asyncHandler;