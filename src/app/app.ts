import { Component} from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { RouterOutlet } from '@angular/router';
import { BarraBusca } from "./components/shared/barra-busca/barra-busca";

@Component({
  selector: 'app-root',
  imports: [Navbar, RouterOutlet, BarraBusca],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
}

