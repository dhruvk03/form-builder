import type { FormField, Dependency } from '../types/schema';

export const evaluateFieldState = (
  field: FormField,
  values: Record<string, any>
): { visible: boolean; required: boolean } => {
  let visible = true;
  let required = field.required || false;

  if (!field.dependencies || field.dependencies.length === 0) {
    return { visible, required };
  }

  for (const dep of field.dependencies) {
    const dependentValue = values[dep.fieldId];
    const isSatisfied = checkDependency(dep, dependentValue);

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

const checkDependency = (dep: Dependency, value: any): boolean => {
  switch (dep.operator) {
    case 'equals':
      return value === dep.value;
    case 'notEquals':
      return value !== dep.value;
    case 'contains':
      return Array.isArray(value) ? value.includes(dep.value) : String(value).includes(String(dep.value));
    case 'greaterThan':
      return Number(value) > Number(dep.value);
    case 'lessThan':
      return Number(value) < Number(dep.value);
    case 'withinRange':
      if (Array.isArray(dep.value) && dep.value.length === 2) {
        const val = Number(value);
        return val >= Number(dep.value[0]) && val <= Number(dep.value[1]);
      }
      return false;
    case 'before':
      return new Date(value) < new Date(dep.value);
    case 'after':
      return new Date(value) > new Date(dep.value);
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
