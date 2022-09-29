import path from 'path';

export function resolve(dir: string) {
  return path.join(process.cwd(), dir);
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnvConfig {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let envValue = envConf[envName].replace(/\\n/g, '\n');

    envValue =
      envValue === 'true' ? true : envValue === 'false' ? false : envValue;

    if (envName === 'VITE_PORT') {
      envValue = Number(envValue);
    }
    if (envName === 'VITE_PROXY' && envValue) {
      try {
        envValue = JSON.parse(envValue.replace(/'/g, '"'));
      } catch (error) {
        envValue = '';
      }
    }
    ret[envName] = envValue;
    if (typeof envValue === 'string') {
      process.env[envName] = envValue;
    } else if (typeof envValue === 'object') {
      process.env[envName] = JSON.stringify(envValue);
    }
  }
  return ret;
}
