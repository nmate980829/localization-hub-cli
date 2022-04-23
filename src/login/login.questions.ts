import { Logger } from '@nestjs/common';
import { isString, isURL } from 'class-validator';
import { QuestionSet, Question, ValidateFor, WhenFor } from 'nest-commander';
import { ConfigService } from 'src/config/config.service';

@QuestionSet({ name: 'login' })
export class LoginQuestions {
  constructor(private readonly config: ConfigService) {}

  @Question({
    message: 'What is the server you are looking to login to?',
    name: 'server',
  })
  parseDefault(str: string): string {
    return str;
  }
  @ValidateFor({
    name: 'server',
  })
  validate(str: string): boolean {
    return isURL(str, { require_tld: false });
  }
  @WhenFor({
    name: 'server',
  })
  async when(
    inputs: string[],
    options?: Record<string, any>,
  ): Promise<boolean> {
    return (
      !(await this.config.isLoggedIn()) &&
      !(await this.config.isConfig()) &&
      (!options?.server || !isURL(options.server, { require_tld: false }))
    );
  }
}
