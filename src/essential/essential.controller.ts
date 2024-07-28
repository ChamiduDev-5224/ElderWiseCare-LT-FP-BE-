import { Controller, Get } from '@nestjs/common';
import { EssentialService } from './essential.service';

@Controller('essential')
export class EssentialController {
  constructor(private readonly essentialService: EssentialService) {}

  @Get('location')
  async getData() {
    return await this.essentialService.getDataFromTable();
  }
}
