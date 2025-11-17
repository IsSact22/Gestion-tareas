import CreateColumnUseCase from '../../application/column/createColumnUseCase.js';
import GetColumnsUseCase from '../../application/column/getColumnsUseCase.js';
import UpdateColumnUseCase from '../../application/column/updateColumnUseCase.js';
import DeleteColumnUseCase from '../../application/column/deleteColumnUseCase.js';
import ReorderColumnsUseCase from '../../application/column/reorderColumnsUseCase.js';
import repositoryFactory from '../../infrastructure/database/repositoryFactory.js';

const columnRepository = repositoryFactory.getColumnRepository();
const boardRepository = repositoryFactory.getBoardRepository();
const taskRepository = repositoryFactory.getTaskRepository();

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
