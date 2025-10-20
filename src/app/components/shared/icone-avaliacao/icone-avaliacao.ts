import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

const limite_avaliacao = {
  muito_baixa: 40,
  baixa: 60,
  media: 75,
  alta: 100
} as const;

@Component({
  selector: 'app-icone-avaliacao',
  imports: [NgClass],
  template: `
    <span
      [ngClass]="mapearCorDaNota(porcentagemAvaliacao)"
      [style.width]="tamanhoPx + 'px'"
      [style.height]="tamanhoPx + 'px'"
      class="d-flex justify-content-center align-items-center rounded-circle app-porcentagem-nota"
    >
      <span [style.font-size]="tamanhoPx / 2.65 + 'px'" class="app-valor-porcentagem fw-semibold">
        <span>{{ porcentagemAvaliacao.toFixed(0) }}</span>
      </span>
    </span>
  `,
})
export class IconeAvaliacao {
  @Input({ required: true }) avaliacao: number = 0;
  @Input({ required: false }) tamanhoPx: number = 40;

  protected get porcentagemAvaliacao(): number {
    return this.avaliacao * 10;
  }

  public mapearCorDaNota(avaliacao: number): string {
    if (avaliacao <= limite_avaliacao.muito_baixa)
      return 'app-borda-nota-mais-baixa';

    if (avaliacao <= limite_avaliacao.baixa)
      return 'app-borda-nota-baixa';

    if (avaliacao <= limite_avaliacao.media)
      return 'app-borda-nota-media';

    return 'app-borda-nota-alta';
  }
}
