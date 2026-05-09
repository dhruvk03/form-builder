import { FIELD_TYPES } from '../constants';
import type { FormField } from '../types/schema';

export const validateField = (field: FormField, value: any): string | null => {
  if (field.type === FIELD_TYPES.SECTION_HEADER) return null;

  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return 'This field is required';
  }

  switch (field.type) {
    case FIELD_TYPES.SINGLE_LINE_TEXT:
    case FIELD_TYPES.MULTI_LINE_TEXT: {
      const minLength = (field as any).minLength;
      const maxLength = (field as any).maxLength;
      const currentLength = String(value || '').length;

      if (minLength !== undefined && minLength !== null && minLength !== '') {
        const min = Number(minLength);
        if (!isNaN(min) && currentLength < min) {
          return `Minimum length is ${min} characters`;
        }
      }
      if (maxLength !== undefined && maxLength !== null && maxLength !== '') {
        const max = Number(maxLength);
        if (!isNaN(max) && currentLength > max) {
          return `Maximum length is ${max} characters`;
        }
      }
      break;
    }

    case FIELD_TYPES.NUMBER: {
      // If empty and not required, only check min if min is set
      if (isEmpty) {
        const minVal = (field as any).min;
        if (minVal !== undefined && minVal !== null && minVal !== '') {
          const min = Number(minVal);
          if (!isNaN(min) && 0 < min) {
            return `Minimum value is ${min}`;
          }
        }
        return null;
      }

      const num = Number(value);
      if (isNaN(num)) return 'Must be a number';
      
      const minVal = (field as any).min;
      const maxVal = (field as any).max;

      if (minVal !== undefined && minVal !== null && minVal !== '') {
        const min = Number(minVal);
        if (!isNaN(min) && num < min) {
          return `Minimum value is ${min}`;
        }
      }
      if (maxVal !== undefined && maxVal !== null && maxVal !== '') {
        const max = Number(maxVal);
        if (!isNaN(max) && num > max) {
          return `Maximum value is ${max}`;
        }
      }
      break;
    }

    case FIELD_TYPES.DATE: {
      if (isEmpty) {
        // If not required but has constraints, check if 0/empty should be blocked
        // Usually for dates, if it's empty and not required, it's valid unless there's a specific "cannot be empty" logic
        return null;
      }
      
      const selectedDate = new Date(value);
      if (isNaN(selectedDate.getTime())) return 'Invalid date';

      const minDateVal = (field as any).minDate;
      const maxDateVal = (field as any).maxDate;

      if (minDateVal) {
        const min = new Date(minDateVal);
        if (!isNaN(min.getTime()) && selectedDate < min) {
          return `Date must be after ${min.toLocaleDateString()}`;
        }
      }
      if (maxDateVal) {
        const max = new Date(maxDateVal);
        if (!isNaN(max.getTime()) && selectedDate > max) {
          return `Date must be before ${max.toLocaleDateString()}`;
        }
      }
      break;
    }

    case FIELD_TYPES.MULTI_SELECT: {
      if (isEmpty) {
        if ((field as any).minSelections && (field as any).minSelections > 0) {
          return `Select at least ${(field as any).minSelections} options`;
        }
        return null;
      }
      if ((field as any).minSelections && Array.isArray(value) && value.length < (field as any).minSelections) {
        return `Select at least ${(field as any).minSelections} options`;
      }
      if ((field as any).maxSelections && Array.isArray(value) && value.length > (field as any).maxSelections) {
        return `Select no more than ${(field as any).maxSelections} options`;
      }
      break;
    }

    case FIELD_TYPES.FILE_UPLOAD: {
      if (isEmpty) {
        return null;
      }
      if (field.maxFiles && Array.isArray(value) && value.length > field.maxFiles) {
        return `No more than ${field.maxFiles} files allowed`;
      }
      break;
    }
  }

  return null;
};
