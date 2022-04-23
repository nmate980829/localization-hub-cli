import chalk from 'chalk';
import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { ConfigService } from 'src/config/config.service';

@Command({ name: 'logout', options: { isDefault: false } })
export class LogoutCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly config: ConfigService,
  ) {}

  async run(inputs: string[], options?: Record<string, any>) {
    options = await this.inquirerService.prompt('logout', options);
    if (options?.confirm === true) await this.config.logout();
    console.log(chalk.green('Good bye!'));
  }

  @Option({
    flags: '-y, --confirm',
    description: 'Confirm logout',
  })
  parseShell(val: string) {
    return true;
  }
}
