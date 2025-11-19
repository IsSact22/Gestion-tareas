import AppError from '../../core/AppError.js';
import { generateToken } from '../../core/jwtUtils.js';

export default class LoginUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    // Validar campos requeridos
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    // Buscar usuario con password
    const user = await this.userRepository.findByEmailWithPassword(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generar token (usar id o id para compatibilidad)
    const userId = user.id;
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
