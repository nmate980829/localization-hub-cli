import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { AuthenticationApi, Configuration } from 'src/client';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  private loggedIn: (dto: TokenDto) => void;

  async login(dto: LoginDto) {
    try {
      const { server, access } = dto;
      const api = new AuthenticationApi(new Configuration(), server);
      const response = await api.authClaim({ access });
      const instance = plainToInstance(TokenDto, response.data.data);
      await validateOrReject(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (response.status != 201 || !response.data.data)
        throw new Error(
          'There was an error logging in to the server, please try again.',
        );
      this.loggedIn(instance);
    } catch (error) {
      console.log(chalk.red(`✘ ${error.message}`));
    }
  }

  waitForLogin(): Promise<TokenDto> {
    return new Promise<TokenDto>((resolve) => {
      this.loggedIn = resolve;
    });
  }
}
