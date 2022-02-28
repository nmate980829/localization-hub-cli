import { Command, CommandRunner } from 'nest-commander';
import { DiffService } from './diff.service';

@Command({ name: 'diff', options: { isDefault: false } })
export class DiffCommand implements CommandRunner {
  constructor(private readonly service: DiffService) {}
  async run(inputs: string[], options: Record<string, any>) {
    console.log({ inputs, options });
    this.service.command();
  }
}
