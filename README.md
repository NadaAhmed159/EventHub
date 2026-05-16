# 🎟️ EventHub

## 🚀 Overview

EventHub is a real-time event management and ticketing platform built with **ASP.NET Core 8** and **React 19**.

The platform provides a complete ecosystem for:
- 👥 Participants to discover and book events
- 🎟️ Organizers to create and manage events
- 🛡️ Admins to moderate organizers and event publishing

The system focuses heavily on:
- Real-time communication
- Scalable architecture
- Secure authentication
- Concurrency-safe ticket booking
- High-performance frontend state management

---

# ✨ Core Features

## 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected dashboards for Admins, Organizers, and Participants
- BCrypt password hashing

## 🎫 Ticketing System
- Real-time ticket availability updates using SignalR
- Optimistic concurrency control using EF Core RowVersion
- Dynamic QR code generation for secure check-ins
- Booking management & validation

## 📡 Real-Time Features
- Live notifications
- Event updates
- Instant booking confirmations
- WebSocket communication with SignalR

## ⭐ User Engagement
- Favorites / Watchlist
- Reviews & Ratings
- Advanced event filtering & search

---

# 🏗️ Architecture

The backend follows a strict **N-Tier / Clean Architecture** approach.

```text
EventHub/
├── backend/
│   ├── EventHub.API/
│   ├── EventHub.BLL/
│   ├── EventHub.DAL/
│   └── EventHub.Domain/
└── frontend/
    └── src/
```

## Backend Layers

### EventHub.API
- Controllers
- SignalR Hubs
- Swagger Configuration
- Dependency Injection
- Authentication Middleware

### EventHub.BLL
- Business Logic
- Service Implementations
- DTO Mapping
- QR Code Generation

### EventHub.DAL
- DbContext
- Repositories
- Unit of Work
- EF Core Migrations

### EventHub.Domain
- Entities
- Enums
- Base Models

---

# ⚙️ Tech Stack

## Backend
- ASP.NET Core 8 Web API
- Entity Framework Core 8
- SQL Server
- SignalR
- JWT Authentication
- BCrypt.Net-Next
- Swagger / OpenAPI
- QRCoder

## Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Query v5
- Axios
- React Router DOM v7
- @microsoft/signalr

---

# 🔒 Security

- Secure JWT authentication
- Role-based authorization
- Password hashing using BCrypt
- Swagger protected with JWT Bearer authentication
- Configured CORS policies

---

# ⚡ Performance & Scalability

- React Query caching
- Stateless JWT authentication
- Optimistic concurrency handling
- Reduced server polling via SignalR
- Repository & Unit of Work patterns

---

# 🚀 Getting Started

## Prerequisites

- .NET 8 SDK
- Node.js v18+
- SQL Server

---

## Backend Setup

```bash
cd backend/EventHub.API

dotnet restore

dotnet ef database update

dotnet run
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 📡 API Documentation

Swagger documentation is available after running the backend:

```bash
https://localhost:{PORT}/swagger
```

---

# 📸 Screenshots

> Add screenshots here for:
- Home Page
- Organizer Dashboard
- Admin Dashboard
- Event Details
- Booking Flow
- QR Tickets

---

# 🛣️ Future Improvements

- Stripe / PayPal Integration
- Docker Containerization
- CI/CD Pipelines
- Redis Caching
- Cloud File Storage
- Background Workers (Hangfire)

---

# 🧠 Engineering Highlights

✅ Optimistic Concurrency using RowVersion  
✅ Real-time architecture with SignalR  
✅ Clean Architecture implementation  
✅ QR-based secure ticketing  
✅ High-performance frontend caching  
✅ Production-grade RBAC system

---

