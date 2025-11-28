# 📚 API Documentation - Sistema Kanban

Base URL: `http://localhost:5000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": null,
      "role": "member"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## 👥 Users

### Get All Users
```http
GET /users
Authorization: Bearer {token}
```

### Search Users
```http
GET /users/search?q=john
Authorization: Bearer {token}
```

### Get User by ID
```http
GET /users/:id
Authorization: Bearer {token}
```

### Update Profile
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

## 🏢 Workspaces

### Create Workspace
```http
POST /workspaces
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Workspace",
  "description": "Project workspace"
}
```

### Get All Workspaces
```http
GET /workspaces
Authorization: Bearer {token}
```

### Get Workspace by ID
```http
GET /workspaces/:id
Authorization: Bearer {token}
```

### Update Workspace
```http
PUT /workspaces/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Workspace",
  "description": "New description"
}
```

### Delete Workspace
```http
DELETE /workspaces/:id
Authorization: Bearer {token}
```

### Add Member to Workspace
```http
POST /workspaces/:id/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "member@example.com",
  "role": "member"  // admin, member, viewer
}
```

### Remove Member from Workspace
```http
DELETE /workspaces/:id/members/:userId
Authorization: Bearer {token}
```

---

## 📋 Boards

### Create Board
```http
POST /boards
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Sprint Board",
  "description": "Sprint planning board",
  "workspaceId": "workspace_id"
}
```

### Get All Boards
```http
GET /boards?workspaceId=workspace_id
Authorization: Bearer {token}
```

### Get Board by ID
```http
GET /boards/:id
Authorization: Bearer {token}
```

### Update Board
```http
PUT /boards/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Board",
  "description": "New description"
}
```

### Delete Board
```http
DELETE /boards/:id
Authorization: Bearer {token}
```

### Add Member to Board
```http
POST /boards/:id/members
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "role": "member"
}
```

### Remove Member from Board
```http
DELETE /boards/:id/members/:userId
Authorization: Bearer {token}
```

---

## 📊 Columns

### Create Column
```http
POST /columns
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "To Do",
  "boardId": "board_id",
  "color": "#3B82F6"
}
```

### Get Columns
```http
GET /columns?boardId=board_id
Authorization: Bearer {token}
```

### Update Column
```http
PUT /columns/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "In Progress",
  "color": "#F59E0B"
}
```

### Delete Column
```http
DELETE /columns/:id
Authorization: Bearer {token}
```

### Reorder Columns
```http
POST /columns/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "boardId": "board_id",
  "newOrder": ["col_id_1", "col_id_2", "col_id_3"]
}
```

---

## ✅ Tasks

### Create Task
```http
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Implement login feature",
  "description": "Create login page with JWT authentication",
  "columnId": "column_id",
  "assignedTo": "user_id",
  "priority": "high",
  "dueDate": "2025-10-30",
  "tags": ["frontend", "auth"]
}
```

**Priority values:** `low`, `medium`, `high`, `urgent`

### Get Tasks
```http
GET /tasks?boardId=board_id
GET /tasks?columnId=column_id
Authorization: Bearer {token}
```

### Get My Tasks
```http
GET /tasks/my-tasks
Authorization: Bearer {token}
```

### Search Tasks
```http
GET /tasks/search?boardId=board_id&q=login
Authorization: Bearer {token}
```

### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer {token}
```

### Update Task
```http
PUT /tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "assignedTo": "user_id",
  "priority": "urgent",
  "dueDate": "2025-11-01",
  "tags": ["frontend", "auth", "security"]
}
```

### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer {token}
```

### Move Task (Drag & Drop)
```http
POST /tasks/:id/move
Authorization: Bearer {token}
Content-Type: application/json

{
  "newColumnId": "column_id",
  "newPosition": 2
}
```

### Add Comment to Task
```http
POST /tasks/:id/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "This looks good! Ready for review."
}
```

---

## 📝 Activities

### Get Board Activities
```http
GET /activities?boardId=board_id&limit=50
Authorization: Bearer {token}
```

### Get My Activities
```http
GET /activities/my-activities?limit=50
Authorization: Bearer {token}
```

---

## 🏥 Health Check

### Check API Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "env": "development"
}
```

---

## 🔒 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 🎯 Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🧪 Testing with Thunder Client / Postman

1. **Register a user** → Get token
2. **Create a workspace**
3. **Create a board** in the workspace
4. **Create columns** (To Do, In Progress, Done)
5. **Create tasks** in columns
6. **Move tasks** between columns
7. **Add comments** to tasks
8. **View activities**

---

## 🚀 Example Workflow

```bash
# 1. Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
# Save the token!

# 2. Create Workspace
POST /api/workspaces
Authorization: Bearer {token}
{
  "name": "My Project",
  "description": "Main project workspace"
}
# Save workspace ID

# 3. Create Board
POST /api/boards
Authorization: Bearer {token}
{
  "name": "Sprint 1",
  "workspaceId": "{workspace_id}"
}
# Save board ID

# 4. Create Columns
POST /api/columns
{
  "name": "To Do",
  "boardId": "{board_id}",
  "color": "#EF4444"
}

POST /api/columns
{
  "name": "In Progress",
  "boardId": "{board_id}",
  "color": "#F59E0B"
}

POST /api/columns
{
  "name": "Done",
  "boardId": "{board_id}",
  "color": "#10B981"
}

# 5. Create Task
POST /api/tasks
{
  "title": "Setup database",
  "description": "Configure MongoDB connection",
  "columnId": "{todo_column_id}",
  "priority": "high",
  "dueDate": "2025-10-25"
}

# 6. Move Task
POST /api/tasks/{task_id}/move
{
  "newColumnId": "{in_progress_column_id}",
  "newPosition": 0
}
```
