import React from 'react';
import type { FieldPlugin } from '../types';
import type { NumberField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS } from '../../constants';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const NumberPlugin: FieldPlugin<NumberField> = {
  type: FIELD_TYPES.NUMBER,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.NUMBER],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.NUMBER,
    label: '',
    description: '',
    required: false,
    decimalPlaces: 0,
  }),

  validateConfig: (field) => {
    if (field.min !== undefined && field.max !== undefined && field.max < field.min) {
      return UI_STRINGS.ERROR_MAX_VALUE;
    }
    return null;
  },

  validateValue: (field, value) => {
    const isEmpty = value === undefined || value === null || value === '';
    
    if (isEmpty) {
      if (field.min !== undefined && field.min !== null && field.min > 0) {
        return `Minimum value is ${field.min}`;
      }
      return null;
    }

    const num = Number(value);
    if (isNaN(num)) return 'Must be a number';
    
    if (field.min !== undefined && field.min !== null && num < field.min) {
      return `Minimum value is ${field.min}`;
    }
    if (field.max !== undefined && field.max !== null && num > field.max) {
      return `Maximum value is ${field.max}`;
    }
    return null;
  },

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
    { value: DEPENDENCY_OPERATORS.GREATER_THAN, label: 'Greater Than' },
    { value: DEPENDENCY_OPERATORS.LESS_THAN, label: 'Less Than' },
    { value: DEPENDENCY_OPERATORS.WITHIN_RANGE, label: 'Within Range' },
  ],

  BuilderConfigComponent: ({ field, onChange }) => (
    <div className={styles.configGrid}>
      <div className={styles.inputGroup}>
        <label>Min</label>
        <input
          type="number"
          value={field.min ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ min: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Max</label>
        <input
          type="number"
          value={field.max ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ max: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Decimal Places</label>
        <input
          type="number"
          min="0"
          max="4"
          value={field.decimalPlaces ?? 0}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ decimalPlaces: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
        />
      </div>
    </div>
  ),

  FillerComponent: ({ field, value, onChange, error, required, readOnly }) => (
    <div className={rendererStyles.fieldContainer}>
      <label className={rendererStyles.label}>
        {field.label} {required && <span className={rendererStyles.required}>*</span>}
      </label>
      {field.description && <p className={rendererStyles.description}>{field.description}</p>}
      <input
        type="number"
        className={rendererStyles.input}
        value={value ?? ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        disabled={readOnly}
      />
      {error && <div className={rendererStyles.error}>{error}</div>}
    </div>
  ),
};