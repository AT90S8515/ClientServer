const pe = require('parse-error');

to = function (promise) {
  return promise
    .then(data => [null, data])
    .catch(err => [pe(err)])
};

// Throw Error helper
TE = function (err_message, log) {
  if (log === true) {
    console.error(err_message);
  }

  throw new Error(err_message);
};

// Response Error
RE = function (res, err, responseCode = 400) {
  if (typeof err === 'object' && typeof err.message !== 'undefined') {
    err = err.message;
  }

  res.statusCode = responseCode;

  return res.json({
    success: false,
    error: err
  });
};

// Response Success
RS = function (res, data, responseCode = 200) {
  res.statusCode = responseCode;

  return res.json({
    success: true,
    data
  });
};

// Handle unhandled errors
process.on('unhandledRejection', error => {
  console.error('Uncaught Error', pe(error));
});
