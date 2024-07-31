import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { BioInfoDto } from './dto/bio-info.dto';

@Injectable()
export class AuthService {
  private readonly s3: AWS.S3;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectEntityManager() private entityManager: EntityManager,
    private readonly dataSource: DataSource
  ) {
    // this.s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    //   httpOptions: {
    //     timeout: 30000, // Increase the timeout to 30 seconds
    //     connectTimeout: 5000, // Increase the connection timeout to 5 seconds
    //   },
    // });

    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async signup(createAuthDto: SignupDto): Promise<any> {
    const { userName, email, password } = createAuthDto;

    const emailAlreadyTaken = await this.userRepository.findOne({
      where: { email },
    });
    const userNameAlreadyTaken = await this.userRepository.findOne({
      where: { unm: userName },
    });

    if (emailAlreadyTaken) {
      return {
        message: 'Email already exists.',
        sts: 2,
      };
    }
    if (userNameAlreadyTaken) {
      return {
        message: 'Username already exists.',
        sts: 2,
      };
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      unm: userName,
      email,
      pwd: hashPwd,
    });

    try {
      await this.userRepository.save(user);
      return {
        message: 'User successfully registered',
        sts: 1,
        data: {
          userName,
          email,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const getData = await this.userRepository.findOne({ where: { email } });

    if (!getData) {
      return { sts: 2, message: "Email doesn't match." };
    }

    const pwdMatching = await bcrypt.compare(password, getData.pwd);

    if (!pwdMatching) {
      return { sts: 2, message: "Password doesn't match." };
    }

    return this.generateUserTokens(email);
  }

  async generateUserTokens(userEmail: string) {
    const accessToken = this.jwtService.sign(
      { email: userEmail },
      { expiresIn: '1h' },
    );
    const refreshToken = this.jwtService.sign(
      { email: userEmail },
      { expiresIn: '1h' },
    );

    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    
    let userSts: number = 0;
    if (user) {
      userSts = user.sts;
    }
    return { accessToken, refreshToken, userEmail, userSts };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    try {
      const payload = this.jwtService.verify(refreshToken);
      return this.generateUserTokens(payload.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('File is undefined');
    }

    const fileName = `${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };


    try {
      const data = await this.s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      throw new Error('Error uploading to S3');
    }
  }

  async getUserDetailsFromToken(token: string) {
    try {
      const decodedToken = this.jwtService.verify(token);

      const { email } = decodedToken;

      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const citiesQuery = "SELECT name_en FROM cities WHERE id=? LIMIT 1";
      const CITY = await this.dataSource.query(citiesQuery, [user.cty]);
  
      const districtQuery =  "SELECT name_en FROM districts WHERE id=? LIMIT 1";
      const DISTRICT = await this.dataSource.query(districtQuery, [user.dis]);


      // Return user details as needed
      return {
        id: user.uid,
        email: user.email,
        imgUrl: user.imu,
        userName: user.unm,
        fname:user.fnm,
        lname:user.lnm,
        sts: user.sts,
        type:user.utp,
        lat:user.lat,
        longtitite: user.lgt,
        street:user.str,
        zipCode:user.zcd,
        cty:CITY[0]?.name_en,
        district:DISTRICT[0]?.name_en

        // Other user details you might need
      };
    } catch (error) {
      console.log(error);
      
      throw new UnauthorizedException('Invalid token');
    }
  }

  async bioFormSubmit(bioInfo: BioInfoDto): Promise<any> {
    const {
      email,
      prefix,
      firstName,
      lastName,
      telephone,
      gender,
      userType,
      province,
      district,
      city,
      latitude,
      longitude,
      zipcode,
      street,
      imageUrl,
    } = bioInfo;

    // Find the user by email
    const user = await this.userRepository.findOneBy({ email });

    // If user is not found, handle the error appropriately
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    user.prf = prefix;
    user.fnm = firstName;
    user.lnm = lastName;
    user.tep = telephone;
    user.gen = gender;
    user.utp = userType;
    user.prn = province;
    user.dis = district;
    user.cty = city;
    user.str = street;
    user.zcd = zipcode;
    user.lat = latitude;
    user.lgt = longitude;
    user.imu = imageUrl;
    user.sts = 1;
    // Save the updated user
    await this.userRepository.save(user);

    return user;
  }

}
