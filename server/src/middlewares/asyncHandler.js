// Express 4 no captura el rechazo de un handler async: sin esto, la petición queda colgada.
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
