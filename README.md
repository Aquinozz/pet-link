# Zoop

Ongoing TCC (undergraduate thesis) project that integrates a Spring Boot backend and a React + Vite frontend.

## Description

This repository contains the Zoop system, an application for managing pet owners (tutors), service providers and pet bookings.

The project is under development as a Course Conclusion Project (TCC) and currently includes:
- Backend in Java with Spring Boot
- Frontend in React with Vite
- JWT authentication API
- API documentation via Swagger/OpenAPI
- Routes protected by user role

## Technologies

- Backend: Java 21, Spring Boot, Spring Data JPA, PostgreSQL, Spring Security, JWT, Springdoc OpenAPI (Swagger UI)
- Frontend: React, TypeScript, Vite
- Authentication and authorization via user roles

## Structure

- `src/main/java` — Spring Boot backend
- `src/main/resources` — backend configuration
- `petlink-frontend/` — React + Vite frontend application

## How to run

### Backend
1. Navigate to the project root directory
2. Run:
   - `./mvnw.cmd spring-boot:run`
3. The backend runs on:
   - `http://localhost:8080`
4. To access the Swagger docs:
   - `http://localhost:8080/swagger-ui/index.html`
   - or `http://localhost:8080/swagger-ui.html`

### Frontend
1. Navigate to `petlink-frontend`
2. Run:
   - `npm install`
   - `npm run dev`
3. The Vite frontend runs on:
   - `http://localhost:3000`

### Docker Compose
1. In the project root, run:
   - `sudo docker compose up`
2. Exposed services:
   - frontend: `http://localhost:3000`
   - backend: `http://localhost:8080`

## Note

- Use a local `.env` file for sensitive variables.
- The `README` and `.env.example` can be used as a reference during development.