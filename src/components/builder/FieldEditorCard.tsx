import React from 'react';
import type { FormField, Dependency, DependencyOperator, DependencyAction, FieldType } from '../../types/schema';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import styles from './FieldEditorCard.module.css';

const FIELD_TYPE_OPTIONS = [
  { value: 'singleLineText', label: 'Short answer' },
  { value: 'multiLineText', label: 'Paragraph' },
  { value: 'singleSelect', label: 'Multiple choice' },
  { value: 'multiSelect', label: 'Checkboxes' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'fileUpload', label: 'File upload' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'calculation', label: 'Calculation' },
  { value: 'sectionHeader', label: 'Section Header' },
];

const DISPLAY_TYPE_OPTIONS = [
  { value: 'radio', label: 'Radio' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'tiles', label: 'Tiles' },
];

const AGGREGATION_OPTIONS = [
  { value: 'sum', label: 'Sum' },
  { value: 'average', label: 'Average' },
  { value: 'minimum', label: 'Minimum' },
  { value: 'maximum', label: 'Maximum' },
];

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' },
];

const ACTION_OPTIONS = [
  { value: 'show', label: 'Show' },
  { value: 'hide', label: 'Hide' },
  { value: 'require', label: 'Require' },
  { value: 'optional', label: 'Optional' },
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

  const renderConfig = () => {
    switch (field.type) {
      case 'singleLineText':
      case 'multiLineText':
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
                value={field.minLength || ''}
                onChange={(e) => handleChange({ minLength: parseInt(e.target.value) || undefined })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Max Length</label>
              <input
                type="number"
                value={field.maxLength || ''}
                onChange={(e) => handleChange({ maxLength: parseInt(e.target.value) || undefined })}
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroup}>
              <label>Min</label>
              <input
                type="number"
                value={field.min || ''}
                onChange={(e) => handleChange({ min: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Max</label>
              <input
                type="number"
                value={field.max || ''}
                onChange={(e) => handleChange({ max: parseFloat(e.target.value) || undefined })}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Decimal Places</label>
              <input
                type="number"
                min="0"
                max="4"
                value={field.decimalPlaces || 0}
                onChange={(e) => handleChange({ decimalPlaces: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        );

      case 'singleSelect':
      case 'multiSelect':
        return (
          <div className={styles.optionsSection}>
            <label className={styles.configLabel}>Options</label>
            {field.options.map((option, index) => (
              <div key={index} className={styles.optionRow}>
                <span className={styles.optionIcon}>
                  {field.type === 'singleSelect' ? '○' : '□'}
                </span>
                <input
                  type="text"
                  className={styles.optionInput}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...field.options];
                    newOptions[index] = e.target.value;
                    handleChange({ options: newOptions });
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                {field.options.length > 1 && (
                  <button 
                    className={styles.removeOption}
                    onClick={() => {
                      const newOptions = field.options.filter((_, i) => i !== index);
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
              onClick={() => handleChange({ options: [...field.options, `Option ${field.options.length + 1}`] })}
            >
              + Add option
            </button>
            
            {field.type === 'singleSelect' && (
              <div className={styles.inputGroup} style={{ marginTop: '16px' }}>
                <label>Display Type</label>
                <Select
                  options={DISPLAY_TYPE_OPTIONS}
                  value={field.displayType}
                  onChange={(value) => handleChange({ displayType: value as any })}
                />
              </div>
            )}
          </div>
        );
      
      case 'calculation':
        const otherFields = allFields.filter(f => f.id !== field.id && f.type === 'number');
        return (
          <div className={styles.configGrid}>
            <div className={styles.inputGroupFull}>
              <label>Source Fields</label>
              <div className={styles.checkboxList}>
                {otherFields.map(f => (
                  <label key={f.id} className={styles.checkboxItem}>
                    <input
                      type="checkbox"
                      checked={field.sourceFieldIds.includes(f.id)}
                      onChange={(e) => {
                        const newSources = e.target.checked
                          ? [...field.sourceFieldIds, f.id]
                          : field.sourceFieldIds.filter(id => id !== f.id);
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

      default:
        return null;
    }
  };

  const addDependency = () => {
    const newDep: Dependency = {
      fieldId: allFields[0]?.id || '',
      operator: 'equals',
      value: '',
      action: 'show'
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
            onChange={(e) => handleChange({ label: e.target.value })}
            placeholder="Question"
          />
        </div>
        <Select
          className={styles.typeSelect}
          options={FIELD_TYPE_OPTIONS}
          value={field.type}
          onChange={(value) => handleChange({ type: value as FieldType })}
        />
      </div>

      <div className={styles.content}>
        {renderConfig()}

        {allFields.length > 1 && (
          <div className={styles.dependenciesSection}>
            <div className={styles.sectionHeader}>
              <h4>Dependencies</h4>
              <button 
                onClick={addDependency} 
                className={styles.addButton}
              >
                + Add Dependency
              </button>
            </div>
            {field.dependencies?.map((dep, index) => (
              <div key={index} className={styles.dependencyRow}>
                <Select
                  options={allFields
                    .filter(f => f.id !== field.id)
                    .map(f => ({ value: f.id, label: f.label }))}
                  value={dep.fieldId}
                  onChange={(value) => updateDependency(index, { fieldId: value })}
                />
                <Select
                  options={OPERATOR_OPTIONS}
                  value={dep.operator}
                  onChange={(value) => updateDependency(index, { operator: value as DependencyOperator })}
                />
                <input
                  type="text"
                  className={styles.dependencyValueInput}
                  value={dep.value}
                  onChange={(e) => updateDependency(index, { value: e.target.value })}
                  placeholder="Value"
                />
                <Select
                  options={ACTION_OPTIONS}
                  value={dep.action}
                  onChange={(value) => updateDependency(index, { action: value as DependencyAction })}
                />
                <button onClick={() => removeDependency(index)} className={styles.deleteButtonSmall}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <label className={styles.requiredToggle}>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => handleChange({ required: e.target.checked })}
          />
          Required
        </label>
        <button onClick={() => onDelete(field.id)} className={styles.deleteButton}>
          Delete Field
        </button>
      </div>
    </Card>
  );
};
