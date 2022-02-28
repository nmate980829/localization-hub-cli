import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { FetchService } from 'src/fetch/fetch.service';
import { OraService } from 'src/ora/ora.service';

@Injectable()
export class PullService {
  constructor(
    private readonly fetchService: FetchService,
    private readonly config: ConfigService,
    private readonly spinner: OraService,
  ) {}
  async command(inputs: string[], options: Record<string, any>) {
    await this.fetchService.command(inputs, options);
    this.spinner.start('Fetching.');
    try {
    } catch (error) {
      this.spinner.throw(error.message);
    }
    this.spinner.succeed('Project successfully fetched');
  }
}
