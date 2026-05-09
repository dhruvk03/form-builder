import type { FieldPlugin } from '../types';
import type { SectionHeaderField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS } from '../../constants';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const SectionHeaderPlugin: FieldPlugin<SectionHeaderField> = {
  type: FIELD_TYPES.SECTION_HEADER,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.SECTION_HEADER],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.SECTION_HEADER,
    label: '',
    description: '',
    required: false,
  }),

  validateConfig: () => null,
  validateValue: () => null,

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
  ],

  BuilderConfigComponent: () => null,

  FillerComponent: ({ field }) => (
    <div className={rendererStyles.sectionHeader}>
      <h3 className={rendererStyles.sectionTitle}>{field.label}</h3>
    </div>
  ),
};