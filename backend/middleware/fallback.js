/*
  eslint no-unused-vars: off
  ------
  turn off unused-vars warn in this file
  - EsLint is mad for unused 'next' parameter,
  but this function must have 4 params to be disguised as an error handler.
*/

// Handlers with 4 parameters are disguised as error handlers
function fallback (err, req, res, next) {
  res.status(err.status ?? 500);
  res.send({ error: err.message ?? "Unknown error occured" });
};

module.exports = fallback;
