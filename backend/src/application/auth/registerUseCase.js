import AppError from '../../core/AppError.js';
import { generateToken } from '../../core/jwtUtils.js';

export default class RegisterUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ name, email, password, role = 'member' }) {
    // Validar que el email no exista
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Validar campos requeridos
    if (!name || !email || !password) {
      throw new AppError('Please provide name, email and password', 400);
    }

    // Validar longitud de password
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Validar rol
    const validRoles = ['admin', 'member', 'viewer'];
    if (role && !validRoles.includes(role)) {
      throw new AppError('Invalid role. Must be: admin, member, or viewer', 400);
    }

    // Crear usuario
    const user = await this.userRepository.create({
      name,
      email,
      password,
      role: role || 'member'
    });

    // Generar token (usar id o _id para compatibilidad)
    const userId = user.id || user._id;
    const token = generateToken(userId);

    return {
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      token
    };
  }
}
