import React from 'react';
import type { FieldPlugin } from '../types';
import type { SingleSelectField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS, DISPLAY_TYPES } from '../../constants';
import { Select } from '../../components/common/Select';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

const DISPLAY_TYPE_OPTIONS = [
  { value: DISPLAY_TYPES.RADIO, label: 'Radio' },
  { value: DISPLAY_TYPES.DROPDOWN, label: 'Dropdown' },
  { value: DISPLAY_TYPES.TILES, label: 'Tiles' },
];

export const SingleSelectPlugin: FieldPlugin<SingleSelectField> = {
  type: FIELD_TYPES.SINGLE_SELECT,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.SINGLE_SELECT],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.SINGLE_SELECT,
    label: '',
    description: '',
    required: false,
    options: [''],
    displayType: DISPLAY_TYPES.RADIO,
  }),

  validateConfig: (field) => {
    if (!field.options || field.options.length === 0) return 'At least one option is required';
    if (field.options.some(opt => !opt.trim())) return 'Options cannot be empty';
    return null;
  },

  validateValue: () => null, // Required check is handled centrally

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
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
            <label>Display Type</label>
            <Select
              options={DISPLAY_TYPE_OPTIONS}
              value={field.displayType}
              onChange={(value) => onChange({ displayType: value as any })}
            />
          </div>
        </div>
      </div>
    );
  },

  FillerComponent: ({ field, value, onChange, error, required, readOnly }) => {
    if (field.displayType === DISPLAY_TYPES.DROPDOWN) {
      return (
        <div className={rendererStyles.fieldContainer}>
          <label className={rendererStyles.label}>
            {field.label} {required && <span className={rendererStyles.required}>*</span>}
          </label>
          {field.description && <p className={rendererStyles.description}>{field.description}</p>}
          <select
            className={rendererStyles.select}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
            disabled={readOnly}
          >
            <option value="">Select an option</option>
            {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {error && <div className={rendererStyles.error}>{error}</div>}
        </div>
      );
    }

    return (
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
                  type={DISPLAY_TYPES.RADIO}
                  name={field.id}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  disabled={readOnly}
                  className={rendererStyles.hiddenInput}
                />
                <span className={rendererStyles.customRadio}></span>
              </div>
              {opt}
            </label>
          ))}
        </div>
        {error && <div className={rendererStyles.error}>{error}</div>}
      </div>
    );
  },
};