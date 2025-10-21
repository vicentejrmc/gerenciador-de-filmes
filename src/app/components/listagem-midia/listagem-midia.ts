import { filter, map, shareReplay, switchMap, tap, distinctUntilChanged } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TipoColecaoMidia } from '../../models/tipo-colecao-midia';
import { TipoMidia } from '../../models/tipo-midia';
import { MidiaService } from '../../services/midia-service';
import { CardMidia } from '../shared/card-midia/card-midia';
import { BarraBusca } from "../shared/barra-busca/barra-busca";


@Component({
  selector: 'app-listagem-midia',
  imports: [AsyncPipe, CardMidia, BarraBusca],
  templateUrl: './listagem-midia.html',
})
export class ListagemMidia {
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private readonly midiaService = inject(MidiaService);

  protected readonly params$ = this.route.paramMap.pipe(
    filter((params) => params.has('tipoMidia') && params.has('tipoColecaoMidia')),
    map((params) => {
      const tipoMidia = params.get('tipoMidia')!;
      const tipoColecaoMidia = params.get('tipoColecaoMidia')!;

      if (!tipoMidia || !tipoColecaoMidia)
        throw new Error('Não foi possível ler os parâmetros de rota.');

      return {
        tipoMidia: tipoMidia as TipoMidia,
        tipoColecaoMidia: tipoColecaoMidia as TipoColecaoMidia,
      };
    }),
    // evita re-execução quando os mesmos parâmetros são emitidos em sequência
    distinctUntilChanged(
      (a, b) =>
        a.tipoMidia === b.tipoMidia && a.tipoColecaoMidia === b.tipoColecaoMidia
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected readonly cabecalhoMidiasSelecionadas$ = this.params$.pipe(
    map((params) => {
      const tipoMidia = params.tipoMidia === TipoMidia.Filme ? 'Filmes' : 'Séries';

      const tipoColecaoMidia =
        params.tipoColecaoMidia === TipoColecaoMidia.Populares
          ? 'Populares'
          : tipoMidia === 'Filmes'
          ? 'Mais Votados'
          : 'Mais Votadas';

      return { tipoMidia: tipoMidia, tipoColecaoMidia: tipoColecaoMidia };
    }),
    tap((params) =>
      this.title.setTitle(`Listagem de ${params.tipoMidia} ${params.tipoColecaoMidia} | MMDb`)
    )
  );

  protected readonly midiasSelecionadas$ = this.params$.pipe(
    switchMap((params) => {
      if (params.tipoColecaoMidia === TipoColecaoMidia.Populares)
        return this.midiaService.selecionarMidiasPopulares(params.tipoMidia);
      else
        return this.midiaService.selecionarMidiasMaisVotadas(params.tipoMidia);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
