import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormResponse } from '../types/schema';
import { loadTemplates, loadResponses, addResponse } from '../utils/storage';
import { generateId } from '../utils/id';
import { validateField } from '../utils/validation';
import { evaluateFieldState } from '../utils/dependency';
import { FormRenderer } from '../components/fill/FormRenderer';
import { Card } from '../components/common/Card';
import styles from './FillPage.module.css';

export const FillPage: React.FC = () => {
  const { templateId, responseId } = useParams<{ templateId: string; responseId?: string }>();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === 'true' && template && isReadOnly) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [template, isReadOnly]);

  useEffect(() => {
    const templates = loadTemplates();
    const foundTemplate = templates.find(t => t.id === templateId);
    if (!foundTemplate) {
      navigate('/');
      return;
    }
    setTemplate(foundTemplate);

    if (responseId) {
      const responses = loadResponses();
      const foundResponse = responses.find(r => r.id === responseId);
      if (foundResponse) {
        setValues(foundResponse.values);
        setIsReadOnly(true);
        setSubmittedAt(foundResponse.submittedAt);
      }
    }
  }, [templateId, responseId, navigate]);

  const { visibleFields, requiredFields, calculatedValues } = useMemo(() => {
    if (!template) return { visibleFields: new Set<string>(), requiredFields: new Set<string>(), calculatedValues: {} as Record<string, number> };

    const visible = new Set<string>();
    const required = new Set<string>();
    const calculated: Record<string, number> = {};

    // First pass: dependencies and simple visibility
    template.fields.forEach(field => {
      const { visible: isVisible, required: isReq } = evaluateFieldState(field, values);
      if (isVisible) {
        visible.add(field.id);
        if (isReq) required.add(field.id);
      }
    });

    // Second pass: calculations
    template.fields.forEach(field => {
      if (field.type === 'calculation' && visible.has(field.id)) {
        const sourceValues = field.sourceFieldIds
          .filter(id => visible.has(id))
          .map(id => Number(values[id]))
          .filter(val => !isNaN(val));

        if (sourceValues.length > 0) {
          let result = 0;
          switch (field.aggregationType) {
            case 'sum': result = sourceValues.reduce((a, b) => a + b, 0); break;
            case 'average': result = sourceValues.reduce((a, b) => a + b, 0) / sourceValues.length; break;
            case 'minimum': result = Math.min(...sourceValues); break;
            case 'maximum': result = Math.max(...sourceValues); break;
          }
          calculated[field.id] = Number(result.toFixed(field.decimalPlaces || 0));
        }
      }
    });

    return { visibleFields: visible, requiredFields: required, calculatedValues: calculated };
  }, [template, values]);

  const handleValueChange = (fieldId: string, value: any) => {
    if (isReadOnly) return;
    
    setValues(prev => {
      const next = { ...prev, [fieldId]: value };
      
      // Clean up values for fields that might become hidden
      // (This is a simplified approach, in a real app we might do this more carefully)
      return next;
    });

    // Clear error when value changes
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!template || isReadOnly) return;

    const newErrors: Record<string, string> = {};
    visibleFields.forEach(fieldId => {
      const field = template.fields.find(f => f.id === fieldId);
      if (field && field.type !== 'calculation') {
        const error = validateField(field, values[fieldId]);
        if (error) newErrors[fieldId] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const submittedValues: Record<string, any> = {};
    visibleFields.forEach(fieldId => {
      if (template.fields.find(f => f.id === fieldId)?.type !== 'calculation') {
        submittedValues[fieldId] = values[fieldId];
      }
    });

    const response: FormResponse = {
      id: generateId('res'),
      templateId: template.id,
      submittedAt: new Date().toISOString(),
      values: { ...submittedValues, ...calculatedValues }
    };

    addResponse(response);
    navigate('/');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!template) return <div>Loading...</div>;
  return (
    <div className="layout-container">
      <main className={styles.main}>
        <Card className={styles.headerCard}>
          <div className={styles.headerAccent} />
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{template.title}</h1>
            {isReadOnly && (
              <button className={`${styles.printButton} no-print`} onClick={handlePrint}>
                Download PDF
              </button>
            )}
          </div>
          {template.description && (
            <p className={styles.description}>{template.description}</p>
          )}
          {submittedAt && (
            <p className={styles.submissionInfo}>
              Submitted on {new Date(submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          )}
        </Card>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormRenderer
            fields={template.fields}
            values={{ ...values, ...calculatedValues }}
            onValueChange={handleValueChange}
            errors={errors}
            visibleFields={visibleFields}
            requiredFields={requiredFields}
            readOnly={isReadOnly}
          />

          {!isReadOnly && (
            <div className={`${styles.footer} no-print`}>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>
          )}
        </form>
      </main>

      <div className="print-only">
        <p className={styles.printFooter}>Generated by Form Builder</p>
      </div>
    </div>
  );
};
