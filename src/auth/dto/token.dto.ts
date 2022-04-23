import { IsHexadecimal, IsJWT, IsString, IsUrl, Length } from 'class-validator';

export class TokenDto {
  @IsJWT()
  token: string;
  @Length(20)
  @IsHexadecimal()
  refresh: string;
  @IsUrl({ require_tld: false })
  server: string;
  @IsUrl({ require_tld: false })
  uiURL: string;
}
