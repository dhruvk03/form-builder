import React from 'react';
import type { FieldPlugin } from '../types';
import type { MultiSelectField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS } from '../../constants';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const MultiSelectPlugin: FieldPlugin<MultiSelectField> = {
  type: FIELD_TYPES.MULTI_SELECT,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.MULTI_SELECT],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.MULTI_SELECT,
    label: '',
    description: '',
    required: false,
    options: [''],
  }),

  validateConfig: (field) => {
    if (!field.options || field.options.length === 0) return 'At least one option is required';
    if (field.options.some(opt => !opt.trim())) return 'Options cannot be empty';
    if (field.minSelections !== undefined && field.maxSelections !== undefined && field.maxSelections < field.minSelections) {
      return UI_STRINGS.ERROR_MAX_SELECTIONS;
    }
    return null;
  },

  validateValue: (field, value) => {
    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    
    if (isEmpty) {
      if (field.minSelections && field.minSelections > 0) {
        return `Select at least ${field.minSelections} options`;
      }
      return null;
    }
    if (field.minSelections && Array.isArray(value) && value.length < field.minSelections) {
      return `Select at least ${field.minSelections} options`;
    }
    if (field.maxSelections && Array.isArray(value) && value.length > field.maxSelections) {
      return `Select no more than ${field.maxSelections} options`;
    }
    return null;
  },

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.CONTAINS_ANY, label: 'Contains' },
    { value: DEPENDENCY_OPERATORS.CONTAINS_ALL, label: 'All selected' },
    { value: DEPENDENCY_OPERATORS.CONTAINS_NONE, label: 'Does not contain' },
  ],

  BuilderConfigComponent: ({ field, onChange }) => {
    const options = field.options || [];
    return (
      <div className={styles.optionsSection}>
        <label className={styles.configLabel}>Options</label>
        {options.map((option, index) => (
          <div key={index} className={styles.optionRow}>
            <span className={styles.optionIcon}>●</span>
            <input
              type="text"
              className={styles.optionInput}
              value={option}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                onChange({ options: newOptions });
              }}
              placeholder={`${UI_STRINGS.PLACEHOLDER_OPTION} ${index + 1}`}
            />
            {options.length > 1 && (
              <button 
                className={styles.removeOption}
                onClick={() => {
                  const newOptions = options.filter((_, i) => i !== index);
                  onChange({ options: newOptions });
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button 
          className={styles.addOptionButton}
          onClick={() => onChange({ options: [...options, ''] })}
        >
          {UI_STRINGS.BUTTON_ADD_OPTION}
        </button>
        
        <div className={styles.configGrid} style={{ marginTop: '16px' }}>
          <div className={styles.inputGroup}>
            <label>Min Selections</label>
            <input
              type="number"
              min="0"
              value={field.minSelections ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ minSelections: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Max Selections</label>
            <input
              type="number"
              min="1"
              value={field.maxSelections ?? ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ maxSelections: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
            />
          </div>
        </div>
      </div>
    );
  },

  FillerComponent: ({ field, value, onChange, error, required, readOnly }) => (
    <div className={rendererStyles.fieldContainer}>
      <label className={rendererStyles.label}>
        {field.label} {required && <span className={rendererStyles.required}>*</span>}
      </label>
      {field.description && <p className={rendererStyles.description}>{field.description}</p>}
      <div className={rendererStyles.optionList}>
        {field.options.map(opt => (
          <label key={opt} className={rendererStyles.optionItem}>
            <div className={rendererStyles.inputWrapper}>
              <input
                type="checkbox"
                name={field.id}
                checked={(value || []).includes(opt)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const current = value || [];
                  const next = e.target.checked 
                    ? [...current, opt] 
                    : current.filter((v: string) => v !== opt);
                  onChange(next);
                }}
                disabled={readOnly}
                className={rendererStyles.hiddenInput}
              />
              <span className={rendererStyles.customCheckbox}></span>
            </div>
            {opt}
          </label>
        ))}
      </div>
      {error && <div className={rendererStyles.error}>{error}</div>}
    </div>
  ),
};