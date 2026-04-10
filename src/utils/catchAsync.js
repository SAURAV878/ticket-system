const catchAsync = (fn) => {
  return (req, res, next) => {
    // This wrapper catches any error and passes it directly to your GlobalErrorHandler
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;