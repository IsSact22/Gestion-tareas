import UserModel from "./userModel.js";

export default class UserRepository {
  async findById(id) {
    return UserModel.findById(id).select('-password');
  }

  async findByIdWithPassword(id) {
    return UserModel.findById(id).select('+password');
  }

  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findByEmailWithPassword(email) {
    return UserModel.findOne({ email }).select('+password');
  }

  async findAll() {
    return UserModel.find().select('-password');
  }

  async create(data) {
    const user = new UserModel(data);
    return user.save();
  }

  async update(id, data) {
    return UserModel.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true 
    }).select('-password');
  }

  async delete(id) {
    return UserModel.findByIdAndDelete(id);
  }

  async search(query) {
    return UserModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(10);
  }
}