import React from 'react';
import type { FormField, Dependency, DependencyOperator, DependencyAction, FieldType } from '../../types/schema';
import { Card } from '../common/Card';
import { Select, type Option } from '../common/Select';
import { UI_STRINGS, DEPENDENCY_OPERATORS, DEPENDENCY_ACTIONS } from '../../constants';
import { FieldRegistry } from '../../fields';
import styles from './FieldEditorCard.module.css';

const FIELD_TYPE_OPTIONS: Option[] = FieldRegistry.getAllPlugins().map(plugin => ({
  value: plugin.type,
  label: plugin.label
}));

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
  const plugin = FieldRegistry.getPlugin(field.type);
  if (!plugin) return null;

  const handleChange = (updates: Partial<FormField>) => {
    onUpdate({ ...field, ...updates } as FormField);
  };

  const validationError = plugin.validateConfig ? plugin.validateConfig(field) : null;
  const BuilderConfigComponent = plugin.BuilderConfigComponent as React.FC<any>;

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
            const newPlugin = FieldRegistry.getPlugin(newType);
            if (newPlugin) {
              const defaultNewState = newPlugin.defaultState(field.id);
              // Preserve common base fields when switching types
              handleChange({
                ...defaultNewState,
                label: field.label,
                description: field.description,
                required: field.required,
                dependencies: field.dependencies
              } as Partial<FormField>);
            }
          }}
        />
      </div>

      <div className={styles.content}>
        <BuilderConfigComponent field={field} allFields={allFields} onChange={handleChange} />
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
              const dependentPlugin = dependentField ? FieldRegistry.getPlugin(dependentField.type) : null;
              
              // Fallback to basic equals/not equals if plugin somehow missing
              const operatorOptions = dependentPlugin ? dependentPlugin.getOperators() : [
                { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
                { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
              ];
              
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
                          options={(dependentField as any).options.map((opt: string) => ({ value: opt, label: opt }))}
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