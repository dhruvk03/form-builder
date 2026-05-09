import React from 'react';
import type { FieldPlugin } from '../types';
import type { DateField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS } from '../../constants';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const DatePlugin: FieldPlugin<DateField> = {
  type: FIELD_TYPES.DATE,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.DATE],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.DATE,
    label: '',
    description: '',
    required: false,
  }),

  validateConfig: (field) => {
    if (field.minDate && field.maxDate && new Date(field.maxDate) < new Date(field.minDate)) {
      return UI_STRINGS.ERROR_MAX_DATE;
    }
    return null;
  },

  validateValue: (field, value) => {
    const isEmpty = value === undefined || value === null || value === '';
    if (isEmpty) return null;
    
    const selectedDate = new Date(value);
    if (isNaN(selectedDate.getTime())) return 'Invalid date';

    if (field.minDate) {
      const min = new Date(field.minDate);
      if (!isNaN(min.getTime()) && selectedDate < min) {
        return `Date must be after ${min.toLocaleDateString()}`;
      }
    }
    if (field.maxDate) {
      const max = new Date(field.maxDate);
      if (!isNaN(max.getTime()) && selectedDate > max) {
        return `Date must be before ${max.toLocaleDateString()}`;
      }
    }
    return null;
  },

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
    { value: DEPENDENCY_OPERATORS.BEFORE, label: 'Before' },
    { value: DEPENDENCY_OPERATORS.AFTER, label: 'After' },
  ],

  BuilderConfigComponent: ({ field, onChange }) => (
    <div className={styles.configGrid}>
      <div className={styles.inputGroup}>
        <label>Min Date</label>
        <input
          type="date"
          value={field.minDate || ''}
          onChange={(e) => onChange({ minDate: e.target.value || undefined })}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Max Date</label>
        <input
          type="date"
          value={field.maxDate || ''}
          onChange={(e) => onChange({ maxDate: e.target.value || undefined })}
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
        type="date"
        className={rendererStyles.input}
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        disabled={readOnly}
      />
      {error && <div className={rendererStyles.error}>{error}</div>}
    </div>
  ),
};