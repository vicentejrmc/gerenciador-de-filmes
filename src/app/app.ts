import { Component} from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { Inicio } from "./components/inicio/inicio";

@Component({
  selector: 'app-root',
  imports: [Navbar, Inicio],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App{
}

