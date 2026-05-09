import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { FormTemplate, FormResponse } from '../types/schema';
import { loadTemplates, loadResponses, deleteTemplate } from '../utils/storage';
import { Card } from '../components/common/Card';
import styles from './HomePage.module.css';

import { UI_STRINGS } from '../constants';

export const HomePage: React.FC = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const navigate = useNavigate();

  const refreshData = () => {
    setTemplates(loadTemplates());
    setResponses(loadResponses());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteTemplate = (id: string, title: string) => {
    if (window.confirm(UI_STRINGS.DELETE_TEMPLATE_CONFIRM(title))) {
      deleteTemplate(id);
      refreshData();
    }
  };

  const getResponsesForTemplate = (templateId: string) => {
    return responses.filter((r) => r.templateId === templateId);
  };

  return (
    <div className="layout-container">
      <main className={styles.main}>
        <div className={styles.toolBar}>
          <button 
            className={styles.createButton}
            onClick={() => navigate('/builder')}
          >
            {UI_STRINGS.NEW_TEMPLATE}
          </button>
        </div>

        {templates.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{UI_STRINGS.NO_TEMPLATES}</p>
          </div>
        ) : (
          <div className={styles.templateList}>
            {templates.map((template) => (
              <Card key={template.id} className={styles.templateCard}>
                <button 
                  onClick={() => handleDeleteTemplate(template.id, template.title)}
                  className={styles.deleteButton}
                  title={UI_STRINGS.DELETE_TEMPLATE_CONFIRM(template.title)}
                >
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>

                <div className={styles.templateInfo}>
                  <h2 className={styles.templateTitle}>{template.title}</h2>
                  <p className={styles.fieldCount}>{template.fields.length} Fields</p>
                </div>
                
                <div className={styles.actions}>
                  <Link to={`/builder/${template.id}`} className={styles.actionLink}>
                    {UI_STRINGS.EDIT_TEMPLATE}
                  </Link>
                  <Link to={`/fill/${template.id}/new`} className={styles.primaryActionLink}>
                    {UI_STRINGS.NEW_RESPONSE}
                  </Link>
                </div>

                <div className={styles.responsesSection}>
                  <h3 className={styles.responsesTitle}>{UI_STRINGS.RESPONSES_LABEL}</h3>
                  {getResponsesForTemplate(template.id).length === 0 ? (
                    <p className={styles.noResponses}>{UI_STRINGS.NO_RESPONSES}</p>
                  ) : (
                    <ul className={styles.responseList}>
                      {getResponsesForTemplate(template.id).map((response) => (
                        <li key={response.id} className={styles.responseItem}>
                          <span className={styles.responseDate}>{UI_STRINGS.SUBMITTED_ON} {new Date(response.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          <div className={styles.responseActions}>
                            <Link 
                              to={`/fill/${template.id}/${response.id}`} 
                              className={styles.viewLink}
                            >
                              {UI_STRINGS.VIEW}
                            </Link>
                            <Link 
                              to={`/fill/${template.id}/${response.id}?print=true`} 
                              className={styles.pdfLink}
                            >
                              {UI_STRINGS.PDF}
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
