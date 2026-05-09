import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormField, FieldType } from '../types/schema';
import { loadTemplates, addTemplate } from '../utils/storage';
import { generateId } from '../utils/id';
import { Card } from '../components/common/Card';
import { FieldEditorCard } from '../components/builder/FieldEditorCard';
import { Select, type Option } from '../components/common/Select';
import { UI_STRINGS, CONFIG } from '../constants';
import styles from './BuilderPage.module.css';

const FIELD_TYPE_OPTIONS: Option[] = [
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
    id: id || generateId(CONFIG.TEMPLATE_ID_PREFIX),
    title: '',
    description: '',
    fields: [],
  });
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [isTitleActive, setIsTitleActive] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Derived validation state
  const isTitleValid = template.title.trim().length > 0;

  const validateTemplate = (): boolean => {
    if (!isTitleValid) return false;
    
    for (const field of template.fields) {
      if (!field.label.trim()) return false;
      
      if (field.type === 'singleSelect' || field.type === 'multiSelect') {
        if (!field.options || field.options.length === 0) return false;
        if (field.options.some(opt => !opt.trim())) return false;
      }
      
      if (field.type === 'calculation') {
        if (!field.sourceFieldIds || field.sourceFieldIds.length === 0) return false;
      }
    }
    
    return true;
  };

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
    if (saveError) setSaveError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({ ...prev, description: e.target.value }));
  };

  const addField = (type: FieldType) => {
    const newId = generateId(CONFIG.FIELD_ID_PREFIX);
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
    if (saveError) setSaveError(null);
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
    console.log('Save clicked');
    if (!validateTemplate()) {
      setSaveError(UI_STRINGS.SAVE_ERROR_REQUIRED);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    addTemplate(template);
    navigate('/');
  };

  return (
    <div className="layout-container">
      <main className={styles.main}>
        <div className={styles.toolBar}>
          {saveError && <div className={styles.saveErrorMessage}>{saveError}</div>}
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
                placeholder={UI_STRINGS.FORM_TITLE_PLACEHOLDER}
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
              placeholder={UI_STRINGS.FORM_DESCRIPTION_PLACEHOLDER}
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
          <p className={styles.addFieldLabel}>{UI_STRINGS.ADD_NEW_QUESTION}</p>
          <Select
            className={styles.typeSelectLarge}
            options={FIELD_TYPE_OPTIONS}
            value=""
            onChange={(value) => addField(value as FieldType)}
            placeholder={UI_STRINGS.SELECT_TYPE_PLACEHOLDER}
          />
        </div>
      </main>
    </div>
  );
};