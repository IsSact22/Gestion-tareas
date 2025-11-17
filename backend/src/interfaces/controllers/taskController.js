import CreateTaskUseCase from '../../application/task/createTaskUseCase.js';
import GetTasksUseCase from '../../application/task/getTasksUseCase.js';
import GetTaskByIdUseCase from '../../application/task/getTaskByIdUseCase.js';
import UpdateTaskUseCase from '../../application/task/updateTaskUseCase.js';
import DeleteTaskUseCase from '../../application/task/deleteTaskUseCase.js';
import MoveTaskUseCase from '../../application/task/moveTaskUseCase.js';
import AddCommentUseCase from '../../application/task/addCommentUseCase.js';
import DeleteCommentUseCase from '../../application/task/deleteCommentUseCase.js';
import SearchTasksUseCase from '../../application/task/searchTasksUseCase.js';
import repositoryFactory from '../../infrastructure/database/repositoryFactory.js';

const taskRepository = repositoryFactory.getTaskRepository();
const columnRepository = repositoryFactory.getColumnRepository();
const boardRepository = repositoryFactory.getBoardRepository();
const activityRepository = repositoryFactory.getActivityRepository();

const createTaskUseCase = new CreateTaskUseCase(taskRepository, columnRepository, boardRepository, activityRepository);
const getTasksUseCase = new GetTasksUseCase(taskRepository, boardRepository);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository, boardRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, boardRepository, activityRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, boardRepository, activityRepository);
const moveTaskUseCase = new MoveTaskUseCase(taskRepository, columnRepository, boardRepository, activityRepository);
const addCommentUseCase = new AddCommentUseCase(taskRepository, boardRepository, activityRepository);
const deleteCommentUseCase = new DeleteCommentUseCase(taskRepository, boardRepository, activityRepository);
const searchTasksUseCase = new SearchTasksUseCase(taskRepository, boardRepository);

export async function createTask(req, res, next) {
  try {
    const { title, description, columnId, assignedTo, priority, dueDate, tags } = req.body;
    const task = await createTaskUseCase.execute({
      title,
      description,
      columnId,
      userId: req.user._id,
      assignedTo,
      priority,
      dueDate,
      tags
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const { boardId, columnId } = req.query;
    const tasks = await getTasksUseCase.execute({
      boardId,
      columnId,
      userId: req.user._id,
      userRole: req.user.role
    });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await getTaskByIdUseCase.execute({
      taskId: req.params.id,
      userId: req.user._id
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { title, description, assignedTo, priority, dueDate, tags } = req.body;
    const task = await updateTaskUseCase.execute({
      taskId: req.params.id,
      userId: req.user._id,
      title,
      description,
      assignedTo,
      priority,
      dueDate,
      tags
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const result = await deleteTaskUseCase.execute({
      taskId: req.params.id,
      userId: req.user._id
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function moveTask(req, res, next) {
  try {
    const { newColumnId, newPosition } = req.body;
    const task = await moveTaskUseCase.execute({
      taskId: req.params.id,
      userId: req.user._id,
      newColumnId,
      newPosition
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    const task = await addCommentUseCase.execute({
      taskId: req.params.id,
      userId: req.user._id,
      text
    });

    // Devolver solo el último comentario agregado
    const lastComment = task.comments[task.comments.length - 1];
    res.status(200).json({ success: true, data: lastComment });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    await deleteCommentUseCase.execute({
      taskId: req.params.id,
      commentId: req.params.commentId,
      userId: req.user._id
    });

    res.status(200).json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    next(error);
  }
}

export async function searchTasks(req, res, next) {
  try {
    const { boardId, q } = req.query;
    const tasks = await searchTasksUseCase.execute({
      boardId,
      userId: req.user._id,
      query: q
    });

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

export async function getMyTasks(req, res, next) {
  try {
    const tasks = await taskRepository.findByAssignedUser(req.user._id);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}

// Admin: Obtener TODAS las tareas del sistema
export async function getAllTasksAdmin(req, res, next) {
  try {
    const tasks = await taskRepository.findAll();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
}
