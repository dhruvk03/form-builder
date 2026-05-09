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