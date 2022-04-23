import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import path from 'path';
import {
  Configuration,
  IdentifierEntity,
  Language,
  LanguagesApi,
  TranslationsApi,
} from 'src/client';
import { ConfigService } from 'src/config/config.service';
import { FetchService } from 'src/fetch/fetch.service';
import { OraService } from 'src/ora/ora.service';
import { forward } from 'src/utils/forward';
import { serialize } from 'json-parser';

@Injectable()
export class PullService {
  constructor(
    private readonly fetchService: FetchService,
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
    const lApi = new LanguagesApi(
      new Configuration({ accessToken: login.token }),
      configFile.server,
    );
    const tApi = new TranslationsApi(
      new Configuration({ accessToken: login.token }),
      configFile.server,
    );
    const langs = (await lApi.languagesFindAll(configFile.projectId)).data
      .data as Language[];
    const languages = langs.map((l) => l.key);
    const tree = (
      await tApi.translationsTree(
        configFile.projectId,
        configFile.branches.join(','),
      )
    ).data.data as IdentifierEntity[];
    try {
      await this.config.initDirectory();
      await this.config.saveConfig({ ...configFile, languages });
      await serialize(configFile.output, tree, languages);
    } catch (error) {
      console.log(error);
      forward(error, 'Error while saving tree file.');
    }
  }
}
