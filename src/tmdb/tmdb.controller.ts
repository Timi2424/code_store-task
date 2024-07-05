import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { TmdbService } from './tmdb.service';
import { PdfService } from './pdf.service';

@Controller('movies')
export class TmdbController {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly pdfService: PdfService,
  ) {}

  @Get('/')
  async getPopularMovies(@Res() res: Response) {
    try {
      const movies = await this.tmdbService.getPopularMovies();
      const pdfBuffer = await this.pdfService.generatePopularMoviesPdf(movies);

      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('/:id')
  async getMovieDetails(@Param('id') id: number, @Res() res: Response) {
    try {
      const movie = await this.tmdbService.getMovieDetails(id);
      const pdfBuffer = await this.pdfService.generateMovieDetailsPdf(movie);

      res.contentType('application/pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error(`Error fetching movie details for ID ${id}:`, error);
      res.status(500).send('Internal Server Error');
    }
  }
}