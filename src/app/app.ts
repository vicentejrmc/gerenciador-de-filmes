import { Component, inject} from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { BannerPrincipal } from './components/banner-principal/banner-principal';
import { MidiaService } from './services/midia-service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { TipoMidia } from './models/tipo-midia';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, Navbar, BannerPrincipal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly midiaService = inject(MidiaService);
  protected readonly tipoMidia = TipoMidia;
  protected readonly midiasPopularesSubject$ = new BehaviorSubject<TipoMidia>(TipoMidia.Filme);

  protected  readonly midiasPopulares$ = this.midiasPopularesSubject$.pipe(
    switchMap((tipo) => this.midiaService.selecionarMidiasPopulares(tipo)),
    tap((v)=> console.log(v))
  );

  protected readonly midiasMaisVotadasSubject$ = new BehaviorSubject<TipoMidia>(TipoMidia.Filme);

  protected  readonly midiasMaisVotadas$ = this.midiasMaisVotadasSubject$.pipe(
    switchMap((tipo) => this.midiaService.selecionarMidiasMaisVotadas(tipo)),
    tap((v)=> console.log(v))
  );
}

