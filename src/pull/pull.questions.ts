import { QuestionSet, Question } from 'nest-commander';

@QuestionSet({ name: 'pull' })
export class PullQuestions {
  @Question({
    name: 'default',
  })
  parseDefault(str: string): string {
    return str;
  }
}
