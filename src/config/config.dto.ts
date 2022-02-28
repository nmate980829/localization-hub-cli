import {
  IsArray,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class Config {
  @IsUrl()
  server: string;
  @IsPositive()
  projectId: number;
  @MaxLength(128)
  parser: string;
  @IsString()
  output: string;
  @IsOptional()
  @IsString()
  defaultLanguage?: string;
  @IsArray()
  @MaxLength(128, {
    each: true,
  })
  languages: string[];
  @IsString()
  head: string;
  @IsArray()
  @MaxLength(128, {
    each: true,
  })
  branches: string[];
}
