import UserRepository from "../../infrastructure/database/prisma/userRepository.js";

const userRepository = new UserRepository();

export async function getAllUsers(req, res, next) {
  try {
    let users;
    if (req.user.role === 'admin') {
      users = await userRepository.findAll();
    } else {
      users = await userRepository.findByTeam(req.user.id);
    }
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await userRepository.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function searchUsers(req, res, next) {
  try {
    const { q } = req.query;
    const users = await userRepository.search(q);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

// Usuario actualiza su propio perfil (NO puede cambiar su rol)
export async function updateUser(req, res, next) {
  try {
    const { name, avatar, password } = req.body;
    const updateData = { name, avatar };
    
    // Solo agregar password si se proporciona
    if (password) {
      updateData.password = password;
    }
    
    const user = await userRepository.update(req.user.id, updateData);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// Admin actualiza cualquier usuario (puede cambiar rol)
export async function updateUserByAdmin(req, res, next) {
  try {
    const { name, avatar, password, role } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (password) updateData.password = password;
    if (role) updateData.role = role;
    
    const user = await userRepository.update(req.params.id, updateData);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// Admin elimina un usuario
export async function deleteUser(req, res, next) {
  try {
    await userRepository.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}