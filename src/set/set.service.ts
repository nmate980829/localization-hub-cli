import { Injectable } from '@nestjs/common';
import { Config } from 'src/config/config.dto';
import { ConfigService } from 'src/config/config.service';
import { OraService } from 'src/ora/ora.service';

const fields: Record<keyof Config, string[]> = {
  server: [],
  uiURL: [],
  projectId: [],
  parser: [],
  head: [],
  branches: ['add', 'remove', 'clear'],
  output: [],
  defaultLanguage: [],
  languages: [],
};

@Injectable()
export class SetService {
  constructor(
    private readonly config: ConfigService,
    private readonly spinner: OraService,
  ) {}

  async command(inputs: string[], options?: Record<string, any>) {
    this.spinner.start('Creating configuration.');
    const { field, action } = options;
    try {
      if (fields[field].contains(action)) {
        await this.action(field, action, inputs);
      } else {
        await this.set(field, action);
      }
    } catch (error) {
      this.spinner.throw(error.message);
    }
    this.spinner.succeed('Project successfully initiated!');
  }
  async action(field: string, action: string, inputs: string[]) {
    const config = await this.config.config();
    if (action === 'clear') config[field] = [];
    else if (action === 'add') config[field].push(inputs);
    else if (action === 'remove')
      config[field] = config[field].filter(
        (element) => !inputs.includes(element),
      );
    await this.config.saveConfig(config);
  }
  async set(field: string, input: string) {
    const config = await this.config.config();
    config[field] = input;
    await this.config.saveConfig(config);
  }
}
