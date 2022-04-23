import { Injectable } from '@nestjs/common';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { Configuration, IdentifierEntity, TranslationsApi } from 'src/client';
import { ConfigService } from 'src/config/config.service';
import { OraService } from 'src/ora/ora.service';
import { forward } from 'src/utils/forward';

@Injectable()
export class FetchService {
  constructor(
    private readonly config: ConfigService,
    private readonly spinner: OraService,
  ) {}
  async command(inputs: string[], options: Record<string, any>) {
    this.spinner.start('Fetching.');
    try {
      await this.fetch();
    } catch (error) {
      this.spinner.throw(error.message);
    }
    this.spinner.succeed('Project successfully fetched');
  }
  async fetch() {
    const configFile = await this.config.config();
    const login = await this.config.login();
    const api = new TranslationsApi(
      new Configuration({ accessToken: login.token }),
      configFile.server,
    );
    const tree = await api.translationsTree(
      configFile.projectId,
      configFile.branches.join(','),
    );
    try {
      await this.config.initDirectory();
      await writeFile(
        path.join(await this.config.getDirectory(), 'tree.json'),
        JSON.stringify(tree.data.data),
      );
    } catch (error) {
      forward(error, 'Error while saving tree file.');
    }
  }
  async parse() {
    const configFile = await this.config.config();
    const parser = await require(configFile.parser);
    try {
      return await parser.parse(
        path.join(
          path.resolve(await this.config.getDirectory(), '..'),
          configFile.output,
        ),
        configFile.languages,
      );
    } catch (error) {
      forward(error, 'Error while saving tree file.');
    }
  }

  async getTree(): Promise<IdentifierEntity[]> {
    const directory = await this.config.getDirectory();
    try {
      const buffer = await readFile(path.join(directory, 'tree.json'));
      return JSON.parse(buffer.toString()) as IdentifierEntity[];
    } catch (error) {
      forward(error, 'Error while reading tree file.');
    }
  }
  async getHistory(): Promise<IdentifierEntity[]> {
    const directory = await this.config.getDirectory();
    try {
      const buffer = await readFile(path.join(directory, 'history.json'));
      return JSON.parse(buffer.toString()) as IdentifierEntity[];
    } catch (error) {
      forward(error, 'Error while reading history file.');
    }
  }
}
