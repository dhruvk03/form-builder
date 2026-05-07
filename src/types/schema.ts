export type FieldType =
  | 'singleLineText'
  | 'multiLineText'
  | 'number'
  | 'date'
  | 'singleSelect'
  | 'multiSelect'
  | 'fileUpload'
  | 'sectionHeader'
  | 'calculation';

export type DependencyOperator =
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
  | 'after';

export type DependencyAction = 'show' | 'hide' | 'require' | 'optional';

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
  type: 'singleLineText';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  prefix?: string;
  suffix?: string;
}

export interface MultiLineTextField extends BaseField {
  type: 'multiLineText';
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
}

export interface NumberField extends BaseField {
  type: 'number';
  min?: number;
  max?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export interface DateField extends BaseField {
  type: 'date';
  prefillToday?: boolean;
  minDate?: string;
  maxDate?: string;
}

export type SingleSelectDisplayType = 'radio' | 'dropdown' | 'tiles';

export interface SingleSelectField extends BaseField {
  type: 'singleSelect';
  options: string[];
  displayType: SingleSelectDisplayType;
}

export interface MultiSelectField extends BaseField {
  type: 'multiSelect';
  options: string[];
  minSelections?: number;
  maxSelections?: number;
}

export interface FileUploadField extends BaseField {
  type: 'fileUpload';
  allowedFileTypes?: string[];
  maxFiles?: number;
}

export interface SectionHeaderField extends BaseField {
  type: 'sectionHeader';
}

export type AggregationType = 'sum' | 'average' | 'minimum' | 'maximum';

export interface CalculationField extends BaseField {
  type: 'calculation';
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
