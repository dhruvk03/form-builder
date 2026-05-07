import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormResponse } from '../types/schema';
import { loadTemplates, loadResponses } from '../utils/storage';
import { Card } from '../components/common/Card';
import styles from './HomePage.module.css';

export const HomePage: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplates(loadTemplates());
    setResponses(loadResponses());
  }, []);

  const getResponsesForTemplate = (templateId: string) => {
    return responses.filter((r) => r.templateId === templateId);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.toolBar}>
          <button 
            className={styles.createButton}
            onClick={() => navigate('/builder')}
          >
            + New Template
          </button>
        </div>

        {templates.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No templates created yet.</p>
          </div>
        ) : (
          <div className={styles.templateList}>
            {templates.map((template) => (
              <Card key={template.id} className={styles.templateCard}>
                <div className={styles.templateInfo}>
                  <h2 className={styles.templateTitle}>{template.title}</h2>
                  <p className={styles.fieldCount}>{template.fields.length} Fields</p>
                </div>
                
                <div className={styles.actions}>
                  <Link to={`/builder/${template.id}`} className={styles.actionLink}>
                    Edit Template
                  </Link>
                  <Link to={`/fill/${template.id}/new`} className={styles.primaryActionLink}>
                    New Response
                  </Link>
                </div>

                <div className={styles.responsesSection}>
                  <h3 className={styles.responsesTitle}>Responses:</h3>
                  {getResponsesForTemplate(template.id).length === 0 ? (
                    <p className={styles.noResponses}>No responses yet.</p>
                  ) : (
                    <ul className={styles.responseList}>
                      {getResponsesForTemplate(template.id).map((response) => (
                        <li key={response.id} className={styles.responseItem}>
                          <span className={styles.responseDate}>Submitted on {new Date(response.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          <div className={styles.responseActions}>
                            <Link 
                              to={`/fill/${template.id}/${response.id}`} 
                              className={styles.viewLink}
                            >
                              View
                            </Link>
                            <Link 
                              to={`/fill/${template.id}/${response.id}?print=true`} 
                              className={styles.pdfLink}
                            >
                              PDF
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
