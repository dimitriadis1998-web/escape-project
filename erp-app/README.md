# Escape ERP Frontend

Frontend application for a multi-tenant ERP system designed for mini markets and retail stores.

The application connects to a REST API and provides product management, inventory monitoring, expiration tracking, user administration and role-based access control.

## Features

- JWT authentication
- Persistent authentication session
- Protected application routes
- Admin and reader roles
- Live dashboard statistics
- Product creation, editing and soft deletion
- Product search by name, SKU or barcode
- Product filtering by category, favorite status and price
- Product sorting by name, price or creation date
- Inventory batch management
- Stock and low-stock monitoring
- Expiration date monitoring
- Configurable expiration period
- User creation, editing and soft deletion
- Responsive ERP layout
- Centralized API client and error handling

## User Roles

### Admin

Administrators can:

- View all ERP data
- Create, edit and deactivate products
- Create, edit and delete inventory batches
- View expiration information
- Create, edit and deactivate users
- Assign admin or reader roles

### Reader

Readers can:

- View the dashboard
- View products
- Use product search, filters and sorting
- View inventory and stock information
- View expiration information

Readers cannot modify products, inventory batches or users.

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Native Fetch API
- Oxlint

## Backend

The frontend communicates with the Escape ERP REST API.

Backend repository:

[ERP Backend](https://github.com/dimitriadis1998-web/erp-backend)

Default local API URL:

```text
http://localhost:3000/api
```

## Project Structure

```text
src/
├── assets/
├── features/
│   ├── auth/
│   ├── categories/
│   ├── dashboard/
│   ├── expirations/
│   ├── inventory/
│   ├── not-found/
│   ├── products/
│   └── users/
├── shared/
│   ├── api/
│   ├── Layout/
│   └── utils/
├── App.tsx
├── index.css
└── main.tsx
```

Each feature contains its own page, API functions and TypeScript types.

## Application Routes

| Route | Description |
| --- | --- |
| `/login` | User authentication |
| `/` | ERP dashboard |
| `/products` | Product management and filtering |
| `/inventory` | Inventory batch management |
| `/expirations` | Expiration monitoring |
| `/users` | User management for administrators |

## Requirements

Before running the frontend, install:

- Node.js
- npm
- The Escape ERP backend
- A MongoDB database configured through the backend

## Installation

Clone the repository:

```bash
git clone https://github.com/dimitriadis1998-web/escape-project.git
```

Enter the frontend directory:

```bash
cd escape-project/erp-app
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a local environment file from `.env.example`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS or Linux:

```bash
cp .env.example .env.local
```

Default configuration:

```env
VITE_API_URL=http://localhost:3000/api
```

Environment files containing local or production configuration must not be committed to Git.

## Running the Application

First, start the backend server on port `3000`.

Then start the frontend development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Available Scripts

### Development server

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

### Production build

```bash
npm run build
```

Runs TypeScript compilation and creates the production build.

### Code quality

```bash
npm run lint
```

Checks the source code using Oxlint.

### Production preview

```bash
npm run preview
```

Serves the generated production build locally.

## Authentication

After a successful login, the backend returns:

- A JWT access token
- The authenticated user
- The user role
- The tenant identifier

The frontend stores the authentication session locally and includes the access token in protected API requests using the following header:

```http
Authorization: Bearer <access-token>
```

Logging out removes the stored session.

## API Integration

All authenticated API requests pass through the shared API client:

```text
src/shared/api/api-client.ts
```

The client is responsible for:

- Adding the authorization header
- Sending JSON request bodies
- Reading the standard API response
- Converting failed responses into application errors

## Data Isolation

Every authenticated user belongs to a tenant.

The backend uses the tenant identifier from the authenticated JWT to isolate:

- Users
- Categories
- Products
- Inventory batches

The frontend does not allow users to choose or modify the tenant identifier manually.

## Validation and Error Handling

The frontend provides:

- Required form fields
- Email validation
- Password length validation
- Numeric price and quantity inputs
- Minimum and maximum price validation
- Loading states
- API error messages
- Confirmation before destructive actions

The backend performs the final validation and authorization for every request.

## Quality Checks

Before committing changes, run:

```bash
npm run build
npm run lint
```

The final application should complete both commands without errors or warnings.

## Author

Kiriakos Dimitriadis