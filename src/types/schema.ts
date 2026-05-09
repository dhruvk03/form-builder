import { FIELD_TYPES, DEPENDENCY_OPERATORS, DEPENDENCY_ACTIONS, DISPLAY_TYPES, AGGREGATION_TYPES } from '../constants';

export type FieldType = typeof FIELD_TYPES[keyof typeof FIELD_TYPES];

export type DependencyOperator = typeof DEPENDENCY_OPERATORS[keyof typeof DEPENDENCY_OPERATORS];

export type DependencyAction = typeof DEPENDENCY_ACTIONS[keyof typeof DEPENDENCY_ACTIONS];

export interface Dependency {
  fieldId: string;
  operator: DependencyOperator;
  value: any;
  action: DependencyAction;
}

export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  dependencies?: Dependency[];
}

export interface SingleLineTextField extends BaseField {
  type: typeof FIELD_TYPES.SINGLE_LINE_TEXT;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  prefix?: string;
  suffix?: string;
}

export interface MultiLineTextField extends BaseField {
  type: typeof FIELD_TYPES.MULTI_LINE_TEXT;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export interface NumberField extends BaseField {
  type: typeof FIELD_TYPES.NUMBER;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export interface DateField extends BaseField {
  type: typeof FIELD_TYPES.DATE;
  prefillToday?: boolean;
  minDate?: string;
  maxDate?: string;
}

export type SingleSelectDisplayType = typeof DISPLAY_TYPES[keyof typeof DISPLAY_TYPES];

export interface SingleSelectField extends BaseField {
  type: typeof FIELD_TYPES.SINGLE_SELECT;
  options: string[];
  displayType: SingleSelectDisplayType;
}

export interface MultiSelectField extends BaseField {
  type: typeof FIELD_TYPES.MULTI_SELECT;
  options: string[];
  minSelections?: number;
  maxSelections?: number;
}

export interface FileUploadField extends BaseField {
  type: typeof FIELD_TYPES.FILE_UPLOAD;
  allowedFileTypes?: string[];
  maxFiles?: number;
}

export interface SectionHeaderField extends BaseField {
  type: typeof FIELD_TYPES.SECTION_HEADER;
}

export type AggregationType = typeof AGGREGATION_TYPES[keyof typeof AGGREGATION_TYPES];

export interface CalculationField extends BaseField {
  type: typeof FIELD_TYPES.CALCULATION;
  sourceFieldIds: string[];
  aggregationType: AggregationType;
  decimalPlaces?: number;
}

export type FormField =
  | SingleLineTextField
  | MultiLineTextField
  | NumberField
  | DateField
  | SingleSelectField
  | MultiSelectField
  | FileUploadField
  | SectionHeaderField
  | CalculationField;

export interface FormTemplate {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface FormResponse {
  id: string;
  templateId: string;
  submittedAt: string;
  values: Record<string, any>;
}
