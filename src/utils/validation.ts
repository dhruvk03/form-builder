import { FIELD_TYPES } from '../constants';
import type { FormField } from '../types/schema';
import { FieldRegistry } from '../fields';

export const validateField = (field: FormField, value: any): string | null => {
  if (field.type === FIELD_TYPES.SECTION_HEADER) return null;

  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  if (field.required && isEmpty) {
    return 'This field is required';
  }

  const plugin = FieldRegistry.getPlugin(field.type);
  if (plugin && plugin.validateValue) {
    return plugin.validateValue(field, value);
  }

  return null;
};
