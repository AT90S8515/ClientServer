const passport = require('passport');
const passportJWT = require('passport-jwt');
const extractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const {User} = require('../models');

module.exports.strategy = function () {
  new JWTStrategy({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false,
    jsonWebTokenOptions: {
      expiresIn: process.env.JWT_EXPIRES
    }
  }, async (jwtPayload, next) => {
    console.log('PAYLOAD', jwtPayload);

    const user = await User.findById(jwtPayload.id);

    if (!user) {
      return next(null, false);
    }

    return next(null, user);
  });
};

module.exports = passport.authenticate('jwt', {session: false});
