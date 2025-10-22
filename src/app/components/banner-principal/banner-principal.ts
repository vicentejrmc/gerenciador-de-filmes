import { Component, inject } from '@angular/core';
import { BarraBusca } from "../shared/barra-busca/barra-busca";
import { Router,} from '@angular/router';

@Component({
  selector: 'app-banner-principal',
  imports: [BarraBusca],
  templateUrl: './banner-principal.html',
})
export class BannerPrincipal {
  private readonly router = inject(Router)

  public buscar(query: string){
    this.router.navigate(['/busca'], {queryParams: { query }});
  }
}
