import { Component, inject} from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { BannerPrincipal } from './components/banner-principal/banner-principal';
import { MidiaService } from './services/midia-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, Navbar, BannerPrincipal],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly midiaService = inject(MidiaService);

  protected  readonly midiasPopulares$ = this.midiaService
  .selecionarMidiasPopulares();
}

