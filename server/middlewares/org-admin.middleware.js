const orgAdminMiddleware = (req, res, next) => {
  if (req.org.org_member_role !== "admin") {
    return res.status(403).json({ message: "You are not authorized" });
  }

  next();
};

module.exports = orgAdminMiddleware;
