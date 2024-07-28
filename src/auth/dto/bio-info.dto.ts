import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BioInfoDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  prefix: number;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  telephone: number;

  @IsNumber()
  @IsNotEmpty()
  gender: number;

  @IsNumber()
  @IsNotEmpty()
  userType: number;

  @IsNumber()
  @IsNotEmpty()
  province: number;

  @IsNumber()
  @IsNotEmpty()
  district: number;

  @IsNumber()
  @IsNotEmpty()
  city: number;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber({ maxDecimalPlaces: 10 })
  @IsNotEmpty()
  latitude: number;

  @IsNumber({ maxDecimalPlaces: 10 })
  @IsNotEmpty()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  zipcode: number;

  @IsString()
  imageUrl: string;
  @IsOptional()
  image: any;
}
