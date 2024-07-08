import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Movie, PopularMoviesResponse } from 'src/types/movie.interface';

@Injectable()
export class TmdbService {
  private get TMDB_API_READ_ACCESS_TOKEN(): string {
    return this.configService.get<string>('TMDB_API_READ_ACCESS_TOKEN');
  }

  private get TMDB_URL(): string {
    return 'https://api.themoviedb.org/3';
  }

  constructor(
    private readonly configService: ConfigService,
  ) {}

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.TMDB_API_READ_ACCESS_TOKEN}`,
      Accept: 'application/json',
    };
  }

  async getPopularMovies(): Promise<Movie[]> {
    const response: AxiosResponse<PopularMoviesResponse> = await axios.get<PopularMoviesResponse>(`${this.TMDB_URL}/movie/popular`, {
      headers: this.getHeaders(),
    });
    return response.data.results;
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response: AxiosResponse<Movie> = await axios.get<Movie>(`${this.TMDB_URL}/movie/${movieId}`, {
      headers: this.getHeaders(),
    });
    return response.data;
  }
}