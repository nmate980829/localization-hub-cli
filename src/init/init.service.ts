import { Injectable } from '@nestjs/common';
import { Configuration, Project, ProjectsApi } from 'src/client';
import { ConfigService } from 'src/config/config.service';
import { OraService } from 'src/ora/ora.service';
import { defaultConfig } from './default.config';

@Injectable()
export class InitService {
  constructor(
    private readonly spinner: OraService,
    private readonly config: ConfigService,
  ) {}

  async init(inputs: string[], options?: Record<string, any>) {
    this.spinner.start('Creating configuration.');
    try {
      const { parser, name, description } = options;
      const { server, token } = await this.config.login();
      const api = new ProjectsApi(
        new Configuration({ accessToken: token }),
        server,
      );
      const response = await api.projectsCreate({ name, description });
      const config = defaultConfig(
        server,
        (response.data.data as Project).id,
        parser,
      );
      await this.config.saveConfig(config);
    } catch (error) {
      this.spinner.throw(error.message);
    }
    this.spinner.succeed('Project successfully initiated!');
  }
}
