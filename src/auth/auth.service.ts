import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SignupDto } from './dto/signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rate } from 'src/entities/rate.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
 
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(createAuthDto: SignupDto): Promise<any> {
    const { userName, email, password } = createAuthDto;

    const emailalreadyTaken =await this.userRepository.existsBy({email:email});
    const userNameAlreadyTaken =await this.userRepository.existsBy({unm:userName});

    if(emailalreadyTaken){
      return {
        message: 'Email is already existed.',
        sts: 2,
      }
    }
    if(userNameAlreadyTaken){
      return {
        message: 'Username is already existed.',
        sts: 2,
      }
    }
    const hashPwd = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      unm: userName,
      email: email,
      pwd: hashPwd,
    });

    try {
      await this.userRepository.save(user);

      return {
        message: 'User successfully registered',
        sts: 1,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
}
