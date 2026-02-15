# Inventory & Production Suggestion (Web + API)

Web system to manage products, raw materials, and their bill of materials (BOM), and to compute a production suggestion based on current stock, prioritizing higher-value products.

---

### Live Demo
- **Frontend (App):** [https://autoflex-thomgomes.vercel.app/](https://autoflex-thomgomes.vercel.app/)
- **Backend (Swagger API):** [https://autoflex-api-lsgq.onrender.com/q/swagger-ui/](https://autoflex-api-lsgq.onrender.com/q/swagger-ui/)

---

## Key Features

- **Products CRUD** (id, name, price)
- **Raw Materials CRUD** (id, name, stock quantity)
- **BOM Management**: Link raw materials to products (Recipe/Composition)
- **Production Suggestion (Greedy Algorithm)**:
  - Calculates maximum production capacity based on available stock.
  - Prioritizes higher-price products to maximize estimated revenue.
  - Simulation runs in-memory before committing to database.

---

## Tech Stack

### Backend (API)
- **Java 21 + Quarkus**: High-performance REST API.
- **Hibernate ORM / Panache**: Data persistence.
- **PostgreSQL**: Relational database (Supabase/Docker).
- **JUnit 5**: Integration testing.

### Frontend (Web)
- **React + TypeScript + Vite**: Fast SPA.
- **Redux Toolkit**: Global state management.
- **TailwindCSS + Shadcn/UI**: Modern, accessible UI.
- **Cypress**: End-to-End (E2E) testing.

---

## Architecture

This project follows an **API-first approach**: the backend exposes REST endpoints and the frontend consumes them.
The codebase is organized as a **monorepo**:
- `backend/` – Quarkus REST API
- `frontend/` – React application

---

## Production Suggestion Rules (The Algorithm)

1. **Sort** products by **price (descending)**.
2. For each product, compute the **maximum producible quantity** based on the remaining stock of required raw materials.
3. **Allocate** stock virtually as quantities are suggested to avoid double counting.
4. **Return** the suggested production plan and total estimated revenue.

---

## Quality Assurance

The project maintains a high standard of code quality with automated tests:

- **Backend:** Integration tests using `JUnit` and `RestAssured` validation for all endpoints.
- **Frontend:** - Unit tests with `Jest` for Redux Slices and Components.
  - **E2E Tests with Cypress**: Validates the full user journey (Create Material -> Create Product -> Auto-generate Recipe -> Verify Dashboard Suggestion).

---

## Domain Model & SQL

```sql
-- Materials
CREATE TABLE materials (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT ck_material_stock_nonnegative CHECK (stock_quantity >= 0)
);

-- Products
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(19, 2) NOT NULL DEFAULT 0,
  CONSTRAINT ck_product_price_nonnegative CHECK (price >= 0)
);

-- Bill of Materials (BOM)
CREATE TABLE product_materials (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  quantity_required INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT ck_quantity_required_positive CHECK (quantity_required > 0),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT fk_material FOREIGN KEY (material_id) REFERENCES materials(id),
  CONSTRAINT uq_product_material UNIQUE (product_id, material_id)
);