import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TmdbService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('TMDB_API_KEY');
    this.baseUrl = this.configService.get<string>('TMDB_URL')
  }

  async getPopularMovies(): Promise<any[]> {
    const response = await axios.get(`${this.baseUrl}/movie/popular?api_key=${this.apiKey}`);
    return response.data.results;
  }

  async getMovieDetails(movieId: number): Promise<any> {
    const response = await axios.get(`${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`);
    return response.data;
  }
}