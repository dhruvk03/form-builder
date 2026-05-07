import React from 'react';
import type { FormField } from '../../types/schema';
import styles from './FormRenderer.module.css';

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  readOnly?: boolean;
}

const TextInput: React.FC<FieldRendererProps> = ({ field, value, onChange, error, required, readOnly }) => {
  if (field.type !== 'singleLineText' && field.type !== 'multiLineText') return null;
  
  const InputComponent = field.type === 'singleLineText' ? 'input' : 'textarea';
  
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {field.label} {required && <span className={styles.required}>*</span>}
      </label>
      <InputComponent
        className={styles.input}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={readOnly}
        rows={field.type === 'multiLineText' ? field.rows || 3 : undefined}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const NumberInput: React.FC<FieldRendererProps> = ({ field, value, onChange, error, required, readOnly }) => {
  if (field.type !== 'number') return null;
  
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {field.label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="number"
        className={styles.input}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        disabled={readOnly}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const SelectInput: React.FC<FieldRendererProps> = ({ field, value, onChange, error, required, readOnly }) => {
  if (field.type !== 'singleSelect' && field.type !== 'multiSelect') return null;

  if (field.type === 'singleSelect' && field.displayType === 'dropdown') {
    return (
      <div className={styles.fieldContainer}>
        <label className={styles.label}>
          {field.label} {required && <span className={styles.required}>*</span>}
        </label>
        <select
          className={styles.select}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
        >
          <option value="">Select an option</option>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {field.label} {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.optionList}>
        {field.options.map(opt => (
          <label key={opt} className={styles.optionItem}>
            <input
              type={field.type === 'singleSelect' ? 'radio' : 'checkbox'}
              name={field.id}
              checked={field.type === 'singleSelect' ? value === opt : (value || []).includes(opt)}
              onChange={(e) => {
                if (field.type === 'singleSelect') {
                  onChange(opt);
                } else {
                  const current = value || [];
                  const next = e.target.checked 
                    ? [...current, opt] 
                    : current.filter((v: string) => v !== opt);
                  onChange(next);
                }
              }}
              disabled={readOnly}
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const DateInput: React.FC<FieldRendererProps> = ({ field, value, onChange, error, required, readOnly }) => {
  if (field.type !== 'date') return null;
  
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {field.label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="date"
        className={styles.input}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={readOnly}
      />
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const FileUpload: React.FC<FieldRendererProps> = ({ field, value, onChange, error, required, readOnly }) => {
  if (field.type !== 'fileUpload') return null;
  
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>
        {field.label} {required && <span className={styles.required}>*</span>}
      </label>
      {readOnly ? (
        <div className={styles.fileList}>
          {(value || []).map((f: any, i: number) => (
            <div key={i} className={styles.fileItem}>{f.name}</div>
          ))}
          {(value || []).length === 0 && <p className={styles.noValue}>No files uploaded</p>}
        </div>
      ) : (
        <input
          type="file"
          multiple={field.maxFiles ? field.maxFiles > 1 : true}
          onChange={(e) => {
            const files = Array.from(e.target.files || []).map(f => ({
              name: f.name,
              size: f.size,
              type: f.type
            }));
            onChange(files);
          }}
        />
      )}
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

const SectionHeader: React.FC<{ field: FormField }> = ({ field }) => {
  if (field.type !== 'sectionHeader') return null;
  return (
    <div className={styles.sectionHeader}>
      <h3 className={styles.sectionTitle}>{field.label}</h3>
    </div>
  );
};

const CalculationDisplay: React.FC<FieldRendererProps> = ({ field, value }) => {
  if (field.type !== 'calculation') return null;
  return (
    <div className={styles.fieldContainer}>
      <label className={styles.label}>{field.label} (Calculated)</label>
      <div className={styles.calculationValue}>{value ?? 'N/A'}</div>
    </div>
  );
};

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

        const commonProps = {
          field,
          value: values[field.id],
          onChange: (val: any) => onValueChange(field.id, val),
          error: errors[field.id],
          required: requiredFields.has(field.id),
          readOnly
        };

        return (
          <div key={field.id} className={styles.fieldWrapper}>
            {field.type === 'sectionHeader' ? (
              <SectionHeader field={field} />
            ) : field.type === 'calculation' ? (
              <CalculationDisplay {...commonProps} />
            ) : field.type === 'singleLineText' || field.type === 'multiLineText' ? (
              <TextInput {...commonProps} />
            ) : field.type === 'number' ? (
              <NumberInput {...commonProps} />
            ) : field.type === 'date' ? (
              <DateInput {...commonProps} />
            ) : field.type === 'singleSelect' || field.type === 'multiSelect' ? (
              <SelectInput {...commonProps} />
            ) : field.type === 'fileUpload' ? (
              <FileUpload {...commonProps} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
