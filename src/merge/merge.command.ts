import { Command, CommandRunner, InquirerService } from 'nest-commander';

@Command({ name: 'merge', options: { isDefault: true } })
export class MergeCommand implements CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {}

  async run(inputs: string[], options?: Record<string, any>) {
    options = await this.inquirerService.prompt('merge', options);
    console.log({ inputs, options });
  }
}
