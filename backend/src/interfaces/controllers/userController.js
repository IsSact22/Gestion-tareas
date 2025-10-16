import CreateUserUseCase from "../../application/user/createUserUseCase.js";
import UserRepository from "../../infrastructure/database/mongo/userRepository.js";

const userRepository = new UserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);

export async function createUser(req, res, next) {
  try {
    const user = await createUserUseCase.execute(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}