import React from 'react';
import type { FormField, Dependency, DependencyOperator, DependencyAction, FieldType } from '../../types/schema';
import { Card } from '../common/Card';
import styles from './FieldEditorCard.module.css';

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
                <select
                  value={field.displayType}
                  onChange={(e) => handleChange({ displayType: e.target.value as any })}
                >
                  <option value="radio">Radio</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="tiles">Tiles</option>
                </select>
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
              <select
                value={field.aggregationType}
                onChange={(e) => handleChange({ aggregationType: e.target.value as any })}
              >
                <option value="sum">Sum</option>
                <option value="average">Average</option>
                <option value="minimum">Minimum</option>
                <option value="maximum">Maximum</option>
              </select>
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
          <input
            type="text"
            className={styles.descriptionInput}
            value={field.description || ''}
            onChange={(e) => handleChange({ description: e.target.value })}
            placeholder="Form description"
          />
        </div>
        <select
          className={styles.typeSelect}
          value={field.type}
          onChange={(e) => handleChange({ type: e.target.value as FieldType })}
        >
          <option value="singleLineText">Short answer</option>
          <option value="multiLineText">Paragraph</option>
          <option value="singleSelect">Multiple choice</option>
          <option value="multiSelect">Checkboxes</option>
          <option value="dropdown">Dropdown</option>
          <option value="fileUpload">File upload</option>
          <option value="number">Number</option>
          <option value="date">Date</option>
          <option value="calculation">Calculation</option>
          <option value="sectionHeader">Section Header</option>
        </select>
      </div>

      <div className={styles.content}>
        {renderConfig()}

        <div className={styles.dependenciesSection}>
          <div className={styles.sectionHeader}>
            <h4>Dependencies</h4>
            <button onClick={addDependency} className={styles.addButton}>+ Add Dependency</button>
          </div>
          {field.dependencies?.map((dep, index) => (
            <div key={index} className={styles.dependencyRow}>
              <select
                value={dep.fieldId}
                onChange={(e) => updateDependency(index, { fieldId: e.target.value })}
              >
                {allFields.filter(f => f.id !== field.id).map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              <select
                value={dep.operator}
                onChange={(e) => updateDependency(index, { operator: e.target.value as DependencyOperator })}
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
              </select>
              <input
                type="text"
                value={dep.value}
                onChange={(e) => updateDependency(index, { value: e.target.value })}
                placeholder="Value"
              />
              <select
                value={dep.action}
                onChange={(e) => updateDependency(index, { action: e.target.value as DependencyAction })}
              >
                <option value="show">Show</option>
                <option value="hide">Hide</option>
                <option value="require">Require</option>
                <option value="optional">Optional</option>
              </select>
              <button onClick={() => removeDependency(index)} className={styles.deleteButtonSmall}>×</button>
            </div>
          ))}
        </div>
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
