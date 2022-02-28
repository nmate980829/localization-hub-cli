import {
  Command,
  CommandRunner,
  InquirerService,
  Option,
} from 'nest-commander';
import { ConfigService } from 'src/config/config.service';
import { LoginService } from 'src/login/login.service';
import { OraService } from 'src/ora/ora.service';
import { InitService } from './init.service';

@Command({
  name: 'init',
  description: 'Initialize project. Logs you in and creates config file.',
  arguments: '[parser]',
  argsDescription: { parser: 'The parser you wish to use' },
  options: { isDefault: false },
})
export class InitCommand implements CommandRunner {
  constructor(
    private readonly inquirerService: InquirerService,
    private readonly config: ConfigService,
    private readonly service: InitService,
    private readonly loginService: LoginService,
    private readonly spinner: OraService,
  ) {}

  async run(inputs: string[], options?: Record<string, any>) {
    if (await this.config.isConfig())
      this.spinner.throw('Config already exists.');

    if (!(await this.config.isLoggedIn())) {
      options = await this.inquirerService.prompt('login', options);
      await this.loginService.loginCommand(inputs, options);
    }
    options = await this.inquirerService.prompt('init', options);
    await this.service.init(inputs, options);
  }

  @Option({
    flags: '-s, --server [server]',
    description: 'The server you are logging into.',
  })
  parseServer(val: string) {
    return val;
  }

  @Option({
    flags: '-n, --n [name]',
    description: 'The name of your project.',
  })
  parseName(val: string) {
    return val;
  }

  @Option({
    flags: '-d, --description [description]',
    description: 'The description of your project.',
  })
  parseDescription(val: string) {
    return val;
  }

  @Option({
    flags: '-o, --output [output]',
    description: 'The generated output.',
  })
  parseOutput(val: string) {
    return val;
  }
}
