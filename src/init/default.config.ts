import { plainToInstance } from 'class-transformer';
import { Config } from 'src/config/config.dto';

export const defaultConfig = (
  server: string,
  uiURL: string,
  projectId: number,
  parser?: string,
  output?: string,
): Config =>
  plainToInstance(Config, {
    server,
    uiURL,
    projectId,
    parser: parser || '@lohub/json-parser',
    output: output || 'src/localization',
    languages: [],
    head: 'main',
    branches: ['main'],
  });
