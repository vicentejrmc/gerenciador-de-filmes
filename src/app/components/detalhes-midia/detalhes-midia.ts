import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap,} from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { TipoMidia } from '../../models/tipo-midia';

@Component({
  selector: 'app-detalhes-midia',
  imports: [],
  templateUrl: './detalhes-midia.html'
})
export class DetalhesMidia {
  protected readonly route = inject(ActivatedRoute);
  protected readonly midiaService = inject(MidiaService);

  protected readonly params$ = this.route.paramMap.pipe(
    map(params => ({
      TipoMidia: params.get('tipoMidia') as TipoMidia,
      idMidia: Number(params.get('idMidia'))
    })),
    filter(({ TipoMidia, idMidia }) => !!TipoMidia && !isNaN(idMidia)),
      switchMap(({ TipoMidia, idMidia }) =>
        this.midiaService.buscarDetalhesMidia(TipoMidia!, idMidia))
  ).subscribe();


}
