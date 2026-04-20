# Luxé Bag Backend — Spring Boot REST API

Backend for the Luxé Bag luxury e-commerce frontend.

---

## Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+

### 1. Create Database
```sql
CREATE DATABASE luxe_db;
```

### 2. Configure Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/luxe_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
```

### 3. Run
```bash
mvn spring-boot:run
```

Server starts at: `http://localhost:8080`

> **Note:** Product seed data is inserted automatically from `data.sql` on first run (only when the `product` table is empty).

---

## API Reference

Base URL: `http://localhost:8080`

---

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=Tote` | Filter by category |
| GET | `/api/products?search=pearl` | Search by name |
| GET | `/api/products/{id}` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

**Categories:** `Handbags`, `Crossbody`, `Evening`, `Tote`, `Statement`

---

### Cart

All cart endpoints require `?sessionId=<your-session-id>` as a query param.
The session ID is a unique string that identifies the user's browser session (e.g. a UUID stored in localStorage).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart?sessionId=abc` | Get cart with total |
| POST | `/api/cart/add?sessionId=abc` | Add item to cart |
| PUT | `/api/cart/item/{cartItemId}?sessionId=abc` | Update item quantity |
| DELETE | `/api/cart/item/{cartItemId}?sessionId=abc` | Remove item |
| DELETE | `/api/cart/clear?sessionId=abc` | Clear entire cart |

**Add to cart body:**
```json
{
  "productId": 1,
  "quantity": 1,
  "selectedColor": "Black"
}
```

**Update quantity body:**
```json
{ "quantity": 3 }
```

---

### Wishlist

All wishlist endpoints require `?sessionId=<your-session-id>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist?sessionId=abc` | Get wishlist items |
| POST | `/api/wishlist/add?sessionId=abc` | Add product to wishlist |
| DELETE | `/api/wishlist/remove/{productId}?sessionId=abc` | Remove from wishlist |
| POST | `/api/wishlist/toggle?sessionId=abc` | Toggle wishlist (add/remove) |
| GET | `/api/wishlist/check/{productId}?sessionId=abc` | Check if product is wishlisted |

**Body for add/toggle:**
```json
{ "productId": 1 }
```

---

### Contact Form

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/submit` | Submit contact message |
| GET | `/api/contact/messages` | Get all messages |
| GET | `/api/contact/messages?status=UNREAD` | Filter by status |
| GET | `/api/contact/messages/{id}` | Get message by ID |
| PUT | `/api/contact/messages/{id}/read` | Mark as read |
| PUT | `/api/contact/messages/{id}/replied` | Mark as replied |
| DELETE | `/api/contact/messages/{id}` | Delete message |

**Statuses:** `UNREAD`, `READ`, `REPLIED`

**Submit body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1 555 000 0000",
  "subject": "General Inquiry",
  "message": "I would like to know more..."
}
```

---

### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/newsletter/subscribe` | Subscribe email |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe email |
| GET | `/api/newsletter/check?email=x` | Check subscription status |
| GET | `/api/newsletter/subscribers` | List all subscribers |

**Subscribe body:**
```json
{ "email": "jane@example.com" }
```

---

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments/book` | Book consultation |
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments?status=PENDING` | Filter by status |
| GET | `/api/appointments?email=x` | Filter by email |
| GET | `/api/appointments/{id}` | Get appointment by ID |
| PUT | `/api/appointments/{id}/confirm` | Confirm appointment |
| PUT | `/api/appointments/{id}/cancel` | Cancel appointment |
| PUT | `/api/appointments/{id}/complete` | Mark as completed |
| DELETE | `/api/appointments/{id}` | Delete appointment |

**Statuses:** `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

**Book body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+1 555 000 0000",
  "preferredDate": "2026-05-01",
  "preferredTime": "10:00 AM",
  "interestCategory": "Handbags",
  "notes": "Looking for an evening bag for a gala."
}
```

---

## Connecting the Frontend

In your React frontend, use the session ID approach for cart and wishlist.
Generate a UUID on app start and store it in `localStorage`:

```javascript
// utils/session.js
export function getSessionId() {
  let id = localStorage.getItem('luxe_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('luxe_session_id', id);
  }
  return id;
}
```

Then pass it to all cart/wishlist API calls:
```javascript
const sessionId = getSessionId();
fetch(`http://localhost:8080/api/cart?sessionId=${sessionId}`)
```

---

## Tech Stack
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA + Hibernate
- MySQL 8
- Maven
