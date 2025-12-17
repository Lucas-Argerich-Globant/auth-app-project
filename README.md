# Auth Application - Globant

## Project Overview
A full-stack authentication system with role-based access control and metrics tracking. Features JWT authentication, admin/user dashboards, and secure API endpoints.

**Key Features**:
- JWT authentication with refresh tokens
- Role-based access control (Admin/User)
- Metrics tracking system
- Angular frontend with auth guards
- Express backend with Prisma ORM

## Tech Stack
### Backend
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
- Prisma ORM with MySQL
- JWT authentication
- Role-based middleware
- Swagger API documentation

### Frontend
![Angular](https://img.shields.io/badge/Angular-16.x-red)
- RxJS state management
- Auth guards & interceptors
- Responsive UI components
- Chart.js integration for metrics

## Authentication Flow
```mermaid
graph TD
    A[User Login] --> B[JWT Generation]
    B --> C[Token Storage in AuthStore]
    C --> D[API Requests with Interceptor]
    D --> E[Auth Middleware Validation]
    E --> F[Role-based Route Access]
```

## API Endpoints
### Authentication
| Method | Endpoint          | Description                 |
|--------|-------------------|-----------------------------|
| POST   | /api/auth/login   | User authentication         |
| POST   | /api/auth/refresh | Refresh access token        |
| POST   | /api/auth/register| New user registration       |

### Metrics
| Method | Endpoint          | Description                 |
|--------|-------------------|-----------------------------|
| GET    | /api/metrics      | Get all metrics (Admin)     |
| POST   | /api/metrics      | Create new metric (User)    |

## Environment Variables
Create `.env` file from `.env.copy` template:
```ini
# Database
DATABASE_URL="mysql://default:globant-password@localhost:3306/auth_app_globant"

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXP=15m
REFRESH_TOKEN_EXP=7d
```

## Security Best Practices
1. Never expose JWT secrets in client-side code
2. Use HTTPS in production
3. Regularly rotate database credentials
4. Implement rate limiting for authentication endpoints
5. Validate and sanitize all user inputs

## Deployment Guidelines
1. Set proper JWT expiration times in production
2. Use environment-specific configuration files
3. Implement proper database backups
4. Use a process manager like PM2 for production
5. Set up monitoring and logging

## Testing Instructions
1. Run unit tests: `npm run test`
2. Run integration tests: `npm run test:integration`
3. Test authentication flow with different user roles
4. Verify metrics creation and retrieval endpoints
5. Test error handling with invalid inputs

## Setup Instructions

### **1. Install Dependencies**
Use the following script to install all necessary dependencies in both the **`frontend`** and **`backend`** project directories.
```bash
npm run install-all
```

### **2. Database Setup (Localhost)**
This section guides you through setting up the **MySQL database** and a dedicated user. The application uses the database name **`auth_app_globant`**.

#### 💻 MySQL Commands
Follow these steps using the **MySQL Command Line Client** or your preferred database management tool (like MySQL Workbench).

1. **Open the MySQL Client**  
Launch the MySQL Command Line Client and log in.

2. **Create the Database**  
Create the database named `auth_app_globant`. It uses full Unicode support (`utf8mb4`).
```sql
CREATE DATABASE auth_app_globant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Create the Database User**  
Create a local user named default that can connect from localhost with the specified password.
```sql
CREATE USER 'default'@'localhost' IDENTIFIED BY 'globant-password';
```

4. **Grant User Permissions**  
Give the new default user full administrative privileges on the auth_app_globant database.
```sql
GRANT ALL PRIVILEGES ON auth_app_globant.* To 'default'@'localhost';
```

5. **Apply Changes**  
Reload the MySQL permission tables to ensure the new user and privileges take effect immediately.
```sql
FLUSH PRIVILEGES;
```

6. **Configure Environment Variables**  
Create the local configuration file (.env) by copying the provided template:
```bash
npm run setup:env
```
**Note:** If you followed the default database setup (Step 1 to 5), you do not need to modify the new .env file. It already contains the correct credentials (default/globant-password).

7. **Initialize Schema (Prisma)**  
After the database is set up in MySQL, run this command from your project root to push the Prisma schema to the database and generate the necessary static types for the backend.
```bash
npm run setup:prisma
```

8. **Create Admin User**  
After setting up Prisma, create the default admin user by running:
```bash
npm run setup:admin
```
This command runs a script that inserts an admin user into the database.

**Default Credentials**  
Email: admin@globant.com  
Password: admin1234  
⚠️ For development use only. Change or remove this user before production.

### **Run the Application**
Use the following command to start both the **`backend`** server and the **`frontend`** development server concurrently.
```bash
npm run dev
```
The application will typically be accessible at http://localhost:3000.
