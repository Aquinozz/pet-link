# PetLink

Projeto em andamento de TCC que integra backend Spring Boot e frontend React + Vite.

## Descrição

Este repositório contém o sistema PetLink, uma aplicação para gestão de tutores, prestadores de serviços e agendamentos para pets.

O projeto está em desenvolvimento como Trabalho de Conclusão de Curso (TCC) e atualmente inclui:
- Backend em Java com Spring Boot
- Frontend em React com Vite
- API de autenticação JWT
- Rotas protegidas por perfil de usuário

## Estrutura

- `src/main/java` — backend Spring Boot
- `src/main/resources` — configurações do backend
- `petlink-frontend/` — aplicação frontend React + Vite

## Como rodar

### Backend
1. Navegue para o diretório raiz do projeto
2. Execute:
   - `./mvnw.cmd spring-boot:run`

### Frontend
1. Navegue para `petlink-frontend`
2. Execute:
   - `npm install`
   - `npm run dev`

## Observação

- Use um arquivo `.env` local para variáveis sensíveis.
- O `README` e a `.env.example` podem ser usados como referência durante o desenvolvimento.
