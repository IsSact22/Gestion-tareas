import { verifyToken } from '../core/jwtUtils.js';
import UserRepository from '../infrastructure/database/mongo/userRepository.js';
import AppError from '../core/AppError.js';

const userRepository = new UserRepository();

export const protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized, no token provided', 401);
    }

    // Verificar token
    const decoded = verifyToken(token);

    // Obtener usuario del token
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Agregar usuario al request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
