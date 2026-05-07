import type { FormTemplate, FormResponse } from '../types/schema';

const TEMPLATES_KEY = 'form_builder_templates';
const RESPONSES_KEY = 'form_builder_responses';

export const saveTemplates = (templates: FormTemplate[]): void => {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
};

export const loadTemplates = (): FormTemplate[] => {
  const data = localStorage.getItem(TEMPLATES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveResponses = (responses: FormResponse[]): void => {
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
};

export const loadResponses = (): FormResponse[] => {
  const data = localStorage.getItem(RESPONSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const addTemplate = (template: FormTemplate): void => {
  const templates = loadTemplates();
  const existingIndex = templates.findIndex((t) => t.id === template.id);
  if (existingIndex > -1) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }
  saveTemplates(templates);
};

export const deleteTemplate = (id: string): void => {
  const templates = loadTemplates().filter((t) => t.id !== id);
  saveTemplates(templates);
  // Also delete responses for this template
  const responses = loadResponses().filter((r) => r.templateId !== id);
  saveResponses(responses);
};

export const addResponse = (response: FormResponse): void => {
  const responses = loadResponses();
  responses.push(response);
  saveResponses(responses);
};
