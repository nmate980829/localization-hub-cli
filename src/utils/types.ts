export enum DiffType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export interface Diff {
  type: DiffType;
  path: string[];
}

export enum CollosionType {
  ORPHAN = 'ORPHAN',
  PARENT = 'PARENT',
}

export interface Collosion {
  type: CollosionType;
  path: string[];
}

export type JsonObject = Record<string, unknown>;
