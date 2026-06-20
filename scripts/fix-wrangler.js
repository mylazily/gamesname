import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const wranglerPath = join(process.cwd(), 'dist', 'server', 'wrangler.json');

try {
  const content = readFileSync(wranglerPath, 'utf-8');
  const config = JSON.parse(content);

  // Remove KV namespaces that don't have an id (Pages requires id)
  if (config.kv_namespaces) {
    config.kv_namespaces = config.kv_namespaces.filter(kv => kv.id);
  }
  if (config.previews?.kv_namespaces) {
    config.previews.kv_namespaces = config.previews.kv_namespaces.filter(kv => kv.id);
  }

  // Rename ASSETS binding to avoid reserved name conflict in Pages
  // Actually for Pages, we should remove the assets binding entirely
  // since Pages handles assets differently
  if (config.assets && config.assets.binding === 'ASSETS') {
    delete config.assets;
  }

  // Remove unsupported fields that cause warnings
  const unsupportedFields = [
    'definedEnvironments', 'ai_search_namespaces', 'ai_search',
    'agent_memory', 'secrets_store_secrets', 'artifacts',
    'unsafe_hello_world', 'flagship', 'worker_loaders',
    'ratelimits', 'vpc_services', 'vpc_networks', 'python_modules', 'previews'
  ];
  for (const field of unsupportedFields) {
    delete config[field];
  }

  // Clean up dev field
  if (config.dev) {
    delete config.dev.enable_containers;
    delete config.dev.generate_types;
  }

  writeFileSync(wranglerPath, JSON.stringify(config, null, 2));
  console.log('Fixed wrangler.json for Cloudflare Pages deployment');
} catch (err) {
  console.error('Error fixing wrangler.json:', err.message);
  process.exit(1);
}
