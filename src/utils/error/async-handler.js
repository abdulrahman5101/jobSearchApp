export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error.message))
    });
  };
};
