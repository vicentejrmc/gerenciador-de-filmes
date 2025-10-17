import { inject, Injectable } from '@angular/core';
import { MidiaApiResponse } from '../models/midia-api-response';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { TipoMidia } from '../models/tipo-midia';

@Injectable({
  providedIn: 'root'
})
export class MidiaService {
  private readonly http = inject(HttpClient);
  private readonly urlBase: string = 'https://api.themoviedb.org/3';

  public selecionarMidiasPopulares(tipo: TipoMidia) {
    const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';
    const url = `${this.urlBase}/${tipoSelecionado}/popular?language=pt-BR`;
    return this.buscarMidias(url);
  }

    public selecionarMidiasMaisVotadas(tipo: TipoMidia) {
      const tipoSelecionado = tipo === 'filme' ? 'movie' : 'tv';
      const url = `${this.urlBase}/${tipoSelecionado}/top_rated?language=pt-BR`;
      return this.buscarMidias(url);
  }

  public selecionarFilmesEmCartaz() {
    const url = `${this.urlBase}/movie/now_playing?language=pt-BR`;
    return this.buscarMidias(url);
  }

  //Método para buscar midias na api.
  private buscarMidias(url: string): Observable<MidiaApiResponse>{
    return this.http.get<MidiaApiResponse>(url, {
      headers: {Authorization: environment.apiKey},
    }).pipe(map((x) => ({...x, results: x.results.map((y) => ({...y,
        poster_path: 'https://image.tmdb.org/t/p/w500' + y.poster_path,
        backdrop_path: 'https://image.tmdb.org/t/p/original' + y.backdrop_path,
    }))})));
  }
}


