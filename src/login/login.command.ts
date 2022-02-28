import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { LoginService } from './login.service';

@Command({ name: 'login', options: { isDefault: true } })
export class LoginCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly service: LoginService,
  ) {}

  async run(inputs: string[], options?: Record<string, any>) {
    options = await this.inquirerService.prompt('login', options);
    await this.service.loginCommand(inputs, options);
  }

  @Option({
    flags: '-s, --server [server]',
    description: 'The server you are logging into',
  })
  parseServer(val: string) {
    return val;
  }
}
