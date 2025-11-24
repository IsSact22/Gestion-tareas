import prisma from "./client.js";

export default class TeamRepository {
  async create(data) {
    return prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findAll() {
    return prisma.team.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findById(id) {
    return prisma.team.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByUser(userId) {
    return prisma.team.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async update(id, data) {
    return prisma.team.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.members && { members: { set: data.members } })
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async addMember(id, userId) {
    return prisma.team.update({
      where: { id },
      data: {
        members: { connect: { userId } }
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async removeMember(id, userId) {
    return prisma.team.update({
      where: { id },
      data: {
        members: { disconnect: { userId } }
      },
      select: {
        id: true,
        name: true,
        description: true,
        ownerId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getMembers(id) {
    return prisma.team.findUnique({
      where: { id },
      select: {
        members: true
      }
    });
  }

  async delete(id) {
    return prisma.team.delete({
      where: { id }
    });
  }
}
