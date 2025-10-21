import GetActivitiesUseCase from '../../application/activity/getActivitiesUseCase.js';
import ActivityRepository from '../../infrastructure/database/mongo/activityRepository.js';
import BoardRepository from '../../infrastructure/database/mongo/boardRepository.js';

const activityRepository = new ActivityRepository();
const boardRepository = new BoardRepository();

const getActivitiesUseCase = new GetActivitiesUseCase(activityRepository, boardRepository);

export async function getActivities(req, res, next) {
  try {
    const { boardId, limit } = req.query;
    const activities = await getActivitiesUseCase.execute({
      boardId,
      userId: req.user._id,
      limit: limit ? parseInt(limit) : 50
    });

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
}

export async function getMyActivities(req, res, next) {
  try {
    const { limit } = req.query;
    const activities = await activityRepository.findByUserId(
      req.user._id,
      limit ? parseInt(limit) : 50
    );

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    next(error);
  }
}
