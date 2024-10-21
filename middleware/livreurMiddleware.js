const livreurMiddleware = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated hhh' });
    }
  
    if (req.user.role !== 'livreur') {
      console.log(req.user.role);
      return res.status(403).json({ message: 'Access denied. Livreurs only.' });
      
    }

    next();
  };
  
  module.exports = livreurMiddleware;
  