import React from 'react';
import type { FieldPlugin } from '../types';
import type { CalculationField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS, AGGREGATION_TYPES } from '../../constants';
import { Select } from '../../components/common/Select';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

const AGGREGATION_OPTIONS = [
  { value: AGGREGATION_TYPES.SUM, label: 'Sum' },
  { value: AGGREGATION_TYPES.AVERAGE, label: 'Average' },
  { value: AGGREGATION_TYPES.MINIMUM, label: 'Minimum' },
  { value: AGGREGATION_TYPES.MAXIMUM, label: 'Maximum' },
];

export const CalculationPlugin: FieldPlugin<CalculationField> = {
  type: FIELD_TYPES.CALCULATION,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.CALCULATION],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.CALCULATION,
    label: '',
    description: '',
    required: false,
    sourceFieldIds: [],
    aggregationType: AGGREGATION_TYPES.SUM,
  }),

  validateConfig: (field) => {
    if (!field.sourceFieldIds || field.sourceFieldIds.length === 0) {
      return 'At least one source field must be selected for calculation';
    }
    return null;
  },

  validateValue: () => null, // Calculations are derived, not input directly

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
    { value: DEPENDENCY_OPERATORS.GREATER_THAN, label: 'Greater Than' },
    { value: DEPENDENCY_OPERATORS.LESS_THAN, label: 'Less Than' },
    { value: DEPENDENCY_OPERATORS.WITHIN_RANGE, label: 'Within Range' },
  ],

  BuilderConfigComponent: ({ field, allFields, onChange }) => {
    const otherFields = allFields.filter(f => f.id !== field.id && f.type === FIELD_TYPES.NUMBER);
    const sourceFieldIds = field.sourceFieldIds || [];
    
    return (
      <div className={styles.configGrid}>
        <div className={styles.inputGroupFull}>
          <label>Source Fields (Number fields only)</label>
          <div className={styles.checkboxList}>
            {otherFields.map(f => (
              <label key={f.id} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={sourceFieldIds.includes(f.id)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newSources = e.target.checked
                      ? [...sourceFieldIds, f.id]
                      : sourceFieldIds.filter(id => id !== f.id);
                    onChange({ sourceFieldIds: newSources });
                  }}
                />
                {f.label || 'Untitled Field'}
              </label>
            ))}
            {otherFields.length === 0 && (
              <span className={styles.noValue}>Add number fields to the form to use them in calculations.</span>
            )}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Aggregation</label>
          <Select
            options={AGGREGATION_OPTIONS}
            value={field.aggregationType}
            onChange={(value) => onChange({ aggregationType: value as any })}
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
    );
  },

  FillerComponent: ({ field, value, required }) => (
    <div className={rendererStyles.fieldContainer}>
      <label className={rendererStyles.label}>
        {field.label} (Calculated) {required && <span className={rendererStyles.required}>*</span>}
      </label>
      {field.description && <p className={rendererStyles.description}>{field.description}</p>}
      <div className={rendererStyles.calculationValue}>{value ?? 'N/A'}</div>
    </div>
  ),
};