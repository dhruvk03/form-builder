import type { FieldPlugin } from './types';
import type { FieldType } from '../types/schema';

class Registry {
  private plugins = new Map<FieldType, FieldPlugin<any>>();

  register(plugin: FieldPlugin<any>) {
    if (this.plugins.has(plugin.type)) {
      console.warn(`[FieldRegistry] Overwriting existing plugin for type: ${plugin.type}`);
    }
    this.plugins.set(plugin.type, plugin);
  }

  getPlugin(type: FieldType): FieldPlugin<any> | undefined {
    return this.plugins.get(type);
  }

  getAllPlugins(): FieldPlugin<any>[] {
    return Array.from(this.plugins.values());
  }

  getRegisteredTypes(): FieldType[] {
    return Array.from(this.plugins.keys());
  }
}

export const FieldRegistry = new Registry();