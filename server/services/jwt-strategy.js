const usersService = require("./users");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("Bearer");
console.log(process.env.JWT_SECRET);
opts.secretOrKey = process.env.JWT_SECRET;
// opts.issuer = "https://localhost:3000";
// opts.audience = "https://localhost:3000";

opts.passReqToCallback = true;

const jwtStrategy = new JwtStrategy(opts, function (req, jwt_payload, done) {
  usersService.getUserById(jwt_payload.sub).then((user) => {
    console.log(user);
    if (user) {
      req.user = user;
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

module.exports = jwtStrategy;
