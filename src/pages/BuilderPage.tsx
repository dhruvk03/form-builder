import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormField, FieldType } from '../types/schema';
import { loadTemplates, addTemplate } from '../utils/storage';
import { generateId } from '../utils/id';
import { detectCycles } from '../utils/dependency';
import { Card } from '../components/common/Card';
import { FieldEditorCard } from '../components/builder/FieldEditorCard';
import styles from './BuilderPage.module.css';

export const BuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<FormTemplate>({
    id: id || generateId('tpl'),
    title: 'Untitled Form',
    fields: [],
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const templates = loadTemplates();
      const existing = templates.find((t) => t.id === id);
      if (existing) {
        setTemplate(existing);
      }
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({ ...prev, title: e.target.value }));
  };

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: generateId('fld'),
      type,
      label: `Question ${template.fields.length + 1}`,
      required: false,
      ...(type === 'singleSelect' || type === 'multiSelect' ? { options: ['Option 1'], displayType: 'radio' } : {}),
      ...(type === 'calculation' ? { sourceFieldIds: [], aggregationType: 'sum' } : {}),
    } as any;

    setTemplate((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (updatedField: FormField) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === updatedField.id ? updatedField : f)),
    }));
  };

  const deleteField = (fieldId: string) => {
    // Check if other fields depend on this one
    const dependentFields = template.fields.filter((f) => {
      const hasDep = f.dependencies?.some((d) => d.fieldId === fieldId);
      const isSource = f.type === 'calculation' && f.sourceFieldIds.includes(fieldId);
      return hasDep || isSource;
    });

    if (dependentFields.length > 0) {
      alert(`Cannot delete field. It is referenced by: ${dependentFields.map(f => f.label).join(', ')}`);
      return;
    }

    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
  };

  const handleSave = () => {
    if (!template.title.trim()) {
      setSaveError('Form title is required');
      return;
    }

    if (template.fields.length === 0) {
      setSaveError('At least one field is required');
      return;
    }

    const cycleError = detectCycles(template.fields);
    if (cycleError) {
      setSaveError(cycleError);
      return;
    }

    addTemplate(template);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={() => navigate('/')}>
            ← Back
          </button>
          <div className={styles.headerActions}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save Template
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Card className={styles.titleCard}>
          <input
            type="text"
            className={styles.titleInput}
            value={template.title}
            onChange={handleTitleChange}
            placeholder="Form Title"
          />
          <div className={styles.titleAccent} />
        </Card>

        <div className={styles.fieldList}>
          {template.fields.map((field) => (
            <FieldEditorCard
              key={field.id}
              field={field}
              allFields={template.fields}
              onUpdate={updateField}
              onDelete={deleteField}
            />
          ))}
        </div>

        {saveError && <div className={styles.errorBanner}>{saveError}</div>}

        <div className={styles.addFieldContainer}>
          <p className={styles.addFieldLabel}>Add Field:</p>
          <div className={styles.buttonGrid}>
            <button onClick={() => addField('singleLineText')}>Short Text</button>
            <button onClick={() => addField('multiLineText')}>Long Text</button>
            <button onClick={() => addField('number')}>Number</button>
            <button onClick={() => addField('date')}>Date</button>
            <button onClick={() => addField('singleSelect')}>Single Select</button>
            <button onClick={() => addField('multiSelect')}>Multi Select</button>
            <button onClick={() => addField('fileUpload')}>File Upload</button>
            <button onClick={() => addField('sectionHeader')}>Section Header</button>
            <button onClick={() => addField('calculation')}>Calculation</button>
          </div>
        </div>
      </main>
    </div>
  );
};
