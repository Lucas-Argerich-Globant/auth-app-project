
### Database Setup (Localhost)

1. **Create the database** - Creates a new MySQL database named `auth_app_globant` with UTF-8 character encoding (utf8mb4) and Unicode collation for proper international character support.
```mysql
CREATE DATABASE auth_app_globant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Create the database user** - Creates a new database user named `default` that can connect from localhost with the password `globant-password`.
```mysql
CREATE USER 'default'@'localhost' IDENTIFIED BY 'globant-password';
```

3. **Grant user permissions** - Gives the `default` user full permissions (read, write, delete, etc.) on all tables in the `auth_app_globant` database.
```mysql
GRANT ALL PRIVILEGES ON auth_app_globant.* To 'default'@'localhost';
```

4. **Flush privileges** - Reloads the MySQL permission tables to make the new user and privileges take effect immediately.
```mysql
FLUSH PRIVILEGES;
```