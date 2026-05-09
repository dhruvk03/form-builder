import React from 'react';
import type { FormField, FieldType } from '../types/schema';
import type { Option } from '../components/common/Select';

export interface FieldPlugin<T extends FormField = FormField> {
  /** The unique type identifier for this field */
  type: FieldType;

  /** The human-readable label shown in the builder dropdown */
  label: string;

  /** Returns the initial default state for a newly created field of this type */
  defaultState: (baseId: string) => T;

  /** The UI rendered when a user is filling out the form */
  FillerComponent: React.FC<{
    field: T;
    value: any;
    onChange: (value: any) => void;
    error?: string;
    required?: boolean;
    readOnly?: boolean;
  }>;

  /** The UI rendered in the builder to configure field-specific settings */
  BuilderConfigComponent: React.FC<{
    field: T;
    allFields: FormField[];
    onChange: (updates: Partial<T>) => void;
  }>;

  /** Validates the user's input during form filling. Returns an error string or null. */
  validateValue?: (field: T, value: any) => string | null;

  /** Validates the field's configuration in the builder. Returns an error string or null. */
  validateConfig?: (field: T) => string | null;

  /** Returns the dependency operators applicable to this field type */
  getOperators: () => Option[];
}