import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  Length,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
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
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  exists?: boolean;
}
