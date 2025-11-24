import TeamRepository from "../../infrastructure/database/prisma/teamRepository.js";
import { AppError } from "../../utils/appError.js";

const teamRepository = new TeamRepository();

export async function createTeam(req, res, next) {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      throw new AppError('Team name is required', 400);
    }

    const team = await teamRepository.create({
      name,
      description,
      ownerId: req.user.id
    });

    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
}

export async function getTeams(req, res, next) {
  try {
    // Si es admin, obtener todos los teams
    // Si no es admin, obtener solo sus teams
    let teams;
    
    if (req.user.role === 'admin') {
      teams = await teamRepository.findAll();
    } else {
      teams = await teamRepository.findByUser(req.user.id);
    }

    res.status(200).json({ success: true, data: teams });
  } catch (error) {
    next(error);
  }
}

export async function getTeamById(req, res, next) {
  try {
    const team = await teamRepository.findById(req.params.id);
    
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
}

export async function updateTeam(req, res, next) {
  try {
    const { name, description } = req.body;
    const team = await teamRepository.findById(req.params.id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Solo el propietario o admin puede actualizar
    if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this team', 403);
    }

    const updatedTeam = await teamRepository.update(req.params.id, {
      name: name || team.name,
      description: description !== undefined ? description : team.description
    });

    res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    next(error);
  }
}

export async function deleteTeam(req, res, next) {
  try {
    const team = await teamRepository.findById(req.params.id);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Solo el propietario o admin puede eliminar
    if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to delete this team', 403);
    }

    await teamRepository.delete(req.params.id);

    res.status(200).json({ success: true, message: 'Team deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function addMemberToTeam(req, res, next) {
  try {
    const teamId = req.params.id;
    const memberId = req.body.memberId;

    if (!memberId) {
      throw new AppError('Member ID is required', 400);
    }

    const team = await teamRepository.findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Solo el propietario o admin puede agregar miembros
    if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to add members to this team', 403);
    }

    await teamRepository.addMember(teamId, memberId);

    res.status(200).json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    next(error);
  }
}

export async function removeMemberFromTeam(req, res, next) {
  try {
    const teamId = req.params.id;
    const memberId = req.body.memberId;

    if (!memberId) {
      throw new AppError('Member ID is required', 400);
    }

    const team = await teamRepository.findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Solo el propietario o admin puede eliminar miembros
    if (team.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new AppError('Not authorized to remove members from this team', 403);
    }

    await teamRepository.removeMember(teamId, memberId);

    res.status(200).json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getTeamMembers(req, res, next) {
  try {
    const teamId = req.params.id;

    const team = await teamRepository.findById(teamId);

    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const members = await teamRepository.getMembers(teamId);

    res.status(200).json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
}
