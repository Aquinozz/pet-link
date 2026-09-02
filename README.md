# Zoop

Plataforma web que conecta tutores de pets a profissionais e serviços para animais de estimação. Projeto acadêmico (TCC) construído com um backend Spring Boot e um frontend Vinext (React SSR).

## Funcionalidades

- **Autenticação JWT** com três papéis de acesso: Tutor, Profissional e Admin
- **Gestão de pets** com upload de foto e recorte de imagem
- **Busca de profissionais** por cidade, bairro, tipo de serviço e proximidade (geolocalização Haversine)
- **Agendamento de consultas** com máquina de estados (Agendado → Confirmado → Concluído / Cancelado)
- **Avaliações e notas** para profissionais feitas por tutores (1–5 estrelas + comentário)
- **Perfil do profissional** com foto, banner, horário de funcionamento e edição de serviços
- **Suporte a atendimento domiciliar** com cadastro de endereço
- **Documentação da API** via Swagger/OpenAPI

## Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA, Spring Security, JWT (jjwt 0.12), Lombok, Springdoc OpenAPI |
| Frontend | React 19, TypeScript, Vinext (Vite 8 + SSR), Tailwind CSS 4, shadcn/ui, Axios, lucide-react, Recharts, Drizzle ORM |
| Banco de dados | PostgreSQL (produção) / H2 (testes) |
| Infra | Docker, Docker Compose, Nginx, Render.com |
| CI/CD | GitHub Actions (testes, lint e build) |

## Estrutura do Projeto

```
zoop/
├── app/                         # Frontend Vinext (rotas SSR)
│   ├── entrar/                  # Login
│   ├── servicos/                # Busca de serviços
│   ├── profissionais/           # Página pública do profissional
│   ├── profissional/            # Painel do profissional (agenda, avaliações, clientes, serviços)
│   └── tutor/                   # Painel do tutor (agendamentos, histórico, pets)
├── components/                  # Componentes React reutilizáveis (ui/, zoop/)
├── lib/                         # API, autenticação, tipos e dados (api.ts, auth.tsx, services.ts)
├── src/main/java/pet_link/      # Backend Spring Boot
│   ├── config/                  # SecurityConfiguration, TokenProvider, JwtAuthenticationFilter, SwaggerConfig
│   ├── controllers/             # AuthController, PrestadorController, PetController, AppointmentController, ReviewController
│   ├── services/                # Regras de negócio + GeocodingService (Nominatim/OpenStreetMap)
│   ├── models/                  # Users, RolesEntity, PetModel, PrestadorModel, AppointmentModel, ReviewModel
│   ├── dtos/                    # DTOs de requisição/resposta
│   ├── repositories/            # Repositórios Spring Data JPA
│   ├── enums/                   # UserRole, PrestadorType, AppointmentStatus
│   ├── exceptions/              # GlobalExceptionHandler + exceções personalizadas
│   └── utils/                   # DataUtils
├── db/                          # Configuração de banco (Drizzle)
├── worker/                      # Configuração do Cloudflare Worker
├── render/                      # nginx.conf e entrypoint.sh (Render/Docker)
├── docker-compose.yml
├── Dockerfile.combined          # Build multi-stage: Backend + Frontend + Nginx
└── render.yaml                  # Deploy no Render.com
```

## Começando

### Pré-requisitos

- Java 21
- Node.js 22+
- PostgreSQL
- Docker (opcional)

### Backend

```bash
# Configure o arquivo .env com as variáveis de ambiente (ver seção abaixo)
# .env não é versionado e é ignorado pelo Git

# Execute com o Maven Wrapper
./mvnw spring-boot:run
```

- API: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

### Frontend

```bash
npm install
npm run dev
```

- App: `http://localhost:3000`

### Docker Compose

```bash
docker compose up -d --build
```

O container sobe o backend, o frontend Vinext e o Nginx juntos:

- App (via Nginx): `http://localhost:80`

## Endpoints Principais

| Método | Rota | Descrição | Acesso |
|--------|------|-----------|--------|
| POST | `/auth/register` | Cadastro de tutor | Público |
| POST | `/auth/login` | Login (retorna JWT) | Público |
| GET | `/auth/me` | Perfil do usuário atual | Autenticado |
| GET | `/prestadores` | Lista de profissionais | Público |
| GET | `/prestadores/proximos` | Busca por proximidade (lat/lng/raio) | Público |
| GET | `/prestadores/top-avaliados` | Profissionais mais bem avaliados | Público |
| POST | `/pets` | Cadastra pet | Tutor / Admin |
| POST | `/appointment` | Cria agendamento | Tutor / Profissional |
| PATCH | `/appointment/{id}/status` | Atualiza status do agendamento | Tutor / Profissional |
| POST | `/reviews` | Avalia um profissional | Tutor / Profissional |

## Variáveis de Ambiente

O `.env` (ignorado pelo Git) é lido pelo Docker Compose e pelo Maven. As principais variáveis:

| Variável | Descrição |
|----------|-----------|
| `SPRING_DATASOURCE_URL` | URL de conexão do PostgreSQL |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco |
| `JWT_SECRET` | Chave de assinatura do JWT |
| `JWT_EXPIRATION` | Tempo de expiração do token (ms) |
| `ADMIN_EMAIL` | E-mail do admin inicial |
| `ADMIN_PASSWORD` | Senha do admin inicial |

## Deploy

Configurado para **Render.com** via `render.yaml`:

- Build multi-stage com `Dockerfile.combined` (Spring Boot + build Vinext + Nginx)
- O Nginx serve o frontend e faz proxy das rotas `/api/` e `/uploads/` para o backend
- Backend roda internamente em `8090`, frontend Vinext em `3000` e Nginx expõe a porta `80`

## Licença

Projeto acadêmico (TCC) — todos os direitos reservados.
