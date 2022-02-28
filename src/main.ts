import chalk from 'chalk';
import { CommandFactory } from 'nest-commander';
import ora from 'ora';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    await CommandFactory.run(AppModule, {
      cliName: 'lohub',
      logger: false,
    });
  } catch (error) {
    console.log(chalk.red(`✘ ${error.message}`));
  }
}
bootstrap();
