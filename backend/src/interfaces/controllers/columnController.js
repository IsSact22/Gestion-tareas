import CreateColumnUseCase from '../../application/column/createColumnUseCase.js';
import GetColumnsUseCase from '../../application/column/getColumnsUseCase.js';
import UpdateColumnUseCase from '../../application/column/updateColumnUseCase.js';
import DeleteColumnUseCase from '../../application/column/deleteColumnUseCase.js';
import ReorderColumnsUseCase from '../../application/column/reorderColumnsUseCase.js';
import ColumnRepository from '../../infrastructure/database/mongo/columnRepository.js';
import BoardRepository from '../../infrastructure/database/mongo/boardRepository.js';
import TaskRepository from '../../infrastructure/database/mongo/taskRepository.js';

const columnRepository = new ColumnRepository();
const boardRepository = new BoardRepository();
const taskRepository = new TaskRepository();

const createColumnUseCase = new CreateColumnUseCase(columnRepository, boardRepository);
const getColumnsUseCase = new GetColumnsUseCase(columnRepository, boardRepository);
const updateColumnUseCase = new UpdateColumnUseCase(columnRepository, boardRepository);
const deleteColumnUseCase = new DeleteColumnUseCase(columnRepository, boardRepository, taskRepository);
const reorderColumnsUseCase = new ReorderColumnsUseCase(columnRepository, boardRepository);

export async function createColumn(req, res, next) {
  try {
    const { name, boardId, color } = req.body;
    const column = await createColumnUseCase.execute({
      name,
      boardId,
      userId: req.user._id,
      color
    });

    res.status(201).json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

export async function getColumns(req, res, next) {
  try {
    const { boardId } = req.query;
    const columns = await getColumnsUseCase.execute({
      boardId,
      userId: req.user._id,
      userRole: req.user.role
    });

    res.status(200).json({ success: true, data: columns });
  } catch (error) {
    next(error);
  }
}

export async function updateColumn(req, res, next) {
  try {
    const { name, color } = req.body;
    const column = await updateColumnUseCase.execute({
      columnId: req.params.id,
      userId: req.user._id,
      name,
      color
    });

    res.status(200).json({ success: true, data: column });
  } catch (error) {
    next(error);
  }
}

export async function deleteColumn(req, res, next) {
  try {
    const result = await deleteColumnUseCase.execute({
      columnId: req.params.id,
      userId: req.user._id
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function reorderColumns(req, res, next) {
  try {
    const { boardId, newOrder } = req.body;
    const result = await reorderColumnsUseCase.execute({
      boardId,
      userId: req.user._id,
      newOrder
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
