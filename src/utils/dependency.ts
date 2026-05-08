import type { FormField, Dependency } from '../types/schema';

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
      if (dep.action === 'show') visible = true;
      if (dep.action === 'hide') visible = false;
      if (dep.action === 'require') required = true;
      if (dep.action === 'optional') required = false;
    } else {
      // If it's a show action and not satisfied, it should be hidden
      if (dep.action === 'show') visible = false;
      // If it's a require action and not satisfied, it should be optional
      if (dep.action === 'require') required = field.required || false;
    }
  }

  return { visible, required };
};

const checkDependency = (dep: Dependency, value: any, allFields: FormField[]): boolean => {
  const targetValue = dep.value;
  const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

  switch (dep.operator) {
    case 'equals':
      return String(value || '') === String(targetValue || '');
    case 'notEquals':
      return String(value || '') !== String(targetValue || '');
    case 'contains':
      if (isEmpty) return false;
      if (Array.isArray(value)) {
        return value.includes(targetValue);
      }
      return String(value).toLowerCase().includes(String(targetValue).toLowerCase());
    case 'greaterThan':
      return !isEmpty && Number(value) > Number(targetValue);
    case 'lessThan':
      return !isEmpty && Number(value) < Number(targetValue);
    case 'withinRange': {
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
    case 'containsAny': {
      if (isEmpty) return false;
      const valArr = Array.isArray(value) ? value : [value];
      const targetArr = String(targetValue).split(',').map(s => s.trim());
      return targetArr.some(t => valArr.includes(t));
    }
    case 'containsAll': {
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
    case 'containsNone': {
      if (isEmpty) return false; // Don't trigger hide/show if nothing is selected
      const valArr = Array.isArray(value) ? value : [value];
      const targetArr = String(targetValue).split(',').map(s => s.trim());
      return !targetArr.some(t => valArr.includes(t));
    }
    case 'before':
      return !isEmpty && new Date(value) < new Date(targetValue);
    case 'after':
      return !isEmpty && new Date(value) > new Date(targetValue);
    default:
      return false;
  }
};

export const detectCycles = (fields: FormField[]): string | null => {
  const adj = new Map<string, string[]>();
  for (const field of fields) {
    const deps = field.dependencies?.map((d) => d.fieldId) || [];
    if (field.type === 'calculation' && (field as any).sourceFieldIds) {
      deps.push(...(field as any).sourceFieldIds);
    }
    adj.set(field.id, deps);
  }

  const visited = new Set<string>();
  const stack = new Set<string>();

  function hasCycle(id: string): boolean {
    visited.add(id);
    stack.add(id);

    const neighbors = adj.get(id) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (stack.has(neighbor)) {
        return true;
      }
    }

    stack.delete(id);
    return false;
  }

  for (const field of fields) {
    if (!visited.has(field.id)) {
      if (hasCycle(field.id)) return 'Circular dependency detected';
    }
  }

  return null;
};
