import ColumnModel from "./columnModel.js";

export default class ColumnRepository {
  async findById(id) {
    return ColumnModel.findById(id).populate('board', 'name');
  }

  async findAll() {
    return ColumnModel.find().sort({ position: 1 });
  }

  async findByBoardId(boardId) {
    return ColumnModel.find({ board: boardId }).sort({ position: 1 });
  }

  async create(data) {
    const column = new ColumnModel(data);
    return column.save();
  }

  async update(id, data) {
    return ColumnModel.findByIdAndUpdate(id, data, {
      new: true,  
      runValidators: true
    });
  }

  async delete(id) {
    return ColumnModel.findByIdAndDelete(id);
  }

  async updatePosition(id, newPosition) {
    return ColumnModel.findByIdAndUpdate(
      id,
      { position: newPosition },
      { new: true }
    );
  }

  async updateMultiplePositions(updates) {
    // updates es un array de {id, position}
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { id: update.id },
        update: { $set: { position: update.position } }
      }
    }));

    return ColumnModel.bulkWrite(bulkOps);
  }

  async getMaxPosition(boardId) {
    const result = await ColumnModel.findOne({ board: boardId })
      .sort({ position: -1 })
      .select('position');
    return result ? result.position : -1;
  }
}
