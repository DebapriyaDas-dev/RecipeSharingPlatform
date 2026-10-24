# Recipe Sharing Platform

**RecipeClub** is a recipe sharing app: post your dishes with photos, discover what other cooks are
making, and rate the recipes worth repeating. It's built as Spring Boot microservices behind a
Spring Cloud Gateway with Eureka service discovery and MySQL, plus a React frontend.

![RecipeClub home page](docs/screenshots/03-home.jpg)

📖 **[Step-by-step user guide with screenshots →](docs/USER_GUIDE.md)**

## Features

- **Accounts:** register with live password-strength feedback, sign in, edit your profile, log out or deactivate.
- **Discover:** photo cards for every recipe; instant search by name or description; sort by newest, top rated, quickest or lightest; *My recipes* filter.
- **Recipe pages:** cook time, calories, date added, community score and author; a tick-off ingredient checklist; all reviews.
- **Share recipes:** a four-step form with a live preview card, completion ring, cook-time presets, ingredient rows and drag-and-drop photo upload.
- **Ratings & reviews:** a 10-star picker (mouse or keyboard) with comments and quick notes; edit or delete your own reviews; a slide-over reviews panel on the recipe list.
- **Community:** member directory with sign-in status and public profiles showing each cook's recipes and reviews.
- **Design:** dark "Saffron Noir" theme, animated transitions, skeleton loaders, empty and error states, themed dialogs and toasts. Responsive from phone to desktop and respects *reduce motion*.

| Recipes | Recipe page | Share a recipe |
|---|---|---|
| ![Recipes](docs/screenshots/05-recipes.jpg) | ![Recipe page](docs/screenshots/08-recipe-detail.jpg) | ![Share a recipe](docs/screenshots/11-share-recipe.jpg) |
| **Rate a recipe** | **Community** | **Profile** |
| ![Rate](docs/screenshots/10-rate-recipe.jpg) | ![Community](docs/screenshots/13-community.jpg) | ![Profile](docs/screenshots/14-profile.jpg) |

More screens, including phone layouts, are in the [user guide](docs/USER_GUIDE.md).

## Architecture

```
React app (3000) ──► API gateway (8080) ──► user-service (9090) ──► MySQL
                           │                    │   ▲
                           │                    ▼   │ (aggregates ratings + recipes)
                           ├──────────────► recipe-service (9091) ──► MySQL, images/
                           └──────────────► rating-service (9092) ──► MySQL
           all services register with the Eureka registry (8761)
```

| Service | Port | Responsibility |
|---|---|---|
| `platform-service-registry` | 8761 | Eureka service registry |
| `platform-application-gateway` | 8080 | Routes `/users/**`, `/recipes/**`, `/ratings/**` to the services |
| `platform-user-service` | 9090 | Accounts, login, profiles; joins in each user's recipes and ratings |
| `platform-recipe-service` | 9091 | Recipes, ingredients and photo upload/serving |
| `platform-rating-service` | 9092 | Ratings and reviews |
| `FRONTEND/recipesharingapp` | 3000 | React UI (all calls go through the gateway) |

## Running locally

### Prerequisites

- Java 17+ and MySQL 8 (the services use the `recipe_sharing` schema and create it if missing)
- Node.js 18+

### 1. Database credentials

The services read the database settings from environment variables. Set them in **each**
terminal you start a database-backed service from (user, recipe and rating):

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/recipe_sharing?createDatabaseIfNotExist=true"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-local-password"
```

If `DB_PASSWORD` isn't set, those services fail to start with *Access denied for user 'root'*.

### 2. Backend services

Start them in this order, each in its own terminal:

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

Check `http://localhost:8761`: all four clients should show as **UP**.

### 3. Frontend

```powershell
cd FRONTEND\recipesharingapp
npm install
npm start
```

Open `http://localhost:3000`.

### 4. Demo data (optional)

The [`seed/`](seed/README.md) folder adds 8 demo cooks, 32 recipes with generated photos and
77 reviews. Account details are in [seed/ACCOUNTS.md](seed/ACCOUNTS.md).

## Tests

```powershell
cd FRONTEND\recipesharingapp
npm test

cd platform-user-service
.\mvnw.cmd test
```

## Opening the app on another device

The React dev server already accepts connections from your network (`http://<your-PC-IP>:3000`).
Two things are needed before a phone on the same Wi-Fi can use it:

1. **Firewall:** allow inbound TCP 3000 and 8080, or mark the Wi-Fi network as *Private* in Windows settings.
2. **API address:** the frontend currently calls `http://localhost:8080` (in
   `FRONTEND/recipesharingapp/src/api.js`). On a phone, `localhost` is the phone itself, so pages
   load without data. Point `API_BASE` at your PC's address, or at
   `` `http://${window.location.hostname}:8080` ``, to fix it.

## Project structure

```
FRONTEND/recipesharingapp/   React app (theme/, ui/, component/, pages/, recipes/, ratings/, users/)
platform-*/                  Spring Boot services
seed/                        Demo data seed kit
docs/                        User guide and screenshots
```
