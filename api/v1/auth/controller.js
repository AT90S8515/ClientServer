const {User} = require('../../../models');

module.exports.login = async function (req, res) {
  if (!req.body.email || !req.body.password) {
    return RE(res, 'Email and password are required');
  }

  // We need to explicitly tell mongoose to fetch the password since it's set to select: false
  const user = await User.findOne({email: req.body.email.toLowerCase()}).select('+password');

  if (!user || user.deleted || !(await user.comparePassword(req.body.password))) {
    return RE(res, 'Invalid information', 401);
  }

  if (!user.isActivated()) {
    return RE(res, 'User not activated', 401);
  }

  return RS(res, user.toJWT());
};

module.exports.register = async function (req, res) {
  let user = new User();
  Object.assign(user, req.body);
  [err, user] = await to(user.save());
  if (err) {
    return RE(res, err, 422);
  }
  // We don't return the user object since the user should be activated trough e-mail first
  return RS(res, {message: 'User created'}, 201);
};
