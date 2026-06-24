# PetLink

Projeto em andamento de TCC que integra backend Spring Boot e frontend React + Vite.

## Descrição

Este repositório contém o sistema PetLink, uma aplicação para gestão de tutores, prestadores de serviços e agendamentos para pets.

O projeto está em desenvolvimento como Trabalho de Conclusão de Curso (TCC) e atualmente inclui:
- Backend em Java com Spring Boot
- Frontend em React com Vite
- API de autenticação JWT
- Documentação de API via Swagger/OpenAPI
- Rotas protegidas por perfil de usuário

## Tecnologias

- Backend: Java 21, Spring Boot, Spring Data JPA, PostgreSQL, Spring Security, JWT, Springdoc OpenAPI (Swagger UI)
- Frontend: React, TypeScript, Vite
- Autenticação e autorização via perfis de usuário

## Estrutura

- `src/main/java` — backend Spring Boot
- `src/main/resources` — configurações do backend
- `petlink-frontend/` — aplicação frontend React + Vite

## Como rodar

### Backend
1. Navegue para o diretório raiz do projeto
2. Execute:
   - `./mvnw.cmd spring-boot:run`
3. O backend é exposto em:
   - `http://localhost:8080`
4. Para acessar a documentação Swagger:
   - `http://localhost:8080/swagger-ui/index.html`
   - ou `http://localhost:8080/swagger-ui.html`

### Frontend
1. Navegue para `petlink-frontend`
2. Execute:
   - `npm install`
   - `npm run dev`
3. O frontend Vite roda em:
   - `http://localhost:3000`

### Docker Compose
1. No diretório raiz, execute:
   - `sudo docker compose up`
2. Os serviços expostos são:
   - frontend: `http://localhost:3000`
   - backend: `http://localhost:8080`

## Observação

- Use um arquivo `.env` local para variáveis sensíveis.
- O `README` e a `.env.example` podem ser usados como referência durante o desenvolvimento.
