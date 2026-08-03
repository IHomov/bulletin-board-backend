# 📢 Announcements API

A robust RESTful API for an announcement platform built with **Node.js**, **Express**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Key Features

* **Authentication & Authorization**:
  * Protected routes require a valid JWT token via custom authentication middleware.
  * Ownership enforcement: Users can only update or delete their own announcements.

* **Search & Filtering**:
  * **Category Filtering**: Filter announcements by exact category match (`category`).
  * **Case-Insensitive Search**: Search across `title` and `description` fields (`search`).
  * **Sorting**: Flexible sorting by creation date (`sort=newest` / `sort=oldest`).

* **Pagination**:
  * Dynamic pagination via `page` and `limit` / `perPage` query parameters.
  * Informative response payload containing pagination metadata (`total`, `page`, `totalPages`, `perPage`).

---

## 🛠 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/announcements` | Retrieve a list of announcements (supports filtering & pagination) | Public |
| **GET** | `/announcements/:id` | Get detailed information about a specific announcement | Public |
| **POST** | `/announcements` | Create a new announcement | Private |
| **PUT / PATCH** | `/announcements/:id` | Update an existing announcement (Owner only) | Private |
| **DELETE** | `/announcements/:id` | Delete an announcement (Owner only) | Private |

---

## 📝 Query Parameter Examples (`GET /announcements`)

* **Search by keyword**:  
  `GET /announcements?search=samsung`

* **Filter by category**:  
  `GET /announcements?category=furniture`

* **Pagination**:  
  `GET /announcements?page=1&limit=5`

* **Combined Query with Sorting**:  
  `GET /announcements?category=electronics&search=phone&page=1&limit=10&sort=oldest`

---

## 📄 Response Format (`GET /announcements`)

```json
{
  "data": [
    {
      "id": 1,
      "title": "Samsung Galaxy S23",
      "description": "Mint condition, used for 2 months",
      "price": 650,
      "category": "electronics",
      "userId": 2,
      "createdAt": "2026-08-01T10:15:30.000Z",
      "user": {
        "id": 2,
        "username": "alex_dev",
        "email": "alex@example.com",
        "name": "Alex"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "perPage": 10
  }
}