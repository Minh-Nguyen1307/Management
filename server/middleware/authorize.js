export const authorize = (roles = []) => {
    return (req, res, next) => {
      // If no roles are passed, it means this route is accessible to all authenticated users
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }
      next();
    };
  };