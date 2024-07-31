import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BioInfoDto } from './dto/bio-info.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, ) {}

  @Post('signup')
  create(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    try {
      const uploadedFile = await this.authService.uploadFile(file);      
      return uploadedFile;
    } catch (error) {
      console.error('Error in controller:', error);
      throw new Error('Error uploading to S3');
    }
  }


  @Get('profile')
  async getUserProfile(@Headers('Authorization') token: string) {
    const accessToken = token.split(' ')[1]; // Assuming Bearer token format
    const userDetails = await this.authService.getUserDetailsFromToken(accessToken);
    return userDetails; 
  }


  @Post('reg-form')
  regForm(@Body() regForm: BioInfoDto): Promise<any> {
    return this.authService.bioFormSubmit(regForm);
  }
}
