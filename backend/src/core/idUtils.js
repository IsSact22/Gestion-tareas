/**
 * Utilidades para manejar IDs de forma compatible entre MongoDB y Prisma
 * MongoDB usa ObjectId que necesita .toString()
 * Prisma usa strings directamente
 */

/**
 * Convierte un ID a string de forma segura
 * @param {string|Object} id - ID de MongoDB (ObjectId) o Prisma (string)
 * @returns {string} ID como string
 */
export function toStringId(id) {
  if (!id) return null;
  
  // Si ya es string, devolverlo
  if (typeof id === 'string') {
    return id;
  }
  
  // Si tiene método toString (ObjectId de MongoDB)
  if (id.toString && typeof id.toString === 'function') {
    return id.toString();
  }
  
  // Fallback: convertir a string
  return String(id);
}

/**
 * Normaliza un objeto para que tenga tanto id como _id
 * @param {Object} obj - Objeto con id o _id
 * @returns {Object} Objeto con ambos campos
 */
export function normalizeId(obj) {
  if (!obj) return obj;
  
  const id = obj.id || obj._id;
  return {
    ...obj,
    id: id,
    _id: id
  };
}
