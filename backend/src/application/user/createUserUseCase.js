export default class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) throw new Error("User already exists");

    return await this.userRepository.create(userData);
  }
}