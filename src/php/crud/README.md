# PHP + Angular CRUD for MariaDB/MySQL

Full-stack CRUD generated from the supplied schema.

## Stack

- Backend: PHP 8.2+, PDO, MariaDB/MySQL
- Frontend: Angular standalone application, TypeScript, Angular Material
- API: JSON REST endpoints
- CORS: configurable in `backend/config.php`
- Media: upload/download endpoint for `media.src` (LONGBLOB)
- Relations: foreign-key fields are exposed as select boxes where possible
- Junction tables: `site_webinar` and `site_media` have dedicated CRUD support

## Project layout

```text
backend/
  api.php
  config.php
  schema.sql
  .htaccess
frontend/
  package.json
  angular.json
  tsconfig.json
  src/
    main.ts
    index.html
    styles.scss
    app/
      app.component.ts
      app.routes.ts
      core/
        api.service.ts
        schema.service.ts
      pages/
        dashboard/
        entity-list/
        entity-form/
```

## 1. Database

Create a MariaDB/MySQL database and run:

```bash
mysql -u root -p your_database < backend/schema.sql
```

The schema is the DDL supplied with the request.

## 2. Configure PHP

Edit `backend/config.php`:

```php
return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'database' => 'your_database',
        'username' => 'root',
        'password' => 'your_password',
        'charset' => 'utf8mb4',
    ],
    'cors' => [
        'allowed_origin' => 'http://localhost:4200',
    ],
];
```

For Apache, point the virtual host/document root at `backend/`, or put the project behind your existing PHP web server.

For a quick local test:

```bash
cd backend
php -S localhost:8080
```

Then the API is available at:

```text
http://localhost:8080/api.php
```

## 3. Angular

```bash
cd frontend
npm install
npm start
```

Open:

```text
http://localhost:4200
```

The Angular application expects the PHP API at:

```text
http://localhost:8080/api.php
```

Change `src/app/core/api.service.ts` if your API is deployed elsewhere.

## API

### Metadata

```http
GET /api.php?action=schema
```

Returns tables, columns and foreign-key metadata.

### Collection

```http
GET    /api.php?action=rows&table=site
POST   /api.php?action=rows&table=site
```

### Single row

```http
GET    /api.php?action=row&table=site&id=1
PUT    /api.php?action=row&table=site&id=1
DELETE /api.php?action=row&table=site&id=1
```

### Media

```http
POST /api.php?action=media-upload
GET  /api.php?action=media&id=1
```

The upload endpoint accepts a multipart/form-data field named `file`.

## Security notes

This is an administration CRUD starter, not a production authentication system.

Before exposing it publicly:

- add authentication/authorization;
- use HTTPS;
- move database credentials to environment variables;
- restrict CORS to the real frontend origin;
- add CSRF protection if cookie authentication is used;
- add server-side audit logging;
- consider pagination and filtering for very large tables.

The backend uses an allowlist of known tables/columns and PDO prepared statements for values. Table and column identifiers are never accepted blindly from the client.
