import React from 'react';
import type { FieldPlugin } from '../types';
import type { SingleLineTextField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS } from '../../constants';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const SingleLineTextPlugin: FieldPlugin<SingleLineTextField> = {
  type: FIELD_TYPES.SINGLE_LINE_TEXT,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.SINGLE_LINE_TEXT],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.SINGLE_LINE_TEXT,
    label: '',
    description: '',
    required: false,
  }),

  validateConfig: (field) => {
    if (field.minLength !== undefined && field.maxLength !== undefined && field.maxLength < field.minLength) {
      return UI_STRINGS.ERROR_MAX_LENGTH;
    }
    return null;
  },

  validateValue: (field, value) => {
    const currentLength = String(value || '').length;
    if (field.minLength !== undefined && field.minLength !== null && currentLength < field.minLength) {
      return `Minimum length is ${field.minLength} characters`;
    }
    if (field.maxLength !== undefined && field.maxLength !== null && currentLength > field.maxLength) {
      return `Maximum length is ${field.maxLength} characters`;
    }
    return null;
  },

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
    { value: DEPENDENCY_OPERATORS.CONTAINS, label: 'Contains' },
  ],

  BuilderConfigComponent: ({ field, onChange }) => (
    <div className={styles.configGrid}>
      <div className={styles.inputGroup}>
        <label>Placeholder</label>
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => onChange({ placeholder: e.target.value })}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Min Length</label>
        <input
          type="number"
          value={field.minLength ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ minLength: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
        />
      </div>
      <div className={styles.inputGroup}>
        <label>Max Length</label>
        <input
          type="number"
          value={field.maxLength ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ maxLength: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
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
        className={rendererStyles.input}
        value={value || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={readOnly ? '' : field.placeholder}
        disabled={readOnly}
      />
      {error && <div className={rendererStyles.error}>{error}</div>}
    </div>
  ),
};