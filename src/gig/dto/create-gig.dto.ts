import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGigDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  serviceArea: string;
  
  @IsArray()
  @ArrayNotEmpty()  
  serviceList: string[];  
  
}
