import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, shareReplay, switchMap,} from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { AsyncPipe } from '@angular/common';
import { IconeAvaliacao } from "../shared/icone-avaliacao/icone-avaliacao";

@Component({
  selector: 'app-detalhes-midia',
  imports: [AsyncPipe, IconeAvaliacao],
  templateUrl: './detalhes-midia.html'
})
export class DetalhesMidia {
  protected readonly route = inject(ActivatedRoute);
  protected readonly midiaService = inject(MidiaService);

  protected readonly detalhes$ = this.route.paramMap.pipe(
    map(params => ({
      TipoMidia: params.get('tipoMidia') as TipoMidia,
      idMidia: Number(params.get('idMidia'))
    })),
    filter(({ TipoMidia, idMidia }) => !!TipoMidia && !isNaN(idMidia)),
      switchMap(({ TipoMidia, idMidia }) =>
        this.midiaService.buscarDetalhesMidia(TipoMidia!, idMidia)),
      shareReplay({bufferSize: 1, refCount: true})
// shareReplay impede que seja duplicada(indica que a fonte(cache) do Observable seja compartilhada)
  );

  protected readonly videos$ = this.detalhes$.pipe(
    switchMap(detalhes => this.midiaService.buscarVideoPorId(detalhes.media_type, detalhes.id))
  );

  protected readonly creditos$ = this.detalhes$.pipe(
    switchMap((detalhes) =>
      this.midiaService.selecionarCreditosPorId(detalhes.media_type, detalhes.id)
    )
  );
}
