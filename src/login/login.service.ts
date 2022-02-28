import { Injectable, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import chalk from 'chalk';
import { plainToInstance } from 'class-transformer';
import { isURL, validateOrReject } from 'class-validator';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { TokenDto } from 'src/auth/dto/token.dto';
import { Configuration, TokensApi } from 'src/client';
import { ConfigService } from 'src/config/config.service';
import os from 'os';
import { OraService } from 'src/ora/ora.service';
import open from 'open';

@Injectable()
export class LoginService {
  constructor(
    private readonly config: ConfigService,
    private readonly spinner: OraService,
  ) {}

  async loginCommand(inputs: string[], options?: Record<string, any>) {
    this.spinner.start('Waiting for login. Please login in the opened tab.');
    try {
      if (await this.config.isLoggedIn()) {
        await this.refresh();
        return;
      }
      const server = await this.getServer(options.server);
      await this.login(server);
    } catch (error) {
      this.spinner.throw(error.message);
    }
    this.spinner.succeed('Successfully logged in!');
  }

  async getServer(server?: string): Promise<string> {
    if (server && !isURL(server)) this.spinner.throw('Parameter is not a URL');

    if (!(await this.config.isConfig()) && !server)
      this.spinner.throw('There were no server information provided.');

    if (await this.config.isConfig())
      return (await this.config.config()).server;
    return server;
  }

  async login(server: string) {
    try {
      const app = await NestFactory.create(AuthModule, {
        logger: new Logger(),
      });
      await app.listen(0);
      const service = app.get(AuthService);
      open(
        `${server}/login/cli?hostname=${os.hostname()}&port=${
          app.getHttpServer().address().port
        }`,
      );
      this.config.saveLogin(await service.waitForLogin());
      await app.close();
    } catch (error) {
      this.spinner.throw(error.message);
    }
  }

  async refresh() {
    const login = await this.config.login();
    const api = new TokensApi(
      new Configuration({ accessToken: login.token }),
      login.server,
    );
    const response = await api.tokensRefresh({ refresh: login.refresh });
    const instance = plainToInstance(TokenDto, response.data.data);
    await validateOrReject(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (response.status != 201 || !response.data.data)
      this.spinner.throw(
        'There was an error logging in to the server, please try again.',
      );
    await this.config.saveLogin(instance);
    this.spinner.succeed('Successfully logged in!');
  }
}
