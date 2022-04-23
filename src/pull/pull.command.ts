import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { PullService } from './pull.service';

@Command({ name: 'pull', options: { isDefault: false } })
export class PullCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly service: PullService,
  ) {}

  async run(inputs: string[], options?: Record<string, any>) {
    //options = await this.inquirerService.prompt('pull', options);
    await this.service.command(inputs, options);
  }
}
