import type { FormField } from '../types/schema';

export const validateField = (field: FormField, value: any): string | null => {
  if (field.type === 'sectionHeader') return null;

  if (field.required && (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))) {
    return 'This field is required';
  }

  if (value === undefined || value === null || value === '') return null;

  switch (field.type) {
    case 'singleLineText':
    case 'multiLineText':
      if (field.minLength && String(value).length < field.minLength) {
        return `Minimum length is ${field.minLength} characters`;
      }
      if (field.maxLength && String(value).length > field.maxLength) {
        return `Maximum length is ${field.maxLength} characters`;
      }
      break;

    case 'number':
      const num = Number(value);
      if (isNaN(num)) return 'Must be a number';
      if (field.min !== undefined && num < field.min) {
        return `Minimum value is ${field.min}`;
      }
      if (field.max !== undefined && num > field.max) {
        return `Maximum value is ${field.max}`;
      }
      break;

    case 'date':
      // Basic date validation could be added here
      break;

    case 'multiSelect':
      if (field.minSelections && Array.isArray(value) && value.length < field.minSelections) {
        return `Select at least ${field.minSelections} options`;
      }
      if (field.maxSelections && Array.isArray(value) && value.length > field.maxSelections) {
        return `Select no more than ${field.maxSelections} options`;
      }
      break;

    case 'fileUpload':
      if (field.maxFiles && Array.isArray(value) && value.length > field.maxFiles) {
        return `No more than ${field.maxFiles} files allowed`;
      }
      // Allowed types validation could be added if metadata is passed
      break;
  }

  return null;
};
