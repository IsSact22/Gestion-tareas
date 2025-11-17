import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuraTask API',
      version: '1.0.0',
      description: 'Sistema de gestión de tareas y proyectos colaborativos con roles y permisos',
      contact: {
        name: 'API Support',
        email: 'support@auratask.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.auratask.com/api',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT obtenido del login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'isaac',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'isaac@test.com',
            },
            role: {
              type: 'string',
              enum: ['admin', 'member', 'viewer'],
              example: 'member',
              description: 'admin: acceso total | member: puede editar | viewer: solo lectura',
            },
            avatar: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/avatar.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Workspace: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Proyecto Alpha',
            },
            description: {
              type: 'string',
              example: 'Workspace para el desarrollo del proyecto Alpha',
            },
            owner: {
              $ref: '#/components/schemas/User',
            },
            members: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    $ref: '#/components/schemas/User',
                  },
                  role: {
                    type: 'string',
                    enum: ['admin', 'member', 'viewer'],
                  },
                },
              },
            },
            boards: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Board: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Sprint 1',
            },
            description: {
              type: 'string',
              example: 'Board para el primer sprint',
            },
            color: {
              type: 'string',
              example: '#8B5CF6',
              description: 'Color en formato hexadecimal',
            },
            workspace: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            members: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                    enum: ['admin', 'member', 'viewer'],
                  },
                },
              },
            },
            columns: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Column: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'To Do',
            },
            board: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            color: {
              type: 'string',
              example: '#3B82F6',
            },
            order: {
              type: 'number',
              example: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              example: 'Implementar autenticación',
            },
            description: {
              type: 'string',
              example: 'Implementar sistema de login con JWT',
            },
            status: {
              type: 'string',
              enum: ['todo', 'in-progress', 'done'],
              example: 'in-progress',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              example: 'high',
            },
            board: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            column: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            assignedTo: {
              type: 'string',
              nullable: true,
              example: '507f1f77bcf86cd799439011',
            },
            createdBy: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['backend', 'security'],
            },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                  },
                  user: {
                    type: 'string',
                  },
                  text: {
                    type: 'string',
                  },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Autenticación y autorización',
      },
      {
        name: 'Users',
        description: 'Gestión de usuarios',
      },
      {
        name: 'Workspaces',
        description: 'Gestión de espacios de trabajo',
      },
      {
        name: 'Boards',
        description: 'Gestión de tableros',
      },
      {
        name: 'Columns',
        description: 'Gestión de columnas',
      },
      {
        name: 'Tasks',
        description: 'Gestión de tareas',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/infrastructure/webserver/express/routes/*.js',
    './src/docs/swagger/*.yaml',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
