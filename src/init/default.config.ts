import { plainToInstance } from 'class-transformer';
import { Config } from 'src/config/config.dto';

export const defaultConfig = (
  server: string,
  projectId: number,
  parser?: string,
  output?: string,
): Config =>
  plainToInstance(Config, {
    server,
    projectId,
    parser: parser || '@lohub/json-parser',
    output: output || 'src/localization',
    languages: [],
    head: 'main',
    branches: ['main'],
  });
