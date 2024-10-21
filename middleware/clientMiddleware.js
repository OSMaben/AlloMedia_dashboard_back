const clientMiddleware = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
  
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Access denied. Clients only.' });
    }
  
    next();
  };
  
  module.exports = clientMiddleware;
  