import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import findUp from 'find-up';
import { constants } from 'fs';
import { access, mkdir, readFile, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { TokenDto } from 'src/auth/dto/token.dto';
import { forward } from 'src/utils/forward';
import { parse, stringify } from '@iarna/toml';
import { Config } from './config.dto';

@Injectable()
export class ConfigService {
  async isConfig(): Promise<boolean> {
    const directory = await this.getDirectory();
    if (directory === undefined) return false;
    try {
      await access(
        path.join(await this.getDirectory(), 'config.toml'),
        constants.R_OK | constants.W_OK,
      );
    } catch (error) {
      return false;
    }
    return true;
  }

  async isLoggedIn(): Promise<boolean> {
    const directory = await this.getDirectory();
    if (directory === undefined) return false;
    try {
      await access(
        path.join(await this.getDirectory(), 'login.json'),
        constants.R_OK | constants.W_OK,
      );
    } catch (error) {
      return false;
    }
    return true;
  }

  async config(): Promise<Config> {
    try {
      const buffer = await readFile(
        path.join(await this.getDirectory(), 'config.toml'),
      );
      const parsed = parse(buffer.toString());
      const config = plainToInstance(Config, parsed);
      await validateOrReject(config, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }).catch((error) => {
        console.log(error);
        throw new Error('lohub:Invalid config.');
      });
      return config;
    } catch (error) {
      console.log(error);
      forward(error, 'Error while reading config file.');
    }
  }

  async saveConfig(config: Config) {
    try {
      /* await validateOrReject(config, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }); */
      await this.initDirectory();
      await writeFile(
        path.join(await this.getDirectory(), 'config.toml'),
        stringify(instanceToPlain(config)),
      );
    } catch (error) {
      console.log(error);
      forward(error, 'Error while saving config file.');
    }
  }

  async login(): Promise<TokenDto> {
    try {
      const buffer = await readFile(
        path.join(await this.getDirectory(), 'login.json'),
      );
      const parsed = JSON.parse(buffer.toString());
      const login = plainToInstance(TokenDto, parsed);
      await validateOrReject(login, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }).catch(() => {
        throw new Error('lohub:Invalid login.');
      });
      return login;
    } catch (error) {
      forward(error, 'Error while reading login file.');
    }
  }

  async saveLogin(login: TokenDto) {
    try {
      await validateOrReject(login, {
        whitelist: true,
        forbidNonWhitelisted: true,
      }).catch(() => {
        throw new Error('lohub:Invalid login.');
      });
      await this.initDirectory();
      await writeFile(
        path.join(await this.getDirectory(), 'login.json'),
        JSON.stringify(login),
      );
    } catch (error) {
      forward(error, 'Error while saving login file.');
    }
  }

  async logout() {
    try {
      await unlink(path.join(await this.getDirectory(), 'login.json'));
    } catch (error) {
      forward(error, 'Error while deleting config file.');
    }
  }

  async getDirectory() {
    try {
      return await findUp(
        async (directory) => {
          const dirPath = path.join(directory, 'lohub');
          try {
            await access(dirPath, constants.R_OK | constants.W_OK);
          } catch (error) {
            return undefined;
          }
          return dirPath;
        },
        { type: 'directory' },
      );
    } catch (error) {
      forward(error, 'Error while finding config directory.');
    }
  }

  async projectOrReject() {
    if ((await this.getDirectory()) === undefined)
      throw new Error(
        'lohub:Configuration directory does not exist, please initialize project.',
      );
  }

  async initDirectory() {
    try {
      if ((await this.getDirectory()) === undefined) await mkdir('lohub');
    } catch (error) {
      forward(error, 'Error while creating config directory.');
    }
  }
}
