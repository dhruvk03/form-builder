import React from 'react';
import type { FormField, Dependency, DependencyOperator, DependencyAction, FieldType } from '../../types/schema';
import { Card } from '../common/Card';
import { Select, type Option } from '../common/Select';
import { UI_STRINGS, FILE_EXTENSIONS, FIELD_TYPES, DISPLAY_TYPES, AGGREGATION_TYPES, DEPENDENCY_OPERATORS, DEPENDENCY_ACTIONS } from '../../constants';
import styles from './FieldEditorCard.module.css';

const FIELD_TYPE_OPTIONS: Option[] = Object.values(FIELD_TYPES).map(type => ({
  value: type,
  label: UI_STRINGS.FIELD_TYPE_LABELS[type]
}));

const DISPLAY_TYPE_OPTIONS: Option[] = [
  { value: DISPLAY_TYPES.RADIO, label: 'Radio' },
  { value: DISPLAY_TYPES.DROPDOWN, label: 'Dropdown' },
  { value: DISPLAY_TYPES.TILES, label: 'Tiles' },
];

const AGGREGATION_OPTIONS: Option[] = [
  { value: AGGREGATION_TYPES.SUM, label: 'Sum' },
  { value: AGGREGATION_TYPES.AVERAGE, label: 'Average' },
  { value: AGGREGATION_TYPES.MINIMUM, label: 'Minimum' },
  { value: AGGREGATION_TYPES.MAXIMUM, label: 'Maximum' },
];

const getOperatorsForField = (type?: FieldType): Option[] => {
  switch (type) {
    case FIELD_TYPES.SINGLE_LINE_TEXT:
    case FIELD_TYPES.MULTI_LINE_TEXT:
      return [
        { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
        { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
        { value: DEPENDENCY_OPERATORS.CONTAINS, label: 'Contains' },
      ];
    case FIELD_TYPES.NUMBER:
    case FIELD_TYPES.CALCULATION:
      return [
        { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
        { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
        { value: DEPENDENCY_OPERATORS.GREATER_THAN, label: 'Greater Than' },
        { value: DEPENDENCY_OPERATORS.LESS_THAN, label: 'Less Than' },
        { value: DEPENDENCY_OPERATORS.WITHIN_RANGE, label: 'Within Range' },
      ];
    case FIELD_TYPES.DATE:
      return [
        { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
        { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
        { value: DEPENDENCY_OPERATORS.BEFORE, label: 'Before' },
        { value: DEPENDENCY_OPERATORS.AFTER, label: 'After' },
      ];
    case FIELD_TYPES.SINGLE_SELECT:
      return [
        { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
        { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
      ];
    case FIELD_TYPES.MULTI_SELECT:
      return [
        { value: DEPENDENCY_OPERATORS.CONTAINS_ANY, label: 'Contains' },
        { value: DEPENDENCY_OPERATORS.CONTAINS_ALL, label: 'All selected' },
        { value: DEPENDENCY_OPERATORS.CONTAINS_NONE, label: 'Does not contain' },
      ];
    default:
      return [
        { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
        { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
      ];
  }
};

const ACTION_OPTIONS: Option[] = [
  { value: DEPENDENCY_ACTIONS.SHOW, label: 'Show' },
  { value: DEPENDENCY_ACTIONS.HIDE, label: 'Hide' },
  { value: DEPENDENCY_ACTIONS.REQUIRE, label: 'Require' },
  { value: DEPENDENCY_ACTIONS.OPTIONAL, label: 'Optional' },
];

interface FieldEditorCardProps {
  field: FormField;
  allFields: FormField[];
  onUpdate: (field: FormField) => void;
  onDelete: (id: string) => void;
  active?: boolean;
}

export const FieldEditorCard: React.FC<FieldEditorCardProps> = ({
  field,
  allFields,
  onUpdate,
  onDelete,
  active,
}) => {
  const handleChange = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates } as FormField);
  };

  const getValidationError = (): string | null => {
    switch (field.type) {
      case FIELD_TYPES.SINGLE_LINE_TEXT:
      case FIELD_TYPES.MULTI_LINE_TEXT:
        if (field.minLength !== undefined && field.maxLength !== undefined && field.maxLength < field.minLength) {
          return UI_STRINGS.ERROR_MAX_LENGTH;
        }
        break;
      case FIELD_TYPES.NUMBER:
        if (field.min !== undefined && field.max !== undefined && field.max < field.min) {
          return UI_STRINGS.ERROR_MAX_VALUE;
        }
        break;
      case FIELD_TYPES.DATE:
        if (field.minDate && field.maxDate && new Date(field.maxDate) < new Date(field.minDate)) {
          return UI_STRINGS.ERROR_MAX_DATE;
        }
        break;
      case FIELD_TYPES.MULTI_SELECT:
        if (field.minSelections !== undefined && field.maxSelections !== undefined && field.maxSelections < field.minSelections) {
          return UI_STRINGS.ERROR_MAX_SELECTIONS;
        }
        break;
    }
    return null;
  };

  const validationError = getValidationError();

  const renderConfig = () => {
    switch (field.type) {
      case FIELD_TYPES.SINGLE_LINE_TEXT:
      case FIELD_TYPES.MULTI_LINE_TEXT:
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroup}>
              <label>Placeholder</label>
              <input
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange({ placeholder: e.target.value })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Min Length</label>
              <input
                type="number"
                value={field.minLength ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ minLength: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Max Length</label>
              <input
                type="number"
                value={field.maxLength ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ maxLength: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
              />
            </div>
          </div>
        );

      case FIELD_TYPES.NUMBER:
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroup}>
              <label>Min</label>
              <input
                type="number"
                value={field.min ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ min: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Max</label>
              <input
                type="number"
                value={field.max ?? ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ max: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Decimal Places</label>
              <input
                type="number"
                min="0"
                max="4"
                value={field.decimalPlaces ?? 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ decimalPlaces: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
              />
            </div>
          </div>
        );

      case FIELD_TYPES.DATE:
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroup}>
              <label>Min Date</label>
              <input
                type="date"
                value={field.minDate || ''}
                onChange={(e) => handleChange({ minDate: e.target.value || undefined })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Max Date</label>
              <input
                type="date"
                value={field.maxDate || ''}
                onChange={(e) => handleChange({ maxDate: e.target.value || undefined })}
              />
            </div>
          </div>
        );

      case FIELD_TYPES.SINGLE_SELECT:
      case FIELD_TYPES.MULTI_SELECT: {
        const options = field.options || [];
        return (
          <div className={styles.optionsSection}>
            <label className={styles.configLabel}>Options</label>
            {options.map((option, index) => (
              <div key={index} className={styles.optionRow}>
                <span className={styles.optionIcon}>
                  ●
                </span>
                <input
                  type="text"
                  className={styles.optionInput}
                  value={option}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    handleChange({ options: newOptions });
                  }}
                  placeholder={`${UI_STRINGS.PLACEHOLDER_OPTION} ${index + 1}`}
                />
                {options.length > 1 && (
                  <button 
                    className={styles.removeOption}
                    onClick={() => {
                      const newOptions = options.filter((_, i) => i !== index);
                      handleChange({ options: newOptions });
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button 
              className={styles.addOptionButton}
              onClick={() => handleChange({ options: [...options, ''] })}
            >
              {UI_STRINGS.BUTTON_ADD_OPTION}
            </button>
            
            <div className={styles.configGrid} style={{ marginTop: '16px' }}>
              {field.type === FIELD_TYPES.SINGLE_SELECT && (
                <div className={styles.inputGroup}>
                  <label>Display Type</label>
                  <Select
                    options={DISPLAY_TYPE_OPTIONS}
                    value={field.displayType}
                    onChange={(value) => handleChange({ displayType: value as any })}
                  />
                </div>
              )}
              {field.type === FIELD_TYPES.MULTI_SELECT && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Min Selections</label>
                    <input
                      type="number"
                      min="0"
                      value={field.minSelections ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ minSelections: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Max Selections</label>
                    <input
                      type="number"
                      min="1"
                      value={field.maxSelections ?? ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ maxSelections: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }
      
      case FIELD_TYPES.FILE_UPLOAD: {
        const allowedTypes = field.allowedFileTypes || [];
        
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroup}>
              <label>Max Files</label>
              <input
                type="number"
                min="1"
                value={field.maxFiles ?? 1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ maxFiles: parseInt(e.target.value, 10) || 1 })}
              />
            </div>
            <div className={styles.inputGroupFull}>
              <label>Allowed Extensions</label>
              <div className={styles.checkboxListHorizontal}>
                {FILE_EXTENSIONS.map(ext => (
                  <label key={ext} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={allowedTypes.includes(ext)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const next = e.target.checked
                          ? [...allowedTypes, ext]
                          : allowedTypes.filter(t => t !== ext);
                        handleChange({ allowedFileTypes: next });
                      }}
                    />
                    {ext}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case FIELD_TYPES.CALCULATION: {
        const otherFields = allFields.filter(f => f.id !== field.id && f.type === FIELD_TYPES.NUMBER);
        const sourceFieldIds = field.sourceFieldIds || [];
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroupFull}>
              <label>Source Fields</label>
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
                        handleChange({ sourceFieldIds: newSources });
                      }}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Aggregation</label>
              <Select
                options={AGGREGATION_OPTIONS}
                value={field.aggregationType}
                onChange={(value) => handleChange({ aggregationType: value as any })}
              />
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  const addDependency = () => {
    const newDep: Dependency = {
      fieldId: allFields[0]?.id || '',
      operator: DEPENDENCY_OPERATORS.EQUALS,
      value: '',
      action: DEPENDENCY_ACTIONS.SHOW
    };
    handleChange({ dependencies: [...(field.dependencies || []), newDep] });
  };

  const updateDependency = (index: number, updates: Partial<Dependency>) => {
    const newDeps = [...(field.dependencies || [])];
    newDeps[index] = { ...newDeps[index], ...updates };
    handleChange({ dependencies: newDeps });
  };

  const removeDependency = (index: number) => {
    const newDeps = (field.dependencies || []).filter((_, i) => i !== index);
    handleChange({ dependencies: newDeps });
  };

  return (
    <Card className={styles.card} active={active}>
      <div className={styles.row}>
        <div className={styles.mainInfo}>
          <input
            type="text"
            className={styles.labelInput}
            value={field.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ label: e.target.value })}
            placeholder={UI_STRINGS.PLACEHOLDER_QUESTION}
          />
          {!field.label.trim() && <span className={styles.requiredIndicator}>*</span>}
        </div>
        <Select
          className={styles.typeSelect}
          options={FIELD_TYPE_OPTIONS}
          value={field.type}
          onChange={(value) => {
            const newType = value as FieldType;
            const updates: any = { type: newType };
            
            if ((newType === FIELD_TYPES.SINGLE_SELECT || newType === FIELD_TYPES.MULTI_SELECT) && !('options' in field)) {
              updates.options = [''];
              updates.displayType = DISPLAY_TYPES.RADIO;
            }
            if (newType === FIELD_TYPES.CALCULATION && !('sourceFieldIds' in field)) {
              updates.sourceFieldIds = [];
              updates.aggregationType = AGGREGATION_TYPES.SUM;
            }
            
            handleChange(updates as Partial<FormField>);
          }}
        />
      </div>

      <div className={styles.content}>
        {renderConfig()}
        {validationError && <div className={styles.error}>{validationError}</div>}

        {allFields.length > 1 && (
          <div className={styles.dependenciesSection}>
            <div className={styles.dependenciesDivider} />
            <div className={styles.sectionHeader}>
              <h4>{UI_STRINGS.LABEL_DEPENDENCIES}</h4>
              <button 
                onClick={addDependency} 
                className={styles.addButton}
              >
                {UI_STRINGS.BUTTON_ADD_DEPENDENCY}
              </button>
            </div>
            {field.dependencies?.map((dep, index) => {
              const dependentField = allFields.find(f => f.id === dep.fieldId);
              const operatorOptions = getOperatorsForField(dependentField?.type);
              
              return (
                <div key={index} className={styles.dependencyRow}>
                  <Select
                    size="small"
                    variant="borderless"
                    options={allFields
                      .filter(f => f.id !== field.id)
                      .map(f => ({ value: f.id, label: f.label }))}
                    value={dep.fieldId}
                    onChange={(value) => updateDependency(index, { fieldId: value, operator: DEPENDENCY_OPERATORS.EQUALS, value: '' })}
                  />
                  <Select
                    size="small"
                    variant="borderless"
                    options={operatorOptions}
                    value={dep.operator}
                    onChange={(value) => updateDependency(index, { operator: value as DependencyOperator })}
                  />
                  {dep.operator !== DEPENDENCY_OPERATORS.CONTAINS_ALL && (
                    <>
                      {dependentField && ('options' in dependentField) ? (
                        <Select
                          size="small"
                          variant="borderless"
                          className={styles.dependencyValueInput}
                          options={dependentField.options.map(opt => ({ value: opt, label: opt }))}
                          value={dep.value}
                          onChange={(value) => updateDependency(index, { value })}
                        />
                      ) : (
                        <input
                          type="text"
                          className={styles.dependencyValueInput}
                          value={dep.value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDependency(index, { value: e.target.value })}
                          placeholder={UI_STRINGS.PLACEHOLDER_VALUE}
                        />
                      )}
                    </>
                  )}
                  <Select
                    size="small"
                    variant="borderless"
                    options={ACTION_OPTIONS}
                    value={dep.action}
                    onChange={(value) => updateDependency(index, { action: value as DependencyAction })}
                  />
                  <button onClick={() => removeDependency(index)} className={styles.deleteButtonSmall}>×</button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <label className={styles.requiredToggle}>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange({ required: e.target.checked })}
          />
          {UI_STRINGS.LABEL_REQUIRED}
        </label>
        <button onClick={() => onDelete(field.id)} className={styles.deleteButton}>
          {UI_STRINGS.BUTTON_DELETE_FIELD}
        </button>
      </div>
    </Card>
  );
};