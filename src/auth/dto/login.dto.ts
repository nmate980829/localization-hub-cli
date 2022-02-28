import { IsHexadecimal, IsUrl, Length } from 'class-validator';

export class LoginDto {
  @Length(20)
  @IsHexadecimal()
  access: string;
  @IsUrl({ require_tld: false })
  server: string;
}
