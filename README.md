Product Marketplace System
Overview  
This is a modular product management system where businesses can list products for sale with a built-in approval workflow. The system enforces Role-Based Access Control (RBAC) so only authorized users can perform sensitive actions like product approval and user management.


Tech Stack

- Frontend: React (Create React App with React Router).
- Backend: Django with Django REST Framework (DRF).
- Database: MySQL.
- Authentication: JWT (JSON Web Tokens) via SimpleJWT.

What Was Implemented

- Authentication & Roles
  - Users belong to a `Business` via a `UserProfile`.
  - Roles: `ADMIN`, `EDITOR`, `APPROVER`, `VIEWER`.
  - Custom JWT payload includes `role` and `business_id` so the frontend can adapt the UI.

- Product Model & Lifecycle
  - Fields: `name`, `description`, `price`, `status`, `business`, `created_by`, `created_at`.
  - Status flow: `DRAFT` → `PENDING` (conceptual) → `APPROVED`. New products are created as `DRAFT` and must be approved before they appear in the public store.

- Permissions & Business Rules
  - Any authenticated user in a business can create products; they are automatically scoped to that user's business.
  - Only `ADMIN` and `APPROVER` roles can approve products.
  - Products are always filtered by the authenticated user's business for internal views to prevent cross‑business data leaks.
  - Only `ADMIN` / `EDITOR` / `APPROVER` (or the creator) can update or delete a product.

- API Endpoints
  - `POST /api/token/` – obtain JWT access token plus `role` and `business_id`.
  - `GET /api/products/` – list products for the current user's business (internal).
  - `POST /api/products/` – create a product (internal; automatically linked to the user's business and user).
  - `GET /api/products/<id>/` – retrieve a single product in the user's business.
  - `PUT /api/products/<id>/` – update a product (role/ownership restricted).
  - `DELETE /api/products/<id>/` – delete a product (role/ownership restricted).
  - `POST /api/products/<id>/approve/` – approve a product (only `ADMIN` / `APPROVER`).
  - `GET /api/products/public/` – public catalogue that returns only approved products; no authentication required.
  - `GET /api/business/users/` – list users in the current admin's business.
  - `POST /api/business/users/` – create a new user in the current admin's business and assign a role.

- Business & User Management
  - `Business` and `UserProfile` models exist and are also exposed in the Django admin interface.
  - Business admins (`ADMIN` role) can manage users for their business via:
    - Django admin (for manual management), or
    - The `/api/business/users/` endpoints for programmatic management.

- Frontend Behaviour & UI Adaptation
  - `Login` page performs JWT authentication and stores the access token and role in `localStorage`.
  - `ProtectedRoute` component:
    - Redirects unauthenticated users to the login screen.
    - Optionally checks `allowedRoles` to enforce role-based access per route.
  - `Dashboard`:
    - Shows products for the logged-in user's business.
    - Displays product status chips.
    - Shows an **Approve** button only for users with `ADMIN` or `APPROVER` roles and only for non‑approved products.
  - `AddProduct`:
    - Form to create a product (name, description, price) with basic validation and loading state.
    - Only accessible to `ADMIN`, `EDITOR`, and `APPROVER` via `ProtectedRoute`.
  - `PublicStore`:
    - Calls `/api/products/public/` and displays only approved products in a clean, card-based layout.
  - Layout includes navigation, logout, and links between the dashboard and public store.


How to Run the Project

Backend (Django + DRF)
1. Open a terminal and navigate to the backend folder:
   - `cd backend`
2. (Optional but recommended) Create and activate a virtual environment:
   - Windows:
     - `python -m venv venv`
     - `venv\Scripts\activate`
3. Install backend dependencies:
   - `pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow mysqlclient`
4. Configure your MySQL database in `config/settings.py` under `DATABASES['default']` (database name, user, password).
5. Apply database migrations:
   - `python manage.py migrate`
6. Create a superuser for admin access:
   - `python manage.py createsuperuser`
To populate the database with initial users making sure the databse is already running:
 -'python manage.py seed_demo_users'
7. Start the development server:
   - `python manage.py runserver`

Frontend (React)
1. Open a terminal and navigate to the frontend folder:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm start`
4. The app will typically run at `http://localhost:3000` and talk to the backend at `http://127.0.0.1:8000/api`.


How Authentication & Roles Work

- On login, the frontend calls `POST /api/token/` with username and password.
- The backend issues a JWT whose payload includes `role` and `business_id`.
- These values are stored in `localStorage` and:
  - Injected as `Authorization: Bearer <token>` on all API calls.
  - Used by `ProtectedRoute` and page components to adapt the UI (e.g. show/hide the Approve button or restrict access to certain screens).


Key Tech Decisions & Assumptions

- One-to-One Profile:
  - `UserProfile` is used to attach a `Business` and a `role` to each Django `User` for cleaner separation of auth vs domain data.

- JWT Storage:
  - Access token (and derived role) are stored in `localStorage` for simplicity during development.
  - For production, a more secure storage strategy (e.g. httpOnly cookies) is recommended.

- Automatic Business Scoping:
  - Product `business` and `created_by` are not client-controlled; they are always inferred from the authenticated user on the backend to prevent spoofing.


Known Limitations

- AI Chatbot: Not implemented in this project.
- Password Reset / Registration UI: Advanced auth flows (password recovery, self‑service sign‑up) are not implemented; a Django admin or the `/api/business/users/` endpoints should be used to create users.
- Product Images: If using `ImageField`, ensure the `media/` folder is created and served appropriately.