# NexSales - Enterprise Inventory Dashboard 🚀

**NexSales** is a high-performance inventory management and trading dashboard built for the modern web. This project serves as the Capstone Project for the **Advanced React Module**, demonstrating mastery of complex state management, performance optimization, and scalable architecture.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Redux%20Toolkit%20%7C%20TypeScript-blue)

## 📋 Project Scenario
As the Lead Frontend Engineer, the goal was to rebuild the internal "Admin Dashboard" from scratch to handle:
- **High-velocity data:** Managing 5,000+ inventory rows without lag.
- **Complex State:** Global authentication, role-based access, and data filtering.
- **Resilience:** Error handling and strict type safety.

## 🛠️ Tech Stack & Libraries

- **Core:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) (Slices, Thunks, createEntityAdapter)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Routing:** React Router DOM v6
- **Performance:** @tanstack/react-virtual (Virtualization), React.lazy & Suspense
- **Data Visualization:** Recharts
- **Forms & Validation:** React Hook Form, Zod
- **Icons:** Lucide React

## ✨ Key Features

### 1. 🔐 Authentication System
- Simulated login flow with `createAsyncThunk`.
- Role-based access control (Admin vs. Analyst).
- **Protected Routes** ensuring unauthorized users cannot access the dashboard.

### 2. 📦 High-Performance Inventory Management
- **Virtualization:** Utilizes `@tanstack/react-virtual` to render only visible rows from a dataset of **5,000+ records**, maintaining 60 FPS scrolling.
- **Advanced Filtering:** Memoized selectors using `createSelector` for instant search, category, and status filtering.
- **Normalization:** Data stored using `createEntityAdapter` for O(1) CRUD operations.

### 3. 📊 Analytics Dashboard
- Interactive charts visualizing inventory value and stock levels.
- **Lazy Loaded:** The heavy Analytics module is code-split and loaded only when needed.
- **Robustness:** Wrapped in a custom `ErrorBoundary` to prevent app-wide crashes.

### 4. 🎨 Modern UI/UX
- Responsive Sidebar with active state styling.
- **Dark/Light mode** support (via Tailwind).
- Custom **Compound Component** pattern for Data Tables.
- **Portals** used for Modals (Edit/Delete confirmations) to handle z-index correctly.

## 🏗️ Architecture & Advanced Patterns

This project implements specific Advanced React patterns as required:

| Pattern | Implementation |
|---------|----------------|
| **Redux Slices** | Split into `authSlice`, `inventorySlice` (with Adapter), `notificationSlice`. |
| **Memoization** | `React.memo` for table rows, `useCallback` for event handlers to prevent wasted renders. |
| **Code Splitting** | Route-based splitting for `InventoryPage` and `AnalyticsPage` using `Suspense`. |
| **Custom Hooks** | `useToast` for notification management. |
| **Compound Components** | `<DataTable>` component exposing sub-components (`.Header`, `.Row`, `.Cell`). |

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/your-username/nexsales-dashboard.git](https://github.com/your-username/nexsales-dashboard.git)
   cd nexsales-dashboard
Install dependencies

Bash

npm install
Start the development server

Bash

npm run dev
🔑 Test Credentials
Use the following credentials to test the application logic:

Admin Access:

Email: admin@nexsales.com

Password: admin123

Capabilities: View, Edit, Delete products.

Analyst Access:

Email: analyst@nexsales.com (or any valid email)

Password: password123 (must be > 6 chars)

Capabilities: View only.

📂 Project Structure
Bash

src/
├── components/        # Reusable UI components (Buttons, Inputs, etc.)
│   ├── ui/           # Shadcn UI components
│   ├── DataTable/    # Compound Component implementation
│   └── ...
├── pages/            # Main route pages (Lazy loaded)
├── store/            # Redux setup
│   ├── slices/       # Auth, Inventory, Notification slices
│   └── store.ts      # Store configuration
├── lib/              # Utilities (cn, validators)
└── App.tsx           # Main entry with Routing & Suspense
👨‍💻 Author
Pham Trung Kien

Student ID: 23520803

University: University of Information Technology (UIT) - VNU-HCM

Course: Advanced React Module