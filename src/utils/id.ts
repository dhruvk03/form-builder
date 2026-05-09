import { v4 as uuidv4 } from 'uuid';
import { CONFIG } from '../constants';

export const generateId = (prefix: typeof CONFIG.TEMPLATE_ID_PREFIX | typeof CONFIG.FIELD_ID_PREFIX | typeof CONFIG.RESPONSE_ID_PREFIX): string => {
  const shortId = uuidv4().split('-')[0];
  return `${prefix}_${shortId}`;
};
