import { QuestionSet, Question } from 'nest-commander';

@QuestionSet({ name: 'push' })
export class PushQuestions {
  @Question({
    name: 'default',
  })
  parseDefault(str: string): string {
    return str;
  }
}
