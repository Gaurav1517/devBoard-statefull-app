# DevBoard application locally**.
This includes **Redis, PostgreSQL, schemas, environment files, commands, and verification** 

---

# 1 Prerequisites

Install these first.

### NodeJS

```bash
node -v
npm -v
```

### Docker

```bash
docker -v
```

### Git (optional)

```bash
git --version
```

---

# 2 Project Folder Structure

Your project should look like this:

```
devboard-app
│
├── backend
│   ├── server.js
│   ├── db.js
│   ├── config
│   │   └── env.js
│   ├── models
│   │   ├── userModel.js
│   │   ├── projectModel.js
│   │   └── deploymentModel.js
│   ├── routes
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── deployments.js
│   └── .env
│
└── frontend
    ├── src
    │   ├── App.js
    │   ├── Dashboard.js
    │   ├── Login.js
    │   └── api.js
    └── .env
```

---

# 3 Start PostgreSQL with Docker

Create PostgreSQL container.

```bash
docker run -d \
-p 5432:5432 \
--name devboard-postgres \
-e POSTGRES_DB=devboard \
-e POSTGRES_USER=devuser \
-e POSTGRES_PASSWORD=devpass \
-v C:\postgres-data:/var/lib/postgresql/data \
postgres:15
```

Check container running:

```bash
docker ps
```

---

# 4 Connect to PostgreSQL

```bash
docker exec -it devboard-postgres psql -U devuser -d devboard
```

You will see:

```
devboard=#
```

---

# 5 Create Database Schema

Run these SQL commands.

### Users table

```sql
CREATE TABLE users(
 id SERIAL PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Projects table

```sql
CREATE TABLE projects(
 id SERIAL PRIMARY KEY,
 user_id INT REFERENCES users(id),
 name TEXT NOT NULL,
 environment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### Deployments table

```sql
CREATE TABLE deployments(
 id SERIAL PRIMARY KEY,
 project_id INT REFERENCES projects(id),
 version TEXT,
 status TEXT,
 deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 6 Verify Tables

```sql
\dt
```

Expected:

```
users
projects
deployments
```

---

# 7 Exit PostgreSQL

```sql
\q
```

---

# 8 Start Redis with Docker

Run Redis container.

```bash
docker run -d \
-p 6379:6379 \
--name devboard-redis \
-e REDIS_PASSWORD=MySecretPassword123 \
redis:7 \
redis-server --requirepass MySecretPassword123
```

Check container:

```bash
docker ps
```

---

# 9 Verify Redis Connection

Enter Redis CLI.

```bash
docker exec -it devboard-redis redis-cli
```

Authenticate:

```bash
AUTH MySecretPassword123
```

Test:

```bash
PING
```

Expected:

```
PONG
```

Exit:

```bash
exit
```

---

# 10 Backend Environment File

Create:

```
backend/.env
```

```
NODE_ENV=development

APP_PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=devboard
DB_USER=devuser
DB_PASSWORD=devpass

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=MySecretPassword123

SESSION_SECRET=supersecretkey

FRONTEND_URL=http://172.21.192.1:3000
```

---

# 11 Install Backend Dependencies

Go to backend folder.

```bash
cd backend
```

Install packages.

```bash
npm install express cors express-session connect-redis redis pg bcrypt dotenv morgan
```

---

# 12 Start Backend

Run:

```bash
node server.js
```

You should see:

```
🚀 Server running on port 5000
✅ Connected to Redis
```

Test health endpoint:

```
http://localhost:5000/health
```

Expected:

```
{"status":"ok"}
```

---

# 13 Frontend Environment File

Create:

```
frontend/.env
```

```
REACT_APP_API_URL=http://172.21.192.1:5000
```

---

# 14 Install Frontend Dependencies

Go to frontend folder.

```bash
cd ../frontend
```

Install dependencies.

```bash
npm install
```

---

# 15 Start Frontend

```bash
npm start
```

React will start:

```
http://172.21.192.1:3000
```

---

# 16 Register First User

Create first user.

```bash
curl -X POST http://172.21.192.1:5000/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"admin","password":"admin123"}'
```

---

# 17 Login to Application

Open browser:

```
http://172.21.192.1:3000
```

Login:

```
username: admin
password: admin123
```

---

# 18 Verify Data in PostgreSQL

Check users.

```bash
docker exec -it devboard-postgres psql -U devuser -d devboard
```

```sql
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM deployments;
```

---

# 19 Verify Redis Sessions

Enter Redis:

```bash
docker exec -it devboard-redis redis-cli
```

Authenticate:

```bash
AUTH MySecretPassword123
```

List keys:

```bash
KEYS *
```

Example:

```
devboard:sess:abc123
```

---

# 20 Test Deployment Feature

In UI:

```
Create Project
↓
Click Deploy
↓
Enter version v1.0
```

Check DB:

```sql
SELECT * FROM deployments;
```

Example result:

```
id | project_id | version | status
1  | 1          | v1.0    | success
```

---

