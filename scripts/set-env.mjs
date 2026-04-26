import { writeFile, readFileSync } from 'fs';
import * as path from 'path';

// Función minimalista para leer .env sin dependencias externas
function parseEnv(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const env = {};
    content.split('\n').forEach(rawLine => {
      let line = rawLine.trim();
      if (!line || line.startsWith('#')) return; // skip empty or comment lines
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.substring(0, idx).trim();
      let value = line.substring(idx + 1).trim();
      // support quoted values
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    });
    return env;
  } catch (e) {
    return {};
  }
}

// prefer values from process.env (hosting like Vercel); fall back to .env for local dev
const fileEnv = parseEnv('.env');
const env = Object.assign({}, fileEnv, process.env);

const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';
const runtimeConfigPath = './src/assets/runtime-config.json';

const apiUrl = env['API_URL'] || 'http://localhost:8080';
if (process.env['API_URL']) {
  console.log(`Using API_URL from process.env: ${process.env['API_URL']}`);
} else if (fileEnv['API_URL']) {
  console.log(`Using API_URL from .env: ${fileEnv['API_URL']}`);
} else {
  console.log(`API_URL not found in process.env or .env, using default ${apiUrl}`);
}

const envConfigFile = `export const environment = {
  production: ${env['PRODUCTION'] === 'true'},
  apiUrl: ''
};
`;

const runtimeConfig = JSON.stringify({
  production: env['PRODUCTION'] === 'true',
  apiUrl: apiUrl
}, null, 2);

const callback = (err) => {
  if (err) {
    console.error(err);
  }
};

writeFile(targetPath, envConfigFile, callback);
writeFile(targetPathProd, envConfigFile, callback);
writeFile(runtimeConfigPath, runtimeConfig, callback);
