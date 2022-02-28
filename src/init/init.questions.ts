import { QuestionSet, Question, ValidateFor, WhenFor } from 'nest-commander';
import { Separator } from 'inquirer';

const parserChoices = ['json'];

@QuestionSet({ name: 'init' })
export class InitQuestions {
  @Question({
    message: 'What parser do you wish to use in your project?',
    name: 'parser',
    type: 'list',
    default: 0,
    choices: [...parserChoices, new Separator(), 'custom'],
  })
  parseDefault(str: string): string {
    return str;
  }
  @ValidateFor({
    name: 'parser',
  })
  validate(str: string): boolean {
    return [...parserChoices, 'custom'].includes(str);
  }
  @Question({
    message:
      'Please provide the custom parser you wish to use in your project.',
    name: 'customParser',
    type: 'input',
  })
  parseCustom(str: string): string {
    return str;
  }
  @WhenFor({
    name: 'customParser',
  })
  async when(options?: Record<string, any>): Promise<boolean> {
    return options.parser === 'custom';
  }
  @Question({
    message: 'Please provide a name for your project.',
    name: 'name',
    type: 'input',
  })
  parseName(str: string): string {
    return str;
  }
  @Question({
    message: 'Please provide a description for your project.',
    name: 'description',
    type: 'input',
  })
  parseDescription(str: string): string {
    return str;
  }
  @Question({
    message: 'Please provide an output path for the generated files.',
    name: 'output',
    type: 'input',
    default: 'src/localization',
  })
  parseOutput(str: string): string {
    return str;
  }
}
