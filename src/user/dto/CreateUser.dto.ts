import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  @IsOptional()
  phone?: number;

  @Length(8, 20)
  @IsNotEmpty()
  password: string;
}
