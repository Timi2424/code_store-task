import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Movie, PopularMoviesResponse } from 'src/types/movie.interface';

@Injectable()
export class TmdbService {
  private readonly TMDB_API_READ_ACCESS_TOKEN: string;
  private readonly TMDB_URL: string
  constructor(
    private readonly configService: ConfigService,
  ) {
    this.TMDB_API_READ_ACCESS_TOKEN = this.configService.get<string>('TMDB_API_READ_ACCESS_TOKEN');
    this.TMDB_URL = 'https://api.themoviedb.org/3'
  }

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