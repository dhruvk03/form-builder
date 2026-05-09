import React from 'react';
import type { FormField } from '../../types/schema';
import { FieldRegistry } from '../../fields';
import styles from './FormRenderer.module.css';

export const FormRenderer: React.FC<{
  fields: FormField[];
  values: Record<string, any>;
  onValueChange: (fieldId: string, value: any) => void;
  errors: Record<string, string>;
  visibleFields: Set<string>;
  requiredFields: Set<string>;
  readOnly?: boolean;
}> = ({ fields, values, onValueChange, errors, visibleFields, requiredFields, readOnly }) => {
  return (
    <div className={styles.formRenderer}>
      {fields.map(field => {
        if (!visibleFields.has(field.id)) return null;

        const plugin = FieldRegistry.getPlugin(field.type);
        if (!plugin) return null;

        const commonProps = {
          field,
          value: values[field.id],
          onChange: (val: any) => onValueChange(field.id, val),
          error: errors[field.id],
          required: requiredFields.has(field.id),
          readOnly
        };

        const FillerComponent = plugin.FillerComponent as React.FC<any>;

        return (
          <div key={field.id} className={styles.fieldWrapper}>
            <FillerComponent {...commonProps} />
          </div>
        );
      })}
    </div>
  );
};
