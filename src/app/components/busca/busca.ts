import { Component, inject } from '@angular/core';
import { BarraBusca } from "../shared/barra-busca/barra-busca";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, shareReplay, switchMap, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { CardMidia } from "../shared/card-midia/card-midia";

@Component({
  selector: 'app-busca',
  imports: [BarraBusca, AsyncPipe, CardMidia, NgClass],
  templateUrl: './busca.html'
})
export class Busca {
  private readonly route = inject(ActivatedRoute);
  private readonly midiaSevice = inject(MidiaService);
  private readonly router = inject(Router);
  protected readonly paginaSubject$ = new BehaviorSubject<number>(1);

  public buscar(query: string){
    this.router.navigate(['/busca'], {queryParams: { query }});
  }

  protected readonly queryParam$ = this.route.queryParamMap
  .pipe(
    filter((queryParams) => queryParams.has('query')),
      map(queryParams => queryParams.get('query')!),
  );

  protected readonly midiasSelecionadas$ = combineLatest(
    [this.paginaSubject$, this.queryParam$])
  .pipe(
    switchMap(([pagina, queryParam ]) => this.midiaSevice.pesquisarMidia(queryParam, pagina)),
    shareReplay({bufferSize: 1, refCount: true})
  )

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
    map(res => {
      const total = Math.max(1, res.total_pages ?? 1);
      const atual = Math.max(1, res.page ?? 1);
      const paginasExibidas = 6;

      let inicio = atual - Math.floor(paginasExibidas / 2);
      if (inicio < 1) inicio = 1;

      let final = inicio + paginasExibidas - 1;
      if(final > total){
        final = total;
        inicio = Math.max(1, final - paginasExibidas + 1);
      }

      const paginas: number[] = [];
      for(let i = inicio; i < final; i++) paginas.push(i);

      return{
        paginaAtual: atual,
        totalPaginas: total,
        paginas,
        mostrarInio: inicio > 1,
        mostrarFim: final < total
      };
    }), shareReplay({bufferSize: 1, refCount: true})
  )

    // métodos usados pelo template
  protected goToPage(p: number): void {
    this.paginaSubject$.next(p);
  }

  protected goToFirst(): void {
    this.paginaSubject$.next(1);
  }

  protected goToLast(total: number): void {
    this.paginaSubject$.next(total);
  }
}
