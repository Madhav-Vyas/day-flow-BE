# Day Flow Backend (day-flow-BE)

Express.js REST API built with TypeScript and MongoDB (Mongoose), following clean modular layered architecture.

## 🚀 Features

- **Runtime**: Node.js & Express 5
- **Language**: TypeScript with strict mode
- **Database**: MongoDB with Mongoose schemas, indexes, and validation
- **Dev Experience**: Fast hot-reload via `tsx watch`
- **Security & Utilities**:
  - `helmet` for HTTP security headers
  - `cors` configured for frontend integration
  - `morgan` HTTP request logger
  - Standardized JSON responses (`sendResponse`)
  - Centralized error handling (`ApiError`, Mongoose error transforms, 404 handler)
  - Graceful process shutdown (`SIGINT`, `SIGTERM`, DB disconnect)

---

## 📁 Project Architecture

```
day-flow-BE/
├── src/
│   ├── config/
│   │   ├── env.ts              # Typed environment variables
│   │   └── db.ts               # MongoDB connection & lifecycle
│   ├── controllers/
│   │   ├── health.controller.ts # Health check & service status
│   │   └── task.controller.ts   # Task request/response controller
│   ├── middleware/
│   │   ├── errorHandler.ts     # Global centralized error handler
│   │   └── notFoundHandler.ts  # 404 Not Found handler
│   ├── models/
│   │   └── task.model.ts       # Mongoose model & TS interfaces
│   ├── routes/
│   │   ├── index.ts            # Main v1 API router (/api/v1)
│   │   ├── health.routes.ts    # /api/v1/health
│   │   └── task.routes.ts      # /api/v1/tasks CRUD
│   ├── services/
│   │   └── task.service.ts     # Business logic & DB queries
│   ├── utils/
│   │   ├── apiError.ts         # Custom ApiError class
│   │   ├── apiResponse.ts      # Standard response formatter
│   │   └── logger.ts           # Formatted console logger
│   ├── app.ts                  # Express application setup
│   └── server.ts               # Server bootstrap & process lifecycle
├── .env                        # Local environment variables
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript compiler options
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Environment Setup
The `.env` file is pre-configured with default values:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/day-flow
```

### 3. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts server in development mode with live watch & reload |
| `npm run build` | Compiles TypeScript into the `dist/` folder |
| `npm start` | Runs the compiled production build from `dist/server.js` |

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status and overview |
| `GET` | `/api/v1/health` | Service health status and MongoDB connection state |
| `GET` | `/api/v1/tasks` | Get all tasks (supports query filters: `category`, `status`, `priority`, `dayIndex`, `search`, `page`, `limit`) |
| `POST` | `/api/v1/tasks` | Create a new task |
| `GET` | `/api/v1/tasks/:id` | Get task by ID |
| `PATCH` | `/api/v1/tasks/:id` | Update task by ID |
| `DELETE` | `/api/v1/tasks/:id` | Delete task by ID |

### Example Request (Create Task)
```bash
POST /api/v1/tasks
Content-Type: application/json

{
  "category": "Feature",
  "title": "Auth token refresh & silent renewal pipeline",
  "code": "FE-170",
  "description": "Implement Axios silent refresh interceptor with exponential backoff",
  "priority": "HIGH",
  "status": "TODO",
  "dayIndex": 2,
  "estimatedHours": 2.33,
  "actualHours": 0
}
```
