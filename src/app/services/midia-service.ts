import { inject, Injectable } from '@angular/core';
import { MidiaApiResponse } from '../models/midia-api-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { TipoMidia } from '../models/tipo-midia';
import { DetalhesMidiaModel } from '../models/detalhes-midia';
import { VideosApiResponse } from '../models/videos-api-response';
import { DomSanitizer } from '@angular/platform-browser';

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
        type: tipo,
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

  // --- Métodos auxiliares ---
  private buscarMidias(url: string, tipoMidia: TipoMidia): Observable<MidiaApiResponse> {
    return this.http.get<MidiaApiResponse>(url, this.getAuthHeaders()).pipe(
      map((x) => ({
        ...x,
        type: tipoMidia,
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


}


