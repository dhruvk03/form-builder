# AI Usage Log

This document outlines the key interactions with the AI assistant during the development of this Form Builder application, highlighting the decision-making process, verification steps, and course corrections to ensure high-quality code.

## 1. Initial Architecture & Code Generation

*Note: This prompt is exceptionally long because it captures all of my upfront planning. It outlines the application features, flow, architecture, and important conventions. This is the first prompt I gave to the AI coding agent to ensure the project started on the right track.*

* **Prompt:**

```text
Build a browser-based Form Builder application using React + TypeScript.

The application should feel visually and behaviorally similar to Google Forms:

* vertically stacked question cards
* centered layout
* clean white cards
* subtle borders/shadows
* minimal SaaS-like UI
* purple accent color

Reference screenshots of Google Forms-style UI are attached and should be used as the primary visual reference for:

* layout
* spacing
* card structure
* typography hierarchy
* colors
* visual density
* question separation
* interaction simplicity

The implementation should visually resemble the attached screenshots as closely as reasonably possible while keeping the codebase simple and maintainable.

Each question should appear inside its own visually separated section/card similar to Google Forms:

* white background
* rounded corners
* subtle border/shadow
* proper vertical spacing between question cards
* each field should feel like an independent section block

The goal is to keep the implementation:

* clean
* minimal
* strongly typed
* schema-driven
* maintainable

Avoid unnecessary abstractions or over-engineering.

Tech Stack

Use:

* React
* TypeScript
* React Router
* CSS Modules
* ESLint
* Prettier

Do NOT use:

* Redux
* Zustand
* MobX
* Tailwind
* Styled Components
* Emotion
* Any CSS-in-JS library
* Any third-party PDF generation library
* Any drag-and-drop library

Use local component state and lifted state wherever practical.

Avoid Context API unless genuinely necessary.

Avoid any in TypeScript.

⸻

Routes

Use React Router.

Routes:

/                     → HomePage
/builder              → Create new template
/builder/:templateId  → Edit existing template
/fill/:templateId/new → Create new response
/fill/:templateId/:responseId → View existing response

⸻

Application Flow

1. User lands on Home Page
2. User creates a new template via Builder Page by clicking the New Template button on the Home Page
3. User configures fields
4. User saves template to localStorage
5. Template appears on Home Page
6. User clicks “New Response”
7. Fill Page dynamically renders form from schema
8. User fills form
9. Validation runs
10. User submits form
11. Response saved to localStorage
12. User downloads PDF using native browser print flow
13. Filled responses appear nested under corresponding template on Home Page

⸻

Data Persistence

Use localStorage only.

Persist:

* templates
* responses

Create utility functions for localStorage interaction.

Example:

saveTemplates()
loadTemplates()
saveResponses()
loadResponses()

Do NOT scatter localStorage logic throughout components.

⸻

Stable IDs

Every entity must have stable unique IDs.

Generate random UUID-based IDs with prefixes for:

* templates
* fields
* responses

Examples:

tpl_a82f91
fld_c19a22
res_91db77

Where:

* tpl_ → template IDs
* fld_ → field IDs
* res_ → response IDs

Never use array indexes as identifiers.

Dependencies and calculations must reference field IDs.

⸻

Schema-Driven Architecture

The entire app must be schema-driven.

The renderer should dynamically map field types to React components.

Example:

const fieldComponentMap = {
  singleLineText: SingleLineTextField,
  multiLineText: MultiLineTextField,
  number: NumberField,
  date: DateField,
  singleSelect: SingleSelectField,
  multiSelect: MultiSelectField,
  fileUpload: FileUploadField,
  sectionHeader: SectionHeaderField,
  calculation: CalculationField,
}

Avoid hardcoded form rendering logic.

⸻

TypeScript Architecture

Create shared types only where necessary.

Suggested structure:

/src/types
  fields.ts
  templates.ts

Keep feature-specific types close to their feature if they are not shared.

Use discriminated unions for field types.

Example:

type FormField =
  | SingleLineTextField
  | MultiLineTextField
  | NumberField
  | DateField
  | SingleSelectField
  | MultiSelectField
  | FileUploadField
  | SectionHeaderField
  | CalculationField

Use a base field type.

Example:

type BaseField = {
  id: string
  type: FieldType
  dependencies?: Dependency[]
  defaultVisibility?: boolean
  defaultRequired?: boolean
}

Each field type must have its own strongly typed config schema.

Example:

type NumberField = BaseField & {
  type: 'number'
  config: {
    label: string
    required: boolean
    min?: number
    max?: number
    decimalPlaces?: number
    prefix?: string
    suffix?: string
  }
}

Validation rules should naturally emerge from field config types.

Do NOT create generic untyped validation schemas.

⸻

Template Schema

Use a structure similar to:

type FormTemplate = {
  id: string
  title: string
  fields: FormField[]
}

Example template:

{
  id: 'tpl_a82f91',
  title: 'Employee Form',
  fields: [
    {
      id: 'fld_c19a22',
      type: 'singleLineText',
      config: {
        label: 'Name',
        required: true
      }
    },
    {
      id: 'fld_d82a11',
      type: 'number',
      config: {
        label: 'Age'
      }
    }
  ]
}

⸻

Response Schema

Responses must be stored separately from templates.

Do NOT store field values inside the template schema.

Response values should map field IDs to user-entered values.

Example:

{
  id: 'res_91db77',
  templateId: 'tpl_a82f91',
  submittedAt: '2026-05-07T22:30:00Z',
  values: {
    fld_c19a22: 'John',
    fld_d82a11: 25
  }
}

This allows:

* one template
* multiple responses

Rendering should combine:

* template schema
* response values

Example:

const value = response.values[field.id]

This keeps rendering complexity O(N), not O(N²).

⸻

Home Page

The Home Page should:

* list all templates
* show template title
* show field count

Each template card should contain:

* Edit Template button
* New Response button

Under each template card, render all responses belonging to that template.

Structure example:

Employee Onboarding
12 Fields
[Edit Template]
[New Response]
Responses:
- Submitted on May 7, 2026 10:30 PM [Re-download PDF]
- Submitted on May 7, 2026 11:15 PM [Re-download PDF]

Responses must appear visually nested under their corresponding template.

⸻

Builder Page

The Builder Page is used to create/edit templates.

The BuilderPage component should own all builder state.

Use lifted local state.

Do NOT use Redux.

Suggested builder state:

type BuilderState = {
  templateId: string
  title: string
  fields: FormField[]
}

⸻

Builder Component Hierarchy

Use an architecture similar to:

BuilderPage
│
├── FormHeader
│
├── FieldList
│     ├── FieldEditorCard
│     │      ├── QuestionTitle
│     │      ├── QuestionType
│     │      ├── FieldConfigurationSection
│     │      ├── RequiredToggle
│     │      └── DeleteButton
│
└── AddFieldButton

No drag-and-drop.

No move up/down controls.

No duplication controls.

No preview mode.

Field order should remain insertion order.

⸻

Field Editor Behavior

Each field should support:

* edit
* delete

Deletion must be blocked if:

* another field depends on it
* a calculation field references it

Show validation message explaining why deletion is blocked.

Do NOT silently remove references.

Builder configuration validation errors should render inline below the corresponding configuration input.

Do NOT only validate on save.

⸻

Supported Field Types

1. Single Line Text

Config:

* label
* placeholder
* required
* minLength
* maxLength
* prefix
* suffix

⸻

2. Multi-line Text

Config:

* label
* placeholder
* required
* minLength
* maxLength
* rows

⸻

3. Number

Config:

* label
* required
* min
* max
* decimalPlaces (0–4)
* prefix
* suffix

⸻

4. Date

Config:

* label
* required
* prefillToday
* minDate
* maxDate

⸻

5. Single Select

Config:

* label
* required
* options
* displayType

Display types:

* radio
* dropdown
* tiles

All three display types must behave identically regarding:

* selection
* validation
* required state

Only the visual presentation should differ.

⸻

6. Multi Select

Config:

* label
* required
* options
* minSelections
* maxSelections

⸻

7. File Upload

Config:

* label
* required
* allowedFileTypes
* maxFiles

Persist metadata only:

* filename
* size
* type

Do NOT persist actual file contents.

Validate:

* allowed file extensions
* max file count

⸻

8. Section Header

Config:

* label

No size configuration required.

This field does not capture values.

⸻

9. Conditional Dependencies

Fields may depend on values of other fields for:

* visibility
* required state

Dependencies should reference field IDs.

Example:

type Dependency = {
  fieldId: string
  operator:
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'greaterThan'
    | 'lessThan'
    | 'withinRange'
    | 'containsAny'
    | 'containsAll'
    | 'containsNone'
    | 'before'
    | 'after'
  value: unknown
  action:
    | 'show'
    | 'hide'
    | 'require'
    | 'optional'
}

Example:

dependencies: [
  {
    fieldId: 'fld_c19a22',
    operator: 'equals',
    value: 'India',
    action: 'show'
  }
]

Visibility and required state should ONLY emerge from dependency evaluation.

Do NOT implement independent hide/show toggles.

Implement utility:

evaluateFieldState(field, values)

which returns:

{
  visible: boolean,
  required: boolean
}

⸻

Dependency Rules

Prevent:

* direct circular dependencies
* indirect circular dependencies

Examples:

A → B → A
A → B → C → A

Implement DFS-based cycle detection before template save.

If circular dependency exists:

* prevent template save
* show validation error

⸻

Calculation Field

Implement read-only calculated fields.

Config:

* label
* sourceFieldIds
* aggregationType
* decimalPlaces

Aggregation types:

* sum
* average
* minimum
* maximum

Rules:

* updates in realtime
* user cannot edit manually
* calculation field cannot use another calculation field as source

Calculated values should be derived from current form values during render.

Do NOT store calculated values separately in state.

⸻

Fill Page

The Fill Page dynamically renders forms from schema.

Suggested hierarchy:

FillPage
│
├── FormHeader
│
├── FormRenderer
│     ├── FieldRenderer
│     │      ├── TextField
│     │      ├── NumberField
│     │      ├── SelectField
│     │      └── ...
│
└── FormActions
      ├── SubmitButton
      └── DownloadPdfButton

Opening an existing response route:

/fill/:templateId/:responseId

should render the response in read-only mode.

Users should not edit already submitted responses.

The page should support:

* viewing submitted data
* re-downloading PDF

⸻

Fill State

Keep fill state local to FillPage.

Suggested state:

const [values, setValues]
const [errors, setErrors]

Do NOT mutate schema while filling forms.

Store values separately from schema.

Example:

values = {
  fld_c19a22: 'John',
  fld_d82a11: 25
}

Whenever values change:

* dependency visibility should update
* calculation fields should update

These should be derived dynamically during render.

Do NOT store derived visibility/calculation state separately.

⸻

Validation Architecture

Implement pure validation utility functions.

Suggested APIs:

validateField(field, value, values)
validateForm(fields, values)

Builder validation:

* invalid templates cannot be saved

Fill validation:

* invalid forms cannot be submitted

Field-level errors should render below their corresponding fields.

⸻

Hidden Field Rules

Hidden fields must:

* never validate
* never appear in submitted values
* never appear in PDF export

If a field becomes hidden dynamically:

* remove its value from form state immediately

Hidden state must always override required state.

Meaning:

* hidden required fields should never validate

⸻

Builder Validation Edge Cases

Handle these edge cases:

1. Circular dependencies
2. Referenced field deletion
3. Empty select options
4. Invalid min/max configurations
5. Empty templates

Examples:

* min > max
* minLength > maxLength
* minSelections > maxSelections
* minDate > maxDate
* dropdown with zero options
* template with zero fields

Prevent template save if validation fails.

⸻

PDF Export

Do NOT use any third-party PDF libraries.

Use native browser print flow:

window.print()

Create a dedicated printable container/component used exclusively for PDF export.

Only the filled form content should appear in the printable/PDF view.

Do NOT print:

* navigation
* buttons
* builder controls
* sidebars
* action bars
* home page UI
* application chrome

Create print-specific layout/styles using:

* dedicated printable container
* @media print

The exported PDF must include:

* form title
* visible field labels
* visible submitted values
* fields in original order

Do NOT include hidden fields.

⸻

Styling

Use CSS Modules.

Suggested structure:

/components
  /fields
    NumberField.tsx
    NumberField.module.css

Extract and use a color palette inspired by the attached Google Forms screenshots.

Use colors similar to:

:root {
  --color-primary: #673ab7;
  --color-primary-light: #ede7f6;
  --color-background: #f0ebf8;
  --color-card: #ffffff;
  --color-border: #dadce0;
  --color-text-primary: #202124;
  --color-text-secondary: #5f6368;
  --color-error: #d93025;
}

Use these colors consistently throughout:

* page background
* cards
* buttons
* active states
* borders
* typography
* validation states

The UI should visually resemble the attached Google Forms screenshots while keeping implementation-simple.

⸻

Important Architectural Principles

The app must be:

* schema-driven
* strongly typed
* componentized
* minimal
* maintainable

Validation, rendering, dependency visibility, and calculations must all derive from schema definitions.

Avoid over-engineering.

Keep business logic utilities separated from React components wherever practical.
```

* **What I verified:** I verified that the generated architecture strictly adhered to the constraints outlined in the prompt: React Router was used for the specified routes, state was lifted to the `BuilderPage` without Redux/Context, persistence correctly used `localStorage` with prefix-based stable IDs (`tpl_`, `fld_`), and the styling exclusively used CSS Modules to match the requested Google Forms aesthetic. I also ensured no external drag-and-drop or PDF libraries were introduced.

### 2. Eliminating Magic Strings & Enforcing Type Safety

* **Prompt:** "It's better to give a type to `FIELD_TYPE_OPTIONS` and use constants for values. Check all TSX files for missing types and strings/numbers directly passed to a prop. The values like `'singleLineText'` are used as raw strings across multiple files. Put them in a centralized constant object and use that variable everywhere rather than raw string values."
* **What I verified:** After the AI refactored the files, I verified that `src/constants/index.ts` contained all the necessary UI strings, field types, operators, and actions. I checked `schema.ts` to ensure the TypeScript unions were successfully derived from these constants using `typeof`, ensuring perfect sync between runtime values and compile-time types.
* **What I rejected/changed:** The AI missed a few raw string literals deep inside the `FormRenderer` mapping logic and the `getOperatorsForField` switch statement. I ran searches to locate the remaining raw strings and specifically instructed the AI to replace those remaining literals to ensure 100% compliance.

### 3. The Plugin Architecture Refactoring

* **Prompt:** "Right now, adding another question type requires edits across several core files, which violates the Open-Closed Principle. Instead, let's create a registry-based plugin system utilizing SOLID principles so that adding a new field type requires minimal changes. Each field type should encapsulate its own schema default, Builder UI component, Filler UI component, and validation rules in a single file. The code should dynamically look up field behaviors from this registry rather than relying on hardcoded switch statements."
* **What I verified:** Before proceeding, I verified the proposed `FieldPlugin` interface to ensure it covered all necessities (default state, Builder UI, Filler UI, validation, and operators). I verified that replacing the giant `switch` statements with dynamic registry lookups would actually satisfy the Open-Closed Principle (OCP)—meaning adding a new field would now only require creating one new file and registering it in an index, without touching `FormRenderer.tsx` or `FieldEditorCard.tsx`.
* **What I rejected/changed:** The AI initially offered two options: a Dictionary Map or a full Plugin Registry. I rejected the Dictionary Map because it still required editing multiple central index files, violating the strict zero-edit extensibility goal. I directed the AI to implement the full Plugin Registry.

### 4. Fixing Dynamic Requirement Validation

* **Prompt:** "There is a bug. When a dependency is of 'require' type, then the form is allowed to save even when the required field is empty when filling a response. Fix it and validate the fix using Playwright."
* **What I verified:** I reviewed the modified `validateField` function to ensure it now accepted a dynamic `dynamicRequired` flag passed down from the form's `useMemo` evaluation, rather than relying solely on the static schema property. I also verified the test flow to ensure submission was successfully blocked.

### 5. High-Fidelity PDF Export Styling

* **Prompt:** "The pdf output should have the same styling as the form. But the download pdf button and top navbar should not be included in the pdf. The print media query is stripping away the form header and question section styling. Ensure print styles preserve the card aesthetic."
* **What I verified:** I inspected the updated `@media print` CSS rules in `src/index.css` to ensure they correctly used `display: none !important` for the navigation UI and preserved the background colors and accents of the form cards.
* **What I rejected/changed:** The AI initially tried to achieve the "clean" PDF look by adding `@media print` overrides inside the localized CSS modules (`FillPage.module.css`), which stripped away the padding, borders, and shadows of the cards, ruining the aesthetic. I rejected this localized approach, had the AI undo the commit, and instructed it to centralize the print styling in `src/index.css` to explicitly preserve the card look.
