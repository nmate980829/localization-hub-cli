import { Command, CommandRunner, InquirerService } from 'nest-commander';

@Command({ name: 'push', options: { isDefault: false } })
export class PushCommand implements CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {}

  async run(inputs: string[], options?: Record<string, any>) {
    options = await this.inquirerService.prompt('push', options);
    console.log({ inputs, options });
  }
}
