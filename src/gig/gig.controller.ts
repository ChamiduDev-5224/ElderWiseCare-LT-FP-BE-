import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GigService } from './gig.service';
import { CreateGigDto } from './dto/create-gig.dto';
import { UpdateGigDto } from './dto/update-gig.dto';

@Controller('gig')
export class GigController {
  constructor(private readonly gigService: GigService) {}

  @Post('add')
  create(@Body() createGigDto: CreateGigDto) {

    return this.gigService.create(createGigDto);
  }
  @Post('fetchCustomerGig')
  getCustomerGig(@Body('lat') latitude: any, @Body('userid') userId:number ,@Body('longtitite') longtiute: any, ) {

    return this.gigService.getGigs(latitude,userId,longtiute);
  }

  @Get()
  findAll() {
    return this.gigService.findAll();
  }

  
  @Get('userinfo/:id')
  userInfo(@Param('id') gigid: number) {
    return this.gigService.getUserInfoSelectedGig(gigid);
  }



  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gigService.findByUserId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return true;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gigService.remove(+id);
  }
}
