function errorHandler(err, req, res, next) {
  // If a route/controller already set a status/code, respect it; otherwise default to 500.
  const statusCode = err.statusCode || err.status || 500;

  // Standard error shape required by the contract: { message: "..." }
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
}

module.exports = { errorHandler };
