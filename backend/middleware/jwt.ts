import jwt from 'jsonwebtoken';

// Middleware for verify JWT
const verifyToken = (req: any, res: any, next: Function) => {    
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }

    // Verifica il token JWT
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      req.body.userId = decodedToken.userId;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
};

export default verifyToken