# SpectraNet System Architecture

## System Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          Web Browser (Client)                            │
│                        http://localhost:5173                             │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 │ HTTP Requests
                                 │
┌────────────────────────────────▼─────────────────────────────────────────┐
│                                                                          │
│                         React Frontend (Vite)                            │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │    Pages     │  │  Components  │  │   API Layer  │                  │
│  │              │  │              │  │              │                  │
│  │ - Home       │  │ - Navbar     │  │ - axios      │                  │
│  │ - Login      │  │ - Footer     │  │ - auth.ts    │                  │
│  │ - Register   │  │ - Spectral   │  │ - datasets   │                  │
│  │ - Datasets   │  │   Chart      │  │ - upload     │                  │
│  │ - Upload     │  │              │  │ - stats      │                  │
│  │ - Statistics │  │              │  │              │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│                                                                          │
│  ┌──────────────────────────────────────────────────┐                   │
│  │          State Management (Zustand)              │                   │
│  │  - authStore: User authentication state          │                   │
│  │  - datasetStore: Dataset data and operations     │                   │
│  └──────────────────────────────────────────────────┘                   │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 │ REST API Calls (JSON)
                                 │ JWT Token Authentication
                                 │
┌────────────────────────────────▼─────────────────────────────────────────┐
│                                                                          │
│                      FastAPI Backend Server                              │
│                      http://localhost:8000                               │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                       API Routes                                   │ │
│  │                                                                    │ │
│  │  /api/auth/*         - Authentication (login, register)           │ │
│  │  /api/datasets/*     - Dataset CRUD operations                    │ │
│  │  /api/categories/*   - Category management                        │ │
│  │  /api/upload/*       - File upload handling                       │ │
│  │  /api/stats/*        - Statistics and analytics                   │ │
│  │  /docs               - Interactive API documentation              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   Business Logic Layer                            │ │
│  │                                                                    │ │
│  │  - auth.py           JWT token generation/validation              │ │
│  │  - schemas.py        Pydantic data validation                     │ │
│  │  - File processing   CSV parsing, data extraction                 │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                   Data Access Layer (ORM)                         │ │
│  │                                                                    │ │
│  │  SQLAlchemy Models:                                               │ │
│  │  - User              User accounts and authentication             │ │
│  │  - Category          Dataset categorization                       │ │
│  │  - Dataset           Dataset metadata and information             │ │
│  │  - SpectralSample    Individual spectral measurements             │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 │ SQL Queries
                                 │
┌────────────────────────────────▼─────────────────────────────────────────┐
│                                                                          │
│                        SQLite Database                                   │
│                       (spectranet.db)                                    │
│                                                                          │
│  Tables:                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   users     │  │ categories  │  │  datasets   │  │  spectral_  │   │
│  │             │  │             │  │             │  │  samples    │   │
│  │ - id        │  │ - id        │  │ - id        │  │ - id        │   │
│  │ - username  │  │ - name      │  │ - name      │  │ - dataset_id│   │
│  │ - email     │  │ - desc      │  │ - desc      │  │ - name      │   │
│  │ - password  │  │ - parent_id │  │ - owner_id  │  │ - label     │   │
│  │ - ...       │  │ - ...       │  │ - category  │  │ - wavelength│   │
│  │             │  │             │  │ - metadata  │  │ - intensity │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                                 │
                                 │
┌────────────────────────────────▼─────────────────────────────────────────┐
│                                                                          │
│                         File Storage                                     │
│                       (uploads/ directory)                               │
│                                                                          │
│  - Dataset files (CSV, MAT, HDF5, etc.)                                 │
│  - Organized by dataset ID                                              │
│  - Access controlled via API                                            │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Registration Flow
```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │      │ Frontend │      │ Backend  │      │ Database │
│ (Browser)│      │  React   │      │ FastAPI  │      │  SQLite  │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ Fill Form       │                 │                 │
     ├────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ POST /api/auth/ │                 │
     │                 │   register      │                 │
     │                 ├────────────────>│                 │
     │                 │                 │                 │
     │                 │                 │ Validate Data   │
     │                 │                 │ Hash Password   │
     │                 │                 │                 │
     │                 │                 │ INSERT user     │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ User Created    │
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │ User Response   │                 │
     │                 │<────────────────┤                 │
     │                 │                 │                 │
     │ Success Message │                 │                 │
     │<────────────────┤                 │                 │
     │                 │                 │                 │
```

### Dataset Upload Flow
```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │      │ Frontend │      │ Backend  │      │ Database │      │  Files   │
│ (Browser)│      │  React   │      │ FastAPI  │      │  SQLite  │      │ Storage  │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │                 │
     │ Fill Metadata   │                 │                 │                 │
     ├────────────────>│                 │                 │                 │
     │                 │                 │                 │                 │
     │                 │ POST /api/      │                 │                 │
     │                 │   datasets/     │                 │                 │
     │                 ├────────────────>│                 │                 │
     │                 │                 │                 │                 │
     │                 │                 │ Validate & Save │                 │
     │                 │                 ├────────────────>│                 │
     │                 │                 │                 │                 │
     │                 │                 │ Dataset ID      │                 │
     │                 │                 │<────────────────┤                 │
     │                 │                 │                 │                 │
     │                 │ Dataset Created │                 │                 │
     │                 │<────────────────┤                 │                 │
     │                 │                 │                 │                 │
     │ Upload File     │                 │                 │                 │
     ├────────────────>│                 │                 │                 │
     │                 │                 │                 │                 │
     │                 │ POST /api/      │                 │                 │
     │                 │   upload/       │                 │                 │
     │                 ├────────────────>│                 │                 │
     │                 │                 │                 │                 │
     │                 │                 │ Save File       │                 │
     │                 │                 ├────────────────────────────────>│
     │                 │                 │                 │                 │
     │                 │                 │ Parse CSV       │                 │
     │                 │                 │ Extract Samples │                 │
     │                 │                 │                 │                 │
     │                 │                 │ INSERT samples  │                 │
     │                 │                 ├────────────────>│                 │
     │                 │                 │                 │                 │
     │                 │ Upload Success  │                 │                 │
     │                 │<────────────────┤                 │                 │
     │                 │                 │                 │                 │
     │ Show Success    │                 │                 │                 │
     │<────────────────┤                 │                 │                 │
     │                 │                 │                 │                 │
```

### Dataset Visualization Flow
```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │      │ Frontend │      │ Backend  │      │ Database │
│ (Browser)│      │  React   │      │ FastAPI  │      │  SQLite  │
└────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                 │                 │
     │ Click Dataset   │                 │                 │
     ├────────────────>│                 │                 │
     │                 │                 │                 │
     │                 │ GET /api/       │                 │
     │                 │   datasets/{id} │                 │
     │                 ├────────────────>│                 │
     │                 │                 │                 │
     │                 │                 │ SELECT dataset  │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ Dataset Data    │
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │                 │ Increment views │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │ Dataset Details │                 │
     │                 │<────────────────┤                 │
     │                 │                 │                 │
     │ Display Details │                 │                 │
     │<────────────────┤                 │                 │
     │                 │                 │                 │
     │                 │ GET /api/       │                 │
     │                 │   datasets/{id}/│                 │
     │                 │   samples       │                 │
     │                 ├────────────────>│                 │
     │                 │                 │                 │
     │                 │                 │ SELECT samples  │
     │                 │                 ├────────────────>│
     │                 │                 │                 │
     │                 │                 │ Sample Data     │
     │                 │                 │<────────────────┤
     │                 │                 │                 │
     │                 │ Samples Array   │                 │
     │                 │<────────────────┤                 │
     │                 │                 │                 │
     │ Render Chart    │                 │                 │
     │ (Chart.js)      │                 │                 │
     │<────────────────┤                 │                 │
     │                 │                 │                 │
```

## Technology Stack Details

### Frontend Stack
```
┌────────────────────────────────────────┐
│         React Application              │
├────────────────────────────────────────┤
│                                        │
│  UI Layer:                             │
│  └─ React Components (TSX)             │
│                                        │
│  State Management:                     │
│  └─ Zustand Stores                     │
│                                        │
│  Styling:                              │
│  └─ TailwindCSS                        │
│                                        │
│  Visualization:                        │
│  └─ Chart.js + React-Chartjs-2         │
│  └─ Recharts                           │
│                                        │
│  Routing:                              │
│  └─ React Router DOM                   │
│                                        │
│  HTTP Client:                          │
│  └─ Axios (with interceptors)          │
│                                        │
│  Build Tool:                           │
│  └─ Vite                               │
│                                        │
│  Type Safety:                          │
│  └─ TypeScript                         │
│                                        │
└────────────────────────────────────────┘
```

### Backend Stack
```
┌────────────────────────────────────────┐
│       FastAPI Application              │
├────────────────────────────────────────┤
│                                        │
│  Web Framework:                        │
│  └─ FastAPI                            │
│                                        │
│  ASGI Server:                          │
│  └─ Uvicorn                            │
│                                        │
│  ORM:                                  │
│  └─ SQLAlchemy                         │
│                                        │
│  Validation:                           │
│  └─ Pydantic                           │
│                                        │
│  Authentication:                       │
│  └─ JWT (python-jose)                  │
│  └─ Passlib (password hashing)         │
│                                        │
│  File Handling:                        │
│  └─ aiofiles                           │
│  └─ python-multipart                   │
│                                        │
│  Data Processing:                      │
│  └─ Pandas                             │
│  └─ NumPy                              │
│                                        │
│  Database:                             │
│  └─ SQLite (development)               │
│  └─ PostgreSQL (production ready)      │
│                                        │
└────────────────────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Transport Layer                                          │
│     └─ HTTPS (production)                                    │
│     └─ CORS configuration                                    │
│                                                              │
│  2. Authentication Layer                                     │
│     └─ JWT tokens (Bearer authentication)                    │
│     └─ Token expiration (configurable)                       │
│     └─ Password hashing (bcrypt)                             │
│                                                              │
│  3. Authorization Layer                                      │
│     └─ User ownership checks                                 │
│     └─ Superuser permissions                                 │
│     └─ Public/private dataset access                         │
│                                                              │
│  4. Data Validation Layer                                    │
│     └─ Pydantic schemas                                      │
│     └─ Input sanitization                                    │
│     └─ File type validation                                  │
│     └─ File size limits                                      │
│                                                              │
│  5. Database Layer                                           │
│     └─ SQL injection prevention (ORM)                        │
│     └─ Parameterized queries                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────┐
│                         Load Balancer                           │
│                       (Nginx / CloudFlare)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
          ┌─────────────────┴──────────────────┐
          │                                    │
          ▼                                    ▼
┌──────────────────────┐           ┌──────────────────────┐
│  Frontend (Static)   │           │   Backend API        │
│                      │           │                      │
│  - React Build       │           │  - FastAPI           │
│  - Nginx/Vercel      │           │  - Gunicorn          │
│  - CDN Distribution  │           │  - Docker Container  │
└──────────────────────┘           └──────────┬───────────┘
                                              │
                                              │
                                   ┌──────────▼───────────┐
                                   │  PostgreSQL DB       │
                                   │                      │
                                   │  - Production Data   │
                                   │  - Backups           │
                                   │  - Replication       │
                                   └──────────────────────┘
                                              │
                                   ┌──────────▼───────────┐
                                   │  Object Storage      │
                                   │  (S3 / MinIO)        │
                                   │                      │
                                   │  - Dataset Files     │
                                   │  - Large Data        │
                                   └──────────────────────┘
```

---

This architecture provides a scalable, secure, and maintainable platform for spectral dataset management.
