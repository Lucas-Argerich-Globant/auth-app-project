## Setup Instructions

## **1. Install Dependencies**

Use the following script to install all necessary dependencies in both the **`frontend`** and **`backend`** project directories.

```bash
npm run install-all
```

---
<br>


## **2. Database Setup (Localhost)**

This section guides you through setting up the **MySQL database** and a dedicated user. The application uses the database name **`auth_app_globant`**.

### 💻 MySQL Commands

Follow these steps using the **MySQL Command Line Client** or your preferred database management tool (like MySQL Workbench).

### 1. Open the MySQL Client
Launch the MySQL Command Line Client and log in.

### 2. Create the Database
Create the database named `auth_app_globant`. It uses full Unicode support (`utf8mb4`).

```sql
CREATE DATABASE auth_app_globant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Create the Database User
Create a local user named default that can connect from localhost with the specified password.

```sql
CREATE USER 'default'@'localhost' IDENTIFIED BY 'globant-password';
```

### 4. Grant User Permissions
Give the new default user full administrative privileges on the auth_app_globant database.

```sql
GRANT ALL PRIVILEGES ON auth_app_globant.* To 'default'@'localhost';
```

### 5. Apply Changes
Reload the MySQL permission tables to ensure the new user and privileges take effect immediately.

```sql
FLUSH PRIVILEGES;
```

### 6. Configure Environment Variables
Create the local configuration file (.env) by copying the provided template:

```bash
  npm run setup:env
```
**Note:** If you followed the default database setup (Step 1 to 5), you do not need to modify the new .env file. It already contains the correct credentials (default/globant-password).


### 7. Initialize Schema (Prisma)
After the database is set up in MySQL, run this command from your project root to push the Prisma schema to the database and generate the necessary static types for the backend.

```bash
npm run setup:prisma
```

<br>

### 8. Create Admin User

After setting up Prisma, create the default admin user by running:

```bash
npm run setup:admin
```

This command runs a script that inserts an admin user into the database.

**Default Credentials**

Email: admin@globant.com

Password: admin1234

⚠️ For development use only.
Change or remove this user before production.

<br>

## **Run the Application**
Use the following command to start both the **``backend``** server and the **``frontend``** development server concurrently.

```bash
npm run dev
```
The application will typically be accessible at http://localhost:3000.