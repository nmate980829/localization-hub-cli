import { Injectable, OnModuleInit } from '@nestjs/common';
import ora, { Ora } from 'ora';

@Injectable()
export class OraService implements OnModuleInit {
  private spinner: Ora;

  onModuleInit() {
    this.spinner = ora({ spinner: 'simpleDots' });
  }
  start(text?: string) {
    this.spinner.start(text || 'Loading...');
  }
  clear() {
    this.spinner.stop();
  }
  succeed(text: string) {
    this.spinner.succeed(text);
  }
  fail(text: string) {
    this.spinner.fail(text);
  }
  throw(text: string) {
    this.spinner.clear();
    throw new Error(text);
  }
}
