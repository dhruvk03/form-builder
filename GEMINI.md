# Form Builder Application

A browser-based, schema-driven Form Builder application inspired by Google Forms.

## Project Overview

This project allows users to create, manage, and fill dynamic forms. It features a robust builder with conditional logic and calculations, a home dashboard for tracking responses, and a high-fidelity filling experience with native PDF export.

## Tech Stack

- **Framework:** React 19 (TypeScript)
- **Bundler:** Vite
- **Routing:** React Router 7
- **Styling:** CSS Modules (Google Forms aesthetic)
- **Persistence:** LocalStorage

## Key Features

- **Dashboard:** Manage form templates and view nested responses.
- **Form Builder:**
  - **9 Field Types:** Short Text, Paragraph, Number, Date, Single Select (Radio/Dropdown/Tiles), Multi Select, File Upload, Section Header, and Calculation.
  - **Conditional Logic:** Show/Hide/Require/Optional based on other field values.
  - **Dynamic Calculations:** Aggregate values (Sum, Average, Min, Max) from source fields in real-time.
  - **Validation:** Deletion guarding for referenced fields.
- **Form Filler:**
  - Real-time dependency and calculation updates using `useMemo`.
  - Schema-driven dynamic rendering.
  - Native PDF export using `window.print()` with custom print styles.

## Architectural Principles

- **Plugin-Based:** Designed with a strictly typed "Field Plugin Registry" allowing new field types to be added seamlessly.
- **Schema-Driven:** Everything from rendering to validation is derived from a strict TypeScript schema (`src/types/schema.ts`).
- **Minimal Dependencies:** Built without external state management (Redux/Zustand) or UI libraries (Tailwind/Material UI).
- **Stable IDs:** Prefix-based UUIDs (`tpl_`, `fld_`, `res_`) ensure reliable references across templates and responses.
- **Surgical State:** Lifted `useState` for complex builder logic and `useMemo` for derived filling states.

## Getting Started

1. `npm install` - Install dependencies.
2. `npm run dev` - Start the development server.
3. `npm run build` - Verify the production build.

## Documentation

- `src/types/schema.ts`: Core data models.
- `src/fields/`: The field plugin registry and individual field implementations.
- `src/utils/`: Pure logic for validation, dependencies, and storage.
- `src/pages/`: Main application routes (Home, Builder, Fill).
- `src/components/`: Reusable UI cards and specific form renderers.