import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap,} from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-detalhes-midia',
  imports: [AsyncPipe],
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
        this.midiaService.buscarDetalhesMidia(TipoMidia!, idMidia))
  );

  protected readonly videos$ = this.detalhes$.pipe(
    switchMap(detalhes => this.midiaService.buscarVideoPorId(detalhes.type, detalhes.id))
  );
}
