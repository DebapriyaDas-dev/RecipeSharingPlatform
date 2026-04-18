# Recipe Sharing Platform

Microservice-based recipe sharing application with a React frontend, Spring Boot backend services, Spring Cloud Gateway, Eureka service discovery, and MySQL persistence.

## Services

- `platform-service-registry`: Eureka registry on port `8761`
- `platform-application-gateway`: API gateway on port `8080`
- `platform-user-service`: user APIs on port `9090`
- `platform-recipe-service`: recipe APIs on port `9091`
- `platform-rating-service`: rating APIs on port `9092`
- `FRONTEND/recipesharingapp`: React app on port `3000`

## Database

The backend services use MySQL and the `recipe_sharing` schema.

Set these environment variables before starting the backend services:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/recipe_sharing?createDatabaseIfNotExist=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-local-password"
```

## Running Locally

Start backend services in this order:

```powershell
cd platform-service-registry
.\mvnw.cmd spring-boot:run

cd ..\platform-user-service
.\mvnw.cmd spring-boot:run

cd ..\platform-recipe-service
.\mvnw.cmd spring-boot:run

cd ..\platform-rating-service
.\mvnw.cmd spring-boot:run

cd ..\platform-application-gateway
.\mvnw.cmd spring-boot:run
```

Start the frontend:

```powershell
cd FRONTEND\recipesharingapp
npm install
npm start
```

Open `http://localhost:3000`.
