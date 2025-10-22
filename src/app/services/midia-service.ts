import { inject, Injectable } from '@angular/core';
import { MidiaApiResponse, ResultadoBuscaApiResponse } from '../models/midia-api-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { TipoMidia } from '../models/tipo-midia';
import { DetalhesMidiaModel } from '../models/detalhes-midia';
import { VideosApiResponse } from '../models/videos-api-response';
import { DomSanitizer } from '@angular/platform-browser';
import { CreditosApiResponse } from '../models/creditos-api-response';
import { traduzirTipoMidia } from '../util/traduzir-tipo-midia';

@Injectable({
  providedIn: 'root'
})
export class MidiaService {
  private readonly http = inject(HttpClient);
  private readonly urlBase: string = 'https://api.themoviedb.org/3';
  private readonly domSanitizer = inject(DomSanitizer);

  public selecionarMidiasPopulares(tipo: TipoMidia) {
    const tipoSelecionado = this.converterTipoParaApi(tipo);
    const url = `${this.urlBase}/${tipoSelecionado}/popular?language=pt-BR`;
    return this.buscarMidias(url, tipo);
  }

    public selecionarMidiasMaisVotadas(tipo: TipoMidia) {
      const tipoSelecionado = this.converterTipoParaApi(tipo);
      const url = `${this.urlBase}/${tipoSelecionado}/top_rated?language=pt-BR`;
      return this.buscarMidias(url, tipo);
  }

  public selecionarFilmesEmCartaz() {
    const url = `${this.urlBase}/movie/now_playing?language=pt-BR`;
    return this.buscarMidias(url, TipoMidia.Filme);
  }

  public buscarDetalhesMidia(tipo: TipoMidia, idMidia: number): Observable<DetalhesMidiaModel> {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';
    const url = `${this.urlBase}/${tipoSelecionado}/${idMidia}?language=pt-BR`;

    return this.http.get<DetalhesMidiaModel>(url, this.getAuthHeaders()).pipe(
      map((x) => ({
        ...x,
        media_type: tipo,
        vote_average: x.vote_average * 10,
        poster_path: x.poster_path ? 'https://image.tmdb.org/t/p/w500' + x.poster_path : '',
        backdrop_path: x.backdrop_path ? 'https://image.tmdb.org/t/p/original' + x.backdrop_path : '',
      }))
    );
  }

  public buscarVideoPorId(tipo: TipoMidia, idMidia: number): Observable<VideosApiResponse> {
    const tipoSelecionado = this.converterTipoParaApi(tipo)
    const url = `${this.urlBase}/${tipoSelecionado}/${idMidia}/videos?language=pt-BR`;
    return this.http.get<VideosApiResponse>(url, this.getAuthHeaders())
    .pipe(map(res => this.buscarVideosYoutube(res)))
  }

  public selecionarCreditosPorId(tipo: TipoMidia, idMidia: number): Observable<CreditosApiResponse> {
    const url = `${this.urlBase}/${traduzirTipoMidia(tipo)}/${idMidia}/credits?language=pt-BR`;

  return this.http.get<CreditosApiResponse>(url, this.getAuthHeaders())
    .pipe(map(res => this.buscarCreditosMidia(res)));
}

  public pesquisarMidia(query: string): Observable<ResultadoBuscaApiResponse>{
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&language=pt-BR`;

    return this.http.get<ResultadoBuscaApiResponse>(url, this.getAuthHeaders())
    .pipe(map((res) => this.resultPesquisarMidias(res)));
  }

  // --- Métodos auxiliares ---
  private resultPesquisarMidias(x: ResultadoBuscaApiResponse): ResultadoBuscaApiResponse {
    return {
      ...x,
      results: x.results.map((y) => ({
        ...y,
        media_type: (y.media_type.toString() === 'movie' ? 'filme' : 'tv') as TipoMidia,
        poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
        backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
      })),
    };
  }

  private buscarMidias(url: string, tipoMidia: TipoMidia): Observable<MidiaApiResponse> {
    return this.http.get<MidiaApiResponse>(url, this.getAuthHeaders()).pipe(
      map((x) => ({
        ...x,
        media_type: tipoMidia,
        results: x.results.map((y) => ({
          ...y,
          poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
          backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
        })),
      }))
    );
  }

  public converterTipoParaApi(tipo: TipoMidia): 'movie' | 'tv' {
    return tipo === TipoMidia.Filme ? 'movie' : 'tv';
  }

  private getAuthHeaders(): { headers: { Authorization: string } } {
    return {
      headers: {
        Authorization: environment.apiKey,
      },
    };
  }

  private buscarVideosYoutube(x: VideosApiResponse): VideosApiResponse{
    return {
    ...x,
    results: x.results
      .filter(v => v.site.toLowerCase() === 'youtube')
      .map(v => ({
        ...v,
        key: this.domSanitizer.bypassSecurityTrustResourceUrl(
          'https://www.youtube.com/embed/' + v.key
        ),
      })),
  };
  }

  private buscarCreditosMidia(x: CreditosApiResponse): CreditosApiResponse {
    return {
      ...x,
      cast: x.cast.map((y) => ({
        ...y,
        profile_path: y.profile_path
          ? 'https://image.tmdb.org/t/p/w300/' + y.profile_path
          : '/img/placeholder-person.webp',
      })),
      crew: x.crew.map((y) => ({
        ...y,
        profile_path: y.profile_path
          ? 'https://image.tmdb.org/t/p/w300/' + y.profile_path
          : '/img/placeholder-person.webp',
      })),
    };
  }
}


