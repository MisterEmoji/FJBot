function isObjectEmpty(objectName) {
  return (
    objectName &&
    Object.keys(objectName).length === 0 &&
    objectName.constructor === Object
  );
}

// strips query parameters from the url by redirecting to the same url path without query
function stripURLQuery(req, res, next) {
  if (!isObjectEmpty(req.query)) res.redirect(req.path);
  else next();
}

module.exports = stripURLQuery;
