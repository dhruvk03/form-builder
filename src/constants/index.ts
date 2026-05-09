export const FIELD_TYPES = {
  SINGLE_LINE_TEXT: 'singleLineText',
  MULTI_LINE_TEXT: 'multiLineText',
  NUMBER: 'number',
  DATE: 'date',
  SINGLE_SELECT: 'singleSelect',
  MULTI_SELECT: 'multiSelect',
  FILE_UPLOAD: 'fileUpload',
  SECTION_HEADER: 'sectionHeader',
  CALCULATION: 'calculation',
} as const;

export const DEPENDENCY_OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  CONTAINS: 'contains',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  WITHIN_RANGE: 'withinRange',
  CONTAINS_ANY: 'containsAny',
  CONTAINS_ALL: 'containsAll',
  CONTAINS_NONE: 'containsNone',
  BEFORE: 'before',
  AFTER: 'after',
} as const;

export const DEPENDENCY_ACTIONS = {
  SHOW: 'show',
  HIDE: 'hide',
  REQUIRE: 'require',
  OPTIONAL: 'optional',
} as const;

export const DISPLAY_TYPES = {
  RADIO: 'radio',
  DROPDOWN: 'dropdown',
  TILES: 'tiles',
} as const;

export const AGGREGATION_TYPES = {
  SUM: 'sum',
  AVERAGE: 'average',
  MINIMUM: 'minimum',
  MAXIMUM: 'maximum',
} as const;

export const UI_STRINGS = {
  FIELD_TYPE_LABELS: {
    [FIELD_TYPES.SINGLE_LINE_TEXT]: 'Short Text',
    [FIELD_TYPES.MULTI_LINE_TEXT]: 'Long Text',
    [FIELD_TYPES.NUMBER]: 'Number',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.SINGLE_SELECT]: 'Multiple Choice (Radio)',
    [FIELD_TYPES.MULTI_SELECT]: 'Checkboxes',
    [FIELD_TYPES.FILE_UPLOAD]: 'File Upload',
    [FIELD_TYPES.SECTION_HEADER]: 'Section Header',
    [FIELD_TYPES.CALCULATION]: 'Calculation',
  },
  SELECT_TYPE_PLACEHOLDER: 'Select field type...',
  SAVE_ERROR_REQUIRED: 'Please fill all required fields',
  FORM_TITLE_PLACEHOLDER: 'Form title',
  FORM_DESCRIPTION_PLACEHOLDER: 'Form description',
  ADD_NEW_QUESTION: 'Add New Question',
  PLACEHOLDER_QUESTION: 'Question',
  PLACEHOLDER_OPTION: 'Option',
  PLACEHOLDER_VALUE: 'Value',
  LABEL_DEPENDENCIES: 'Dependencies',
  BUTTON_ADD_DEPENDENCY: '+ Add Dependency',
  BUTTON_ADD_OPTION: '+ Add option',
  LABEL_REQUIRED: 'Required',
  BUTTON_DELETE_FIELD: 'Delete Field',
  ERROR_MAX_LENGTH: 'Max length cannot be less than min length',
  ERROR_MAX_VALUE: 'Max value cannot be less than min value',
  ERROR_MAX_DATE: 'Max date cannot be before min date',
  ERROR_MAX_SELECTIONS: 'Max selections cannot be less than min selections',
  LOADING: 'Loading...',
  DOWNLOAD_PDF: 'Download PDF',
  SUBMITTED_ON: 'Submitted on',
  SUBMIT: 'Submit',
  NO_TEMPLATES: 'No templates created yet.',
  NEW_TEMPLATE: ' + New Template',
  EDIT_TEMPLATE: 'Edit Template',
  NEW_RESPONSE: 'New Response',
  NO_RESPONSES: 'No responses yet.',
  RESPONSES_LABEL: 'Responses:',
  VIEW: 'View',
  FILL: 'Fill',
  PDF: 'PDF',
  DELETE_TEMPLATE_CONFIRM: (title: string) => `Are you sure you want to delete the template "${title}"? This will also delete all its responses.`,
} as const;

export const CONFIG = {
  TEMPLATE_ID_PREFIX: 'tpl' as const,
  FIELD_ID_PREFIX: 'fld' as const,
  RESPONSE_ID_PREFIX: 'res' as const,
  DEFAULT_ROWS: 3,
  PRINT_DELAY: 500,
  TITLE_RESTORE_DELAY: 100,
  DEFAULT_DECIMAL_PLACES: 0,
} as const;

export const FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.jpg', '.png', '.zip', '.xlsx'] as const;
