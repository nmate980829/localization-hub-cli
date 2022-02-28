import { QuestionSet, Question, ValidateFor, WhenFor } from 'nest-commander';

@QuestionSet({ name: 'logout' })
export class LogoutQuestions {
  @Question({
    message: 'Are you sure you want to log out?',
    name: 'confirm',
    type: 'confirm',
    default: false,
  })
  parseDefault(str: string): string {
    return str;
  }
  @ValidateFor({
    name: 'confirm',
  })
  validate(value: boolean): boolean {
    return typeof value === 'boolean';
  }
  @WhenFor({
    name: 'confirm',
  })
  when(inputs: string[], options?: Record<string, any>): boolean {
    return !options?.confirm;
  }
}
