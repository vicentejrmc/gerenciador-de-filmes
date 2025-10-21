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
      <span [style.font-size]="tamanhoPx / 2.4 + 'px'" class="app-valor-porcentagem fw-semibold">
        <span>{{ porcentagemAvaliacao }}</span>
      </span>
    </span>
  `,
})
export class IconeAvaliacao {
  @Input({ required: true }) avaliacao: number = 0;
  @Input({ required: false }) tamanhoPx: number = 40;

  protected get porcentagemAvaliacao(): number {
    const v = Number(this.avaliacao) || 0;

    // casos comuns:
    // 0-1 (ex.: 0.77) => multiplica por 100
    // 0-10 (ex.: 7.7) => multiplica por 10
    // >10 (ex.: 77) => assume já em porcentagem
    let pct: number;
      if (v > 0 && v <= 1) pct = v * 100;
      else if (v > 1 && v <= 10) pct = v * 10;
      else pct = v;

    // garante 0..100 e arredonda
    pct = Math.round(Math.max(0, Math.min(100, pct)));
      return pct;
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
