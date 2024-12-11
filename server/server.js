const passport = require("passport");
const app = require("./server-config.js");
const routes = require("./routes");
const jwtStrategy = require("./services/jwt-strategy.js");

const port = process.env.PORT || 5000;

passport.use(jwtStrategy);

app.use("/api", routes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
