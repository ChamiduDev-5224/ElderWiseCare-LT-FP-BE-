import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Rate } from './entities/rate.entity';
import { EssentialModule } from './essential/essential.module';
import { EssentialService } from './essential/essential.service';
import { EssentialController } from './essential/essential.controller';
import { Gig } from './entities/gig.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the ConfigModule globally available
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User,Gig,Rate],
        synchronize: true,
      }),

      inject: [ConfigService],
    }),
    AuthModule,
    EssentialModule,
  ],
  controllers: [AppController,EssentialController],
  providers: [AppService,EssentialService],
})
export class AppModule {
  
}
