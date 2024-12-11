const usersService = require("./users");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = process.env.JWT_SECRET;
opts.issuer = "https://localhost:3000";
opts.audience = "https://localhost:3000";

const jwtStrategy = new JwtStrategy(opts, function (jwt_payload, done) {
  usersService.getUserById(jwt_payload.sub).then((user) => {
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

module.exports = jwtStrategy;
