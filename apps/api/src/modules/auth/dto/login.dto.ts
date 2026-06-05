import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'willian@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'MinhaS3nha!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
