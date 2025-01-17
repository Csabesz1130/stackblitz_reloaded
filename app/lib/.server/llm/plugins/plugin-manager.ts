import fs from 'fs';
import path from 'path';
import { LLMPlugin } from './plugin-interface';

class PluginManager {
  private plugins: Map<string, LLMPlugin> = new Map();

  loadPlugins(pluginDir: string) {
    const pluginFiles = fs.readdirSync(pluginDir);

    pluginFiles.forEach((file) => {
      const pluginPath = path.join(pluginDir, file);
      const pluginModule = require(pluginPath);
      const plugin: LLMPlugin = pluginModule.default;

      if (plugin && typeof plugin.initialize === 'function') {
        this.plugins.set(file, plugin);
      }
    });
  }

  initializePlugin(pluginName: string, apiKey: string, endpoint: string) {
    const plugin = this.plugins.get(pluginName);

    if (plugin) {
      plugin.initialize(apiKey, endpoint);
    } else {
      throw new Error(`Plugin ${pluginName} not found`);
    }
  }

  configurePlugin(pluginName: string, settings: Record<string, any>) {
    const plugin = this.plugins.get(pluginName);

    if (plugin) {
      plugin.configure(settings);
    } else {
      throw new Error(`Plugin ${pluginName} not found`);
    }
  }

  async interactWithPlugin(pluginName: string, input: string): Promise<string> {
    const plugin = this.plugins.get(pluginName);

    if (plugin) {
      return await plugin.interact(input);
    } else {
      throw new Error(`Plugin ${pluginName} not found`);
    }
  }
}

export default PluginManager;
