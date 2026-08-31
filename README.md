# PetLink

Web platform connecting pet owners with service providers for animals. A capstone project (TCC) built with a Spring Boot backend and React + Vite frontend.

## Features

- **JWT Authentication** with three access roles: Tutor, Professional, and Admin
- **Pet management** with photo upload and image cropping
- **Provider search** by city, neighborhood, service type, and proximity (Haversine geolocation)
- **Appointment scheduling** with state machine (Scheduled → Confirmed → Completed / Cancelled)
- **Reviews and ratings** for providers by tutors (1–5 stars + comment)
- **Provider profile** with photo, banner, operating hours, and services editing
- **Home visit support** with address registration
- **API documentation** via Swagger/OpenAPI

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA, Spring Security, JWT (jjwt 0.12), Lombok, Springdoc OpenAPI |
| Frontend | React 19, TypeScript, Vite 8, React Router DOM 7, Tailwind CSS 4, Axios, lucide-react |
| Database | PostgreSQL (production) / H2 (tests) |
| Infra | Docker, Docker Compose, Nginx, Render.com |
| CI/CD | GitHub Actions (lint, tests, build) |

## Project Structure

```
petlink/
├── src/main/java/pet_link/       # Spring Boot backend
│   ├── controllers/              # AuthController, PrestadorController, PetController, AppointmentController, ReviewController
│   ├── services/                 # Business logic + GeocodingService (Nominatim/OpenStreetMap)
│   ├── models/                   # Users, RolesEntity, PetModel, PrestadorModel, AppointmentModel, ReviewModel
│   ├── dtos/                     # Request/response DTOs (16 files)
│   ├── repositories/             # Spring Data JPA repositories
│   ├── enums/                    # UserRole, PrestadorType, AppointmentStatus
│   ├── config/                   # SecurityConfiguration, TokenProvider, JwtAuthenticationFilter, SwaggerConfig
│   ├── exceptions/               # GlobalExceptionHandler + custom exceptions
│   └── utils/                    # DataUtils
├── src/test/                     # Unit and integration tests
├── petlink-frontend/             # React + Vite frontend
│   └── src/
│       ├── pages/                # LandingPage, LoginPage, CadastroPage, Dashboards, MeusPets, Agendamentos...
│       ├── components/           # Reusable UI (Button, Card, Badge, StarRating, StatusBadge...)
│       ├── api/                  # HTTP services (auth, pet, prestador, agendamento, review)
│       ├── contexts/             # AuthContext (JWT + client-side role)
│       ├── types/                # TypeScript interfaces
│       └── theme/                # Design tokens
├── docker-compose.yml
├── Dockerfile.combined           # Multi-stage build: Backend + Frontend + Nginx
└── render.yaml                   # Render.com deployment
```

## Getting Started

### Prerequisites

- Java 21
- Node.js 22+
- PostgreSQL
- Docker (optional)

### Backend

```bash
# Copy and configure environment variables
cp .env.example .env

# Run with Maven Wrapper
./mvnw spring-boot:run
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

### Frontend

```bash
cd petlink-frontend
npm install
npm run dev
```

- App: `http://localhost:3000`

### Docker Compose

```bash
docker compose up
```

- App (via Nginx): `http://localhost:80`

## Key Endpoints

| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| POST | `/auth/register` | Tutor registration | Public |
| POST | `/auth/login` | Login (returns JWT) | Public |
| GET | `/auth/me` | Current user profile | Authenticated |
| GET | `/prestadores` | List providers | Public |
| GET | `/prestadores/proximos` | Nearby search (lat/lng/radius) | Public |
| GET | `/prestadores/top-avaliados` | Top-rated providers | Public |
| POST | `/pets` | Register pet | Tutor / Admin |
| POST | `/appointment` | Create appointment | Tutor / Professional |
| PATCH | `/appointment/{id}/status` | Update appointment status | Tutor / Professional |
| POST | `/reviews` | Rate a provider | Tutor / Professional |

## Environment Variables

See `.env.example` for the full list. Main ones:

| Variable | Description |
|----------|-------------|
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL |
| `SPRING_DATASOURCE_USERNAME` | Database user |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION` | Token expiration time (ms) |
| `ADMIN_EMAIL` | Seed admin email |
| `ADMIN_PASSWORD` | Seed admin password |

## Deployment

Configured for **Render.com** via `render.yaml`:

- Multi-stage Docker build with `Dockerfile.combined` (Spring Boot + React build + Nginx)
- Nginx serves the SPA and proxies `/api/` and `/uploads/` to the backend
- Backend runs internally on port 8090, Nginx exposes port 80

## License

Academic project (TCC) — all rights reserved.
