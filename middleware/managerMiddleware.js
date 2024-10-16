const managerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "manager") {
    return res.status(403).json({ message: "Access denied. Managers only." });
  }

  next();
};

module.exports = managerMiddleware;
