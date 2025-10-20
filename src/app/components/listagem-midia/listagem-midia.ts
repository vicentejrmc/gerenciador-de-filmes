import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap } from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoColecaoMidia } from '../../models/tipo-colecao-midia';
import { TipoMidia } from '../../models/tipo-midia';

@Component({
  selector: 'app-listagem-midia',
  imports: [AsyncPipe],
  templateUrl: './listagem-midia.html'
})
export class ListagemMidia {
  private readonly route = inject(ActivatedRoute);
  private readonly midiaService = inject(MidiaService);

  protected readonly params$ = this.route.paramMap.pipe(
    filter(params => params.has('tipoMidia') && params.has('tipoColecaoMidia')),
    map((params) => {
      const tipoMidia = params.get('tipoMidia')!;
      const tipoColecaoMidia = params.get('tipoColecaoMidia')!;

      if(!tipoMidia || !tipoColecaoMidia )
        throw new Error('Parametro de roda não encontrado.')

      return{tipoMidia, tipoColecaoMidia};
    }),
    shareReplay({bufferSize: 1, refCount: true})
  );

  protected readonly midiasSelecionadas$ = this.params$.pipe(
    switchMap((paramns) => {
      if(paramns.tipoColecaoMidia === TipoColecaoMidia.Populares)
        return this.midiaService.selecionarMidiasPopulares(paramns.tipoMidia as TipoMidia);
      else return this.midiaService.selecionarMidiasMaisVotadas(paramns.tipoMidia as TipoMidia);

    }
  ))
}
