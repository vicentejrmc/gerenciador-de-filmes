import { Component } from '@angular/core';
import { BarraBusca } from "../shared/barra-busca/barra-busca";

@Component({
  selector: 'app-banner-principal',
  imports: [BarraBusca],
  templateUrl: './banner-principal.html',
})
export class BannerPrincipal {
  public buscar(query: string){
    console.log(query)
  }
}
