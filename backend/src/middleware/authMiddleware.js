import { verifyToken } from '../core/jwtUtils.js';
import repositoryFactory from '../infrastructure/database/repositoryFactory.js';
import AppError from '../core/AppError.js';

const userRepository = repositoryFactory.getUserRepository();

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
    // Normalizar: MongoDB usa _id, Prisma usa id
    req.user = {
      ...user,
      _id: user.id || user._id, // Compatibilidad con código existente
      id: user.id || user._id    // Asegurar que siempre existe id
    };
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
