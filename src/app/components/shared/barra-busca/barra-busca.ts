import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-barra-busca',
  imports: [FormsModule],
  templateUrl: './barra-busca.html',
})
export class BarraBusca {
  protected inputBusca: string | null = null;

  @Output() protected readonly buscar = new EventEmitter<string>();

  public onSearch(): void {
    if (!this.inputBusca || this.inputBusca.trim() === '') return;

    this.buscar.emit(this.inputBusca.trim());

    this.inputBusca = null;
  }

  public clear(): void {
    this.inputBusca = null;
  }
}
