import { QuestionSet, Question } from 'nest-commander';

@QuestionSet({ name: 'diff' })
export class DiffQuestions {
  @Question({
    name: 'default',
  })
  parseDefault(str: string): string {
    return str;
  }
}
