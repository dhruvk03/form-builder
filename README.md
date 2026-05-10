# Form Builder

A dynamic, browser-based Form Builder application inspired by Google Forms. Build complex forms with conditional logic, aggregate calculations, and a high-fidelity filling experience.

## 🚀 Features

### 📋 Form Builder

Create powerful forms using a drag-and-drop inspired interface.

* **9 Field Types:** Short Text, Long Text, Number, Date, Single Select (Radio/Dropdown/Tiles), Multi Select (Checkboxes), File Upload, Section Header, and Calculation.
* **Conditional Logic:** Dynamically show, hide, require, or make fields optional based on the values of other fields (e.g., "Show this field if 'Age' is greater than 18").
* **Real-time Calculations:** Aggregate values from multiple number fields in real-time (Sum, Average, Minimum, Maximum).
* **Validation:** Built-in constraints like min/max length, min/max values, date ranges, and selection limits.

### 📝 Form Filler

A seamless experience for users submitting responses.

* **Dynamic Updates:** Fields appear and disappear instantly as conditional logic dependencies are met.
* **Instant Calculations:** Aggregate fields update automatically as users type.
* **Validation:** Prevents submission if required fields are missing or constraints are violated.
* **Native PDF Export:** Generate clean, high-fidelity PDFs of filled forms without UI clutter (like navbars or buttons).

### 📊 Dashboard

* Manage your form templates.
* View individual responses for each form.
* Easily delete or edit existing templates.

## 🛠️ Getting Started

This project is built using **React 19**, **TypeScript**, and **Vite**. Data is persisted locally in your browser using `localStorage`.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository.
2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

## 🏗️ Architecture Highlights

* **Plugin-Based:** Designed with a strictly typed "Field Plugin Registry" allowing new field types to be added seamlessly.
* **Schema-Driven:** The entire UI (both Builder and Filler) and validation logic are driven by a strict TypeScript schema.
* **Zero UI Libraries:** Custom-built with Vanilla CSS Modules to maintain a lightweight footprint and exact design control.

## 🧠 Decisions & Reasoning

As part of the assignment, the following design decisions were made to address ambiguous or open-ended requirements:

### 1. Extensibility via Plugin Architecture

* **Ambiguity:** The spec requires various field types and implies the need for a highly extensible system.
* **Decision:** Implemented a highly decentralized "Field Plugin Registry."
* **Reasoning:** Instead of giant `switch` statements scattered across the builder, renderer, and validation logic, each field type (e.g., `NumberPlugin`) encapsulates its own schema default, Builder UI, Filler UI, and validation rules. This strictly obeys the Open-Closed Principle (OCP)—a new field type can be added by creating a single plugin file without modifying *any* core engine files.

### 2. Component Structure & State Management

* **Ambiguity:** How to handle the complex state of form building and dynamic form filling dependencies without introducing "prop drilling" or overly complex hierarchies.
* **Decision:** Relied exclusively on React's native `useState` and `useMemo` with a shallow, flat component tree.
* **Reasoning:** By keeping the component tree relatively flat (max depth 4), state is lifted efficiently to the Page level (`BuilderPage` or `FillPage`). Props are strictly consumed at each level they are passed to, meaning no artificial prop drilling is occurring. This structure completely negates the need for external state management libraries (like Redux or Zustand), keeping the application lightweight.

### 3. Conditional Logic Evaluation & Structure (Trade-off)

* **Ambiguity:** How to structurally define and evaluate conditional logic rules (show/hide/require) across the form without tightly coupling components.
* **Decision:** Implemented a declarative, schema-driven dependency array evaluated via pure utility functions.
* **Reasoning:** Structurally, conditional logic is defined at the schema level. Each field can possess an array of `Dependency` objects containing a target `fieldId`, an `operator` (e.g., `equals`, `greaterThan`), a target `value`, and an `action` (`show`, `hide`, `require`, `optional`). During form filling, a pure utility function (`evaluateFieldState`) checks these rules against the current global form values to resolve each field's visibility and requirement status. This structural choice cleanly decouples the business logic of dependency evaluation from the React UI components, keeping the components "dumb" and focused only on rendering the resolved state.

### 4. Styling Aesthetic

* **Ambiguity:** The spec left the specific UI design open-ended.
* **Decision:** Decided to model the application on a high-fidelity "Google Forms" aesthetic using strict Vanilla CSS Modules without UI frameworks (like Tailwind or Material UI).
* **Reasoning:** This demonstrates precise pixel-level control over CSS and avoids the bundle bloat of external libraries. It also allowed for strict isolation of component styles and precise targeting for the PDF export via media queries.

### 5. PDF Export Approach

* **Constraint:** The spec explicitly forbade external libraries but required a native PDF export feature.
* **Decision:** Leveraged native `window.print()` combined with dedicated `@media print` CSS rules.
* **Reasoning:** Since heavy canvas/PDF generation libraries (like `html2canvas` or `jspdf`) were off the table, using the browser's native print engine ensures perfect vector-quality text, a tiny bundle size, and a highly accessible output document while satisfying the assignment constraints.

## 🛡️ Edge Cases Handled

### 1. Schema Integrity (Deletion Guards)

* **Ambiguity:** What happens if a user deletes a field that another field depends on (e.g., in a calculation or display logic)?
* **Decision:** Implemented strict deletion guarding in the builder.
* **Reasoning:** If Field B depends on Field A, the builder actively prevents the deletion of Field A and alerts the user. This guarantees the structural integrity of the underlying JSON schema and prevents runtime crashes in the filler view without the need for complex, heavy graph-resolution algorithms.

### 2. Builder-Side Configuration Constraints

* **Ambiguity:** The spec does not define how to handle illogical configurations created by the form builder (e.g., setting a max value lower than a min value).
* **Decision:** Implemented configuration validation within each field plugin.
* **Reasoning:** To prevent broken forms from reaching the end user, each plugin validates its own configuration state in real-time. The builder UI blocks saving and warns the creator if they attempt impossible constraints (e.g., `maxLength` < `minLength`, `maxDate` before `minDate`, or `maxSelections` < `minSelections`).

## 🔮 What I Would Improve With More Time

1. **Drag and Drop Reordering:** Implement a robust library like `@dnd-kit/core` to allow users to intuitively reorder fields in the builder via drag-and-drop, rather than them being fixed to creation order.
2. **Comprehensive Automated Testing:** Add a robust end-to-end (E2E) testing suite using a tool like Playwright or Cypress. Having comprehensive E2E tests covering the critical paths of building, configuring, and filling forms would be invaluable for preventing regressions and providing higher confidence when making architectural changes or adding new field types.
3. **Advanced Accessibility (a11y):** Spend more time auditing the interactive form UI with screen readers and keyboard navigation to ensure full WCAG compliance.
