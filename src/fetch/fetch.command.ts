import { Command, CommandRunner } from 'nest-commander';
import { FetchService } from './fetch.service';

@Command({ name: 'fetch', options: { isDefault: false } })
export class FetchCommand implements CommandRunner {
  constructor(private readonly service: FetchService) {}

  async run(inputs: string[], options: Record<string, any>) {
    console.log({ inputs, options });
    await this.service.command(inputs, options);
  }
}
