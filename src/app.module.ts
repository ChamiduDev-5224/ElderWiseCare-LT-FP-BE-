import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'school_management',
      entities: [Student, Subject, Teacher],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Student, Subject, Teacher]),
    ,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
