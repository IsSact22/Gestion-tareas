import RegisterUseCase from '../../application/auth/registerUseCase.js';
import LoginUseCase from '../../application/auth/loginUseCase.js';
import GetMeUseCase from '../../application/auth/getMeUseCase.js';
import UserRepository from '../../infrastructure/database/prisma/UserRepository.js';

const userRepository = new UserRepository();
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const getMeUseCase = new GetMeUseCase(userRepository);

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const result = await registerUseCase.execute({ name, email, password, role });
    
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUseCase.execute({ email, password });
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await getMeUseCase.execute(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    // En JWT no hay logout del lado del servidor
    // El cliente debe eliminar el token
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
}
