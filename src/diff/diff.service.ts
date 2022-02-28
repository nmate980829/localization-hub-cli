import { Injectable } from '@nestjs/common';
import { IdentifierEntity, LanguagesApi } from 'src/client';
import { ConfigService } from 'src/config/config.service';
import { FetchService } from 'src/fetch/fetch.service';
import { Collosion, Diff, DiffType, JsonObject } from 'src/utils/types';

@Injectable()
export class DiffService {
  constructor(
    private readonly config: ConfigService,
    private readonly fetch: FetchService,
  ) {}
  async command() {
    const configFile = await this.config.config();
    const login = await this.config.login();
    const api = new LanguagesApi();
  }
  async conflicts(): Promise<Collosion[]> {
    return [];
  }
  async up(): Promise<Diff[]> {
    const tree = await this.fetch.getTree();
    const history = await this.fetch.getHistory();
    return this.collideUp(tree, history, []);
  }
  collideUp(
    up: IdentifierEntity[],
    local: IdentifierEntity[],
    parent: string[],
  ): Diff[] {
    const diffs: Diff[] = [];
    const upKeys: Record<string, IdentifierEntity> = {};
    const localKeys: Record<string, IdentifierEntity> = {};
    up.forEach((x) => (upKeys[x.key] = x));
    local.forEach((x) => (localKeys[x.key] = x));
    const intersection = [];
    for (let i = 0; i < up.length; i++) {
      const key = up[i].key;
      if (localKeys[key] === undefined) {
        diffs.push({ type: DiffType.ADD, path: [...parent, key] });
      } else {
        intersection.push(key);
      }
    }
    for (let i = 0; i < local.length; i++) {
      const key = local[i].key;
      if (upKeys[key] === undefined) {
        diffs.push({ type: DiffType.REMOVE, path: [...parent, key] });
      }
    }
    intersection.forEach((x) =>
      diffs.push(
        ...this.collideUp(upKeys[x].children, localKeys[x].children, [
          ...parent,
          x,
        ]),
      ),
    );
    return diffs;
  }
  async down(): Promise<Diff[]> {
    const parsed = await this.fetch.parse();
    const history = await this.fetch.getHistory();
    return this.collideDown(parsed, history, []);
  }
  collideDown(
    down: JsonObject,
    local: IdentifierEntity[],
    parent: string[],
  ): Diff[] {
    const diffs: Diff[] = [];
    const downKeys: string[] = Object.keys(down);
    const localKeys: Record<string, IdentifierEntity> = {};
    local.forEach((x) => (localKeys[x.key] = x));
    const intersection = [];
    for (let i = 0; i < downKeys.length; i++) {
      const key = downKeys[i];
      if (localKeys[key] === undefined) {
        diffs.push({ type: DiffType.ADD, path: [...parent, key] });
      } else {
        intersection.push(key);
      }
    }
    for (let i = 0; i < local.length; i++) {
      const key = local[i].key;
      if (down[key] === undefined) {
        diffs.push({ type: DiffType.REMOVE, path: [...parent, key] });
      }
    }
    intersection.forEach((x) => {
      const ent = down[x];
      const pass: JsonObject = this.isRecord(ent) ? ent : ({} as JsonObject);
      diffs.push(
        ...this.collideDown(pass, localKeys[x].children, [...parent, x]),
      );
    });
    return diffs;
  }
  isRecord(obj): obj is JsonObject {
    return obj !== false && typeof obj === 'object';
  }
}
