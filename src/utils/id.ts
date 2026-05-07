import { v4 as uuidv4 } from 'uuid';

export const generateId = (prefix: 'tpl' | 'fld' | 'res'): string => {
  const shortId = uuidv4().split('-')[0];
  return `${prefix}_${shortId}`;
};
