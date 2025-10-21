import UserRepository from "../../infrastructure/database/mongo/userRepository.js";

const userRepository = new UserRepository();

export async function getAllUsers(req, res, next) {
  try {
    const users = await userRepository.findAll();
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

export async function updateUser(req, res, next) {
  try {
    const { name, avatar } = req.body;
    const user = await userRepository.update(req.user._id, { name, avatar });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}