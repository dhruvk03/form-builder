import type { FormField, Dependency } from '../types/schema';
import { DEPENDENCY_ACTIONS, DEPENDENCY_OPERATORS } from '../constants';

export const evaluateFieldState = (
  field: FormField,
  values: Record<string, any>,
  allFields: FormField[]
): { visible: boolean; required: boolean } => {
  let visible = true;
  let required = field.required || false;

  if (!field.dependencies || field.dependencies.length === 0) {
    return { visible, required };
  }

  for (const dep of field.dependencies) {
    const dependentValue = values[dep.fieldId];
    const isSatisfied = checkDependency(dep, dependentValue, allFields);

    if (isSatisfied) {
      if (dep.action === DEPENDENCY_ACTIONS.SHOW) visible = true;
      if (dep.action === DEPENDENCY_ACTIONS.HIDE) visible = false;
      if (dep.action === DEPENDENCY_ACTIONS.REQUIRE) required = true;
      if (dep.action === DEPENDENCY_ACTIONS.OPTIONAL) required = false;
    } else {
      // If it's a show action and not satisfied, it should be hidden
      if (dep.action === DEPENDENCY_ACTIONS.SHOW) visible = false;
      // If it's a require action and not satisfied, it should be optional
      if (dep.action === DEPENDENCY_ACTIONS.REQUIRE) required = field.required || false;
    }
  }

  return { visible, required };
};

const checkDependency = (dep: Dependency, value: any, allFields: FormField[]): boolean => {
  const targetValue = dep.value;
  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  switch (dep.operator) {
    case DEPENDENCY_OPERATORS.EQUALS:
      return String(value || '') === String(targetValue || '');
    case DEPENDENCY_OPERATORS.NOT_EQUALS:
      return String(value || '') !== String(targetValue || '');
    case DEPENDENCY_OPERATORS.CONTAINS:
      if (isEmpty) return false;
      if (Array.isArray(value)) {
        return value.includes(targetValue);
      }
      return String(value).toLowerCase().includes(String(targetValue).toLowerCase());
    case DEPENDENCY_OPERATORS.GREATER_THAN:
      return !isEmpty && Number(value) > Number(targetValue);
    case DEPENDENCY_OPERATORS.LESS_THAN:
      return !isEmpty && Number(value) < Number(targetValue);
    case DEPENDENCY_OPERATORS.WITHIN_RANGE: {
      if (isEmpty) return false;
      const rangeArr = Array.isArray(targetValue) 
        ? targetValue 
        : String(targetValue).split(',').map(s => s.trim());
      if (rangeArr.length === 2) {
        const val = Number(value);
        return val >= Number(rangeArr[0]) && val <= Number(rangeArr[1]);
      }
      return false;
    }
    case DEPENDENCY_OPERATORS.CONTAINS_ANY: {
      if (isEmpty) return false;
      const valArr = Array.isArray(value) ? value : [value];
      const targetArr = String(targetValue).split(',').map(s => s.trim());
      return targetArr.some(t => valArr.includes(t));
    }
    case DEPENDENCY_OPERATORS.CONTAINS_ALL: {
      if (isEmpty) return false;
      const valArr = Array.isArray(value) ? value : [value];
      
      // If targetValue is empty, it means "All selected" (check against all options)
      if (!targetValue || targetValue === '') {
        const sourceField = allFields.find(f => f.id === dep.fieldId);
        if (sourceField && 'options' in sourceField) {
          return sourceField.options.every(opt => valArr.includes(opt));
        }
      }

      const targetArr = String(targetValue).split(',').map(s => s.trim());
      return targetArr.every(t => valArr.includes(t));
    }
    case DEPENDENCY_OPERATORS.CONTAINS_NONE: {
      if (isEmpty) return false; // Don't trigger hide/show if nothing is selected
      const valArr = Array.isArray(value) ? value : [value];
      const targetArr = String(targetValue).split(',').map(s => s.trim());
      return !targetArr.some(t => valArr.includes(t));
    }
    case DEPENDENCY_OPERATORS.BEFORE:
      return !isEmpty && new Date(value) < new Date(targetValue);
    case DEPENDENCY_OPERATORS.AFTER:
      return !isEmpty && new Date(value) > new Date(targetValue);
    default:
      return false;
  }
};
