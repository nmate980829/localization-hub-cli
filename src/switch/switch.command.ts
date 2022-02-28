import { Command, CommandRunner, InquirerService } from 'nest-commander';

@Command({ name: 'switch', options: { isDefault: false } })
export class SwitchCommand implements CommandRunner {
  constructor(private readonly inquirerService: InquirerService) {}

  async run(inputs: string[], options?: Record<string, any>) {
    options = await this.inquirerService.prompt('switch', options);
    console.log({ inputs, options });
  }
}
