/**
 * Repository Factory
 * Selecciona la implementación de repositorio según la variable de entorno DB_TYPE
 * Esto permite cambiar entre MongoDB y PostgreSQL sin modificar los Use Cases
 */

const DB_TYPE = process.env.DB_TYPE || 'mongodb';

// Importar repositorios MongoDB
import MongoUserRepository from './mongo/userRepository.js';
import MongoWorkspaceRepository from './mongo/workspaceRepository.js';
import MongoBoardRepository from './mongo/boardRepository.js';
import MongoColumnRepository from './mongo/columnRepository.js';
import MongoTaskRepository from './mongo/taskRepository.js';
import MongoActivityRepository from './mongo/activityRepository.js';
import MongoNotificationRepository from './mongo/notificationRepository.js';

// Importar repositorios Prisma (PostgreSQL)
import PrismaUserRepository from './prisma/userRepository.js';
import PrismaWorkspaceRepository from './prisma/workspaceRepository.js';
import PrismaBoardRepository from './prisma/BoardRepository.js';
import PrismaColumnRepository from './prisma/ColumnRepository.js';
import PrismaTaskRepository from './prisma/TaskRepository.js';
import PrismaActivityRepository from './prisma/ActivityRepository.js';
import PrismaNotificationRepository from './prisma/NotificationRepository.js';

/**
 * Factory para crear instancias de repositorios
 */
class RepositoryFactory {
  constructor() {
    this.dbType = DB_TYPE;
    console.log(`🗄️  Using ${this.dbType.toUpperCase()} repositories`);
  }

  /**
   * Obtener repositorio de usuarios
   */
  getUserRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaUserRepository();
    }
    return new MongoUserRepository();
  }

  /**
   * Obtener repositorio de workspaces
   */
  getWorkspaceRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaWorkspaceRepository();
    }
    return new MongoWorkspaceRepository();
  }

  /**
   * Obtener repositorio de boards
   */
  getBoardRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaBoardRepository();
    }
    return new MongoBoardRepository();
  }

  /**
   * Obtener repositorio de columns
   */
  getColumnRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaColumnRepository();
    }
    return new MongoColumnRepository();
  }

  /**
   * Obtener repositorio de tasks
   */
  getTaskRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaTaskRepository();
    }
    return new MongoTaskRepository();
  }

  /**
   * Obtener repositorio de activities
   */
  getActivityRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaActivityRepository();
    }
    return new MongoActivityRepository();
  }

  /**
   * Obtener repositorio de notifications
   */
  getNotificationRepository() {
    if (this.dbType === 'postgres') {
      return new PrismaNotificationRepository();
    }
    return new MongoNotificationRepository();
  }
}

// Exportar instancia única (Singleton)
const repositoryFactory = new RepositoryFactory();
export default repositoryFactory;
