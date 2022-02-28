import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { ConfigService } from 'src/config/config.service';
import { OraService } from 'src/ora/ora.service';
import { SetService } from './set.service';

@Command({
  name: 'set',
  description: 'Set a field of a config',
  arguments: '<field> [action]',
  options: { isDefault: false },
})
export class SetCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly config: ConfigService,
    private readonly spinner: OraService,
    private readonly service: SetService,
  ) {}

  async run(inputs: string[], options?: Record<string, any>) {
    if (!(await this.config.isConfig()))
      this.spinner.throw('Config does not exist.');
    await this.service.command(inputs, options);
  }
}
