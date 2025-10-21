import { Component, inject } from '@angular/core';
import { BannerPrincipal } from "../banner-principal/banner-principal";
import { TipoMidia } from '../../models/tipo-midia';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { MidiaService } from '../../services/midia-service';
import { CarrosselMidias } from "../shared/carrossel-midias/carrossel-midias";
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-inicio',
  imports: [AsyncPipe, BannerPrincipal, CarrosselMidias],
  templateUrl: './inicio.html'
})
export class Inicio {
  protected readonly midiaService = inject(MidiaService);
  protected readonly tipoMidia = TipoMidia;
  protected readonly midiasPopularesSubject$ = new BehaviorSubject<TipoMidia>(TipoMidia.Filme);

  protected  readonly midiasPopulares$ = this.midiasPopularesSubject$.pipe(
    switchMap((tipo) => this.midiaService.selecionarMidiasPopulares(tipo)),
    tap(midias => console.log(midias) )
  );

  protected readonly midiasMaisVotadasSubject$ = new BehaviorSubject<TipoMidia>(TipoMidia.Filme);

  protected  readonly midiasMaisVotadas$ = this.midiasMaisVotadasSubject$.pipe(
    switchMap((tipo) => this.midiaService.selecionarMidiasMaisVotadas(tipo))
  );

  protected  readonly filmesEmCartaz$ = this.midiaService.selecionarFilmesEmCartaz();
}
