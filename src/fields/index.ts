import { FieldRegistry } from './registry';
import { SingleLineTextPlugin } from './plugins/SingleLineTextPlugin';
import { MultiLineTextPlugin } from './plugins/MultiLineTextPlugin';
import { NumberPlugin } from './plugins/NumberPlugin';
import { DatePlugin } from './plugins/DatePlugin';
import { SingleSelectPlugin } from './plugins/SingleSelectPlugin';
import { MultiSelectPlugin } from './plugins/MultiSelectPlugin';
import { FileUploadPlugin } from './plugins/FileUploadPlugin';
import { SectionHeaderPlugin } from './plugins/SectionHeaderPlugin';
import { CalculationPlugin } from './plugins/CalculationPlugin';

// Register all core plugins
FieldRegistry.register(SingleLineTextPlugin);
FieldRegistry.register(MultiLineTextPlugin);
FieldRegistry.register(NumberPlugin);
FieldRegistry.register(DatePlugin);
FieldRegistry.register(SingleSelectPlugin);
FieldRegistry.register(MultiSelectPlugin);
FieldRegistry.register(FileUploadPlugin);
FieldRegistry.register(SectionHeaderPlugin);
FieldRegistry.register(CalculationPlugin);

// Re-export registry for convenience
export { FieldRegistry };
export * from './types';