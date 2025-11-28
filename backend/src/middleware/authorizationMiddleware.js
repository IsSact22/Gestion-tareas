import AppError from '../core/AppError.js';

/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos
 * @param  {...string} roles - Roles permitidos (ej: 'admin', 'member')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `No tienes permisos para realizar esta acción. Se requiere rol: ${roles.join(' o ')}`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Solo los administradores pueden realizar esta acción', 403));
  }

  next();
};

/**
 * Middleware para verificar si el usuario puede editar (admin o member)
 */
export const canEdit = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  if (req.user.role === 'viewer') {
    return next(new AppError('Los viewers no pueden realizar modificaciones', 403));
  }

  next();
};

/**
 * Middleware para verificar si el usuario puede comentar (admin o member)
 */
export const canComment = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  if (req.user.role === 'viewer') {
    return next(new AppError('Los viewers no pueden agregar comentarios', 403));
  }

  next();
};

/**
 * Middleware para verificar si el usuario puede eliminar
 * Solo admin o el creador del recurso
 */
export const canDelete = (resourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Usuario no autenticado', 401));
    }

    // Admin puede eliminar cualquier cosa
    if (req.user.role === 'admin') {
      return next();
    }

    // El creador puede eliminar su propio recurso
    if (resourceOwnerId && resourceOwnerId.toString() === req.user.id.toString()) {
      return next();
    }

    return next(new AppError('No tienes permisos para eliminar este recurso', 403));
  };
};

/**
 * Verificar si el usuario es el propietario del recurso o admin
 */
export const isOwnerOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError('Usuario no autenticado', 401));
      }

      // Admin puede hacer cualquier cosa
      if (req.user.role === 'admin') {
        return next();
      }

      // Obtener el ID del propietario del recurso
      const ownerId = await getOwnerId(req);
      
      if (ownerId && ownerId.toString() === req.user.id.toString()) {
        return next();
      }

      return next(new AppError('No tienes permisos para modificar este recurso', 403));
    } catch (error) {
      next(error);
    }
  };
};
