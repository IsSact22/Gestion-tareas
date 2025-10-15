import UserModel from "./userModel.js";

export default class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async create(data) {
    const user = new UserModel(data);
    return user.save();
  }
}