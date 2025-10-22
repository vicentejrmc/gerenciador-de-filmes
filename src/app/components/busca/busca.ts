import { Component, inject } from '@angular/core';
import { BarraBusca } from "../shared/barra-busca/barra-busca";
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { CardMidia } from "../shared/card-midia/card-midia";

@Component({
  selector: 'app-busca',
  imports: [BarraBusca, AsyncPipe, CardMidia],
  templateUrl: './busca.html'
})
export class Busca {
  private readonly route = inject(ActivatedRoute);
  private readonly midiaSevice = inject(MidiaService);

  protected readonly queryParam$ = this.route.queryParamMap
  .pipe(
    filter((queryParams) => queryParams.has('query')),
      map(queryParams => queryParams.get('query')!),
  );

  protected readonly midiasSelecionadas$ = this.queryParam$
  .pipe(
    switchMap(queryParam => this.midiaSevice.pesquisarMidia(queryParam)),
    shareReplay({bufferSize: 1, refCount: true}) // impede duplicidade de chamada
  );

  protected readonly filmesEncontrados =  this.midiasSelecionadas$
  .pipe(
    map(midias => midias.results.filter((r) => r.media_type === TipoMidia.Filme))
    ,tap((midias) => console.log(midias))
  );

  protected readonly seriesEncontradas =  this.midiasSelecionadas$
  .pipe(
    map(midias => midias.results.filter((r) => r.media_type === TipoMidia.Tv))
    ,tap((midias) => console.log(midias))
  );

  protected readonly paginasDisponiveis$ = this.midiasSelecionadas$
  .pipe(
    map(res => ({paginaAtual: res.page, totalPaginas: res.total_pages}))
  );

}
