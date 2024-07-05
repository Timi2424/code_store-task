import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { PdfService } from './pdf.service';

@Module({
  imports: [HttpModule],
  controllers: [TmdbController],
  providers: [TmdbService, PdfService],
})
export class TmdbModule {}
