import {
  IsString,
  IsEmail,
  IsOptional,
  Matches,
  Length,
  IsBoolean,
} from 'class-validator';

export class FindUserParam {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  _id?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @IsString()
  @Length(8, 10)
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  @IsOptional()
  phone?: number;

  @IsBoolean()
  @IsOptional()
  exists?: boolean;
}
