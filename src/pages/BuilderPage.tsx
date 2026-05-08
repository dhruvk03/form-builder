import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormField, FieldType } from '../types/schema';
import { loadTemplates, addTemplate } from '../utils/storage';
import { generateId } from '../utils/id';
import { Card } from '../components/common/Card';
import { FieldEditorCard } from '../components/builder/FieldEditorCard';
import styles from './BuilderPage.module.css';

import { Select } from '../components/common/Select';

const FIELD_TYPE_OPTIONS = [
  { value: 'singleLineText', label: 'Short Text' },
  { value: 'multiLineText', label: 'Long Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'singleSelect', label: 'Multiple Choice (Radio)' },
  { value: 'multiSelect', label: 'Checkboxes' },
  { value: 'fileUpload', label: 'File Upload' },
  { value: 'sectionHeader', label: 'Section Header' },
  { value: 'calculation', label: 'Calculation' },
];

export const BuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<FormTemplate>({
    id: id || generateId('tpl'),
    title: '',
    description: '',
    fields: [],
  });
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [isTitleActive, setIsTitleActive] = useState(false);

  // Derived validation state
  const isTitleValid = template.title.trim().length > 0;

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({ ...prev, description: e.target.value }));
  };

  const addField = (type: FieldType) => {
    const newId = generateId('fld');
    const newField: FormField = {
      id: newId,
      type,
      label: '',
      description: '',
      required: false,
      ...(type === 'singleSelect' || type === 'multiSelect' ? { options: [''], displayType: 'radio' } : {}),
      ...(type === 'calculation' ? { sourceFieldIds: [], aggregationType: 'sum' } : {}),
    } as any;

    setTemplate((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
    setActiveFieldId(newId);
    setIsTitleActive(false);
  };

  const updateField = (updatedField: FormField) => {
    setTemplate((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === updatedField.id ? updatedField : f)),
    }));
  };

  const deleteField = (fieldId: string) => {
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
    if (activeFieldId === fieldId) setActiveFieldId(null);
  };

  const handleSave = () => {
    addTemplate(template);
    navigate('/');
  };

  return (
    <div className="layout-container">
      <main className={styles.main}>
        <div className={styles.toolBar}>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
          >
            Save Template
          </button>
        </div>

        <Card 
          className={styles.titleCard} 
          active={isTitleActive}
          onClick={() => {
            setIsTitleActive(true);
            setActiveFieldId(null);
          }}
        >
          <div className={styles.titleAccent} />
          <div className={styles.titleInfo}>
            <div className={styles.titleInputWrapper}>
              <input
                type="text"
                className={styles.titleInput}
                value={template.title}
                onChange={handleTitleChange}
                placeholder="Form title"
                onFocus={() => {
                  setIsTitleActive(true);
                  setActiveFieldId(null);
                }}
              />
              {!isTitleValid && <span className={styles.requiredIndicator}>*</span>}
            </div>
            <input
              type="text"
              className={styles.descriptionInput}
              value={template.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Form description"
              onFocus={() => {
                setIsTitleActive(true);
                setActiveFieldId(null);
              }}
            />
          </div>
        </Card>

        <div className={styles.fieldList}>
          {template.fields.map((field) => (
            <div 
              key={field.id} 
              onClick={() => {
                setActiveFieldId(field.id);
                setIsTitleActive(false);
              }}
            >
              <FieldEditorCard
                field={field}
                allFields={template.fields}
                onUpdate={updateField}
                onDelete={deleteField}
                active={activeFieldId === field.id}
              />
            </div>
          ))}
        </div>

        <div className={styles.addFieldContainer}>
          <p className={styles.addFieldLabel}>Add New Question</p>
          <Select
            className={styles.typeSelectLarge}
            options={FIELD_TYPE_OPTIONS}
            value=""
            onChange={(value) => addField(value as FieldType)}
            placeholder="Select field type..."
          />
        </div>
      </main>
    </div>
  );
};
