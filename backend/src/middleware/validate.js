function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({
        message: firstIssue ? firstIssue.message : "Invalid request body",
      });
    }

    req.body = result.data;
    return next();
  };
}

module.exports = { validate };
