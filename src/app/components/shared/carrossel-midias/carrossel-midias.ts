import { Component, Input } from '@angular/core';
import { Midia } from '../../../models/midia-api-response';
import { RouterLink } from '@angular/router';
import { TipoMidia } from '../../../models/tipo-midia';
import { DetalhesMidia } from '../../detalhes-midia/detalhes-midia';

@Component({
  selector: 'app-carrossel-midias',
  imports: [RouterLink,],
  templateUrl: './carrossel-midias.html',
})
export class CarrosselMidias{
  @Input({required: true}) public tipoMidia: TipoMidia = TipoMidia.Filme;
  @Input({required: true}) public midias: Midia[] = [];
  public detalhes!: DetalhesMidia;
}
