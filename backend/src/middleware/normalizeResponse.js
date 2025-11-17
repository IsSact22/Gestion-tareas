/**
 * Middleware para normalizar respuestas entre MongoDB y Prisma
 * Asegura que todos los objetos tengan tanto 'id' como '_id'
 */

/**
 * Normaliza un objeto para tener ambos id y _id
 */
function normalizeObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Si es un array, normalizar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(item => normalizeObject(item));
  }

  // Si es una fecha, devolverla tal cual
  if (obj instanceof Date) {
    return obj;
  }

  // Crear copia del objeto
  const normalized = { ...obj };

  // Si tiene id o _id, asegurar que tenga ambos
  if (obj.id || obj._id) {
    const idValue = obj.id || obj._id;
    normalized.id = idValue;
    normalized._id = idValue;
  }

  // Normalizar recursivamente todas las propiedades
  for (const key in normalized) {
    if (normalized.hasOwnProperty(key) && key !== 'id' && key !== '_id') {
      normalized[key] = normalizeObject(normalized[key]);
    }
  }

  return normalized;
}

/**
 * Middleware Express para normalizar respuestas
 */
export default function normalizeResponse(req, res, next) {
  // Guardar el método json original
  const originalJson = res.json.bind(res);

  // Sobrescribir el método json
  res.json = function(data) {
    // Normalizar los datos antes de enviarlos
    const normalizedData = normalizeObject(data);
    return originalJson(normalizedData);
  };

  next();
}
