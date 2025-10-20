import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

const LIMITES_AVALIACAO = {
  MUITO_BAIXA: 40,
  BAIXA: 60,
  MEDIA: 75,
  ALTA: 100
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
    if (avaliacao <= LIMITES_AVALIACAO.MUITO_BAIXA)
      return 'app-borda-nota-mais-baixa';

    if (avaliacao <= LIMITES_AVALIACAO.BAIXA)
      return 'app-borda-nota-baixa';

    if (avaliacao <= LIMITES_AVALIACAO.MEDIA)
      return 'app-borda-nota-media';

    return 'app-borda-nota-alta';
  }
}
