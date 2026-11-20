import { RevelarDirective } from '@shared/ui/revelar.directive';
import { AfterViewInit, Component, ElementRef, OnDestroy, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Curvas de la escena (las mismas de styles.scss). El rebote se reserva para este momento de "deleite". */
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const RESORTE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/**
 * US21 — Propuesta de valor. La tarjeta de la derecha ilustra el canal dual con una oferta de ejemplo.
 * Escena animada (motion graphic, ~3,8 s, se reproduce una vez al entrar en pantalla; clic para repetir):
 *   1) llega la oferta  2) el precio baja de S/ 10 a S/ 4  3) el reloj corre hasta las 8:45 p. m.
 *   4) se dibuja la ruta y el pan viaja  5) aparece la donación  6) ráfaga de hojas y "+1,2 kg rescatados".
 * Solo transform + opacity (WAAPI). Con movimiento reducido se muestra directamente el estado final.
 */
@Component({
  selector: 'app-hero',
  imports: [RevelarDirective, RouterLink],
  template: `
    <section class="hero" id="propuesta" aria-labelledby="hero-titulo">
      <div class="contenedor hero__grid" appRevelar="grupo">
        <div class="hero__texto">
          <p class="eyebrow">Rescate de alimentos en Lima</p>
          <h1 id="hero-titulo">
            Lo que sobra hoy, <span class="resaltado">alimenta a alguien</span>.
          </h1>
          <p class="hero__sub">
            Compra excedentes de panaderías, restaurantes y minimarkets cerca de ti con descuento. Y
            si nadie los compra, se donan automáticamente a una organización social.
            <strong>Nada se pierde.</strong>
          </p>
          <div class="hero__ctas">
            <a
              class="btn btn--primario hero__btn"
              routerLink="/autenticacion/registro"
              [queryParams]="{ rol: 'CONSUMIDOR' }"
              >Pide tu oferta</a
            >
            <a
              class="btn btn--secundario hero__btn"
              routerLink="/autenticacion/registro"
              [queryParams]="{ rol: 'COMERCIO' }"
              >Tengo un comercio</a
            >
          </div>
          <ul class="hero__garantias">
            <li>✓ Producto identificado, sin cajas sorpresa</li>
            <li>✓ Fecha y hora exactas de vencimiento</li>
          </ul>
        </div>

        <div
          #escena
          class="hero__visual"
          aria-hidden="true"
          title="Toca para ver de nuevo"
          (click)="reproducir()"
        >
          <article #oferta class="demo-oferta">
            <div class="demo-oferta__foto">🥖</div>
            <div class="demo-oferta__cuerpo">
              <div class="demo-oferta__fila">
                <span #chip class="chip chip--verde">-60%</span>
                <span class="demo-oferta__dist">📍 350 m</span>
              </div>
              <p class="demo-oferta__titulo">Pan francés (bolsa x10)</p>
              <p class="demo-oferta__comercio">Panadería Doña Rosa · San Miguel</p>
              <p class="demo-oferta__precio">
                <strong #precio>S/ 4.00</strong> <s #precioViejo>S/ 10.00</s>
              </p>
              <p #vence class="demo-oferta__vence">⏰ Vence hoy a las 9:00 p. m.</p>
            </div>
          </article>
          <div class="flujo">
            <span #linea class="flujo__linea"></span>
            <span #viajero class="flujo__viajero">🥖</span>
            <span #aviso class="flujo__texto">¿No se vendió a las <b #hora>8:45</b> p. m.?</span>
          </div>
          <article #donacion class="demo-donacion">
            <span #mano class="demo-donacion__icono">🤝</span>
            <span #rescate class="demo-donacion__rescate">+1,2 kg rescatados</span>
            <div>
              <p class="demo-donacion__titulo">Donación derivada</p>
              <p class="demo-donacion__texto">
                Comedor Las Palmeras · 1,2 km · código de recojo enviado
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      overflow: hidden;
      padding: 3rem 0 4rem;
      background:
        radial-gradient(60rem 30rem at 85% -10%, var(--hero-grad-verde) 0%, transparent 60%),
        radial-gradient(40rem 24rem at -10% 110%, var(--hero-grad-naranja) 0%, transparent 60%),
        var(--superficie);
    }
    .hero__grid {
      display: grid;
      gap: 3rem;
      align-items: center;
    }
    .eyebrow {
      display: inline-block;
      margin: 0 0 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--eyebrow-bg);
      color: var(--verde-oscuro);
      font-weight: 600;
      font-size: 0.875rem;
    }
    h1 {
      font-size: clamp(2.25rem, 6vw, 3.75rem);
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin: 0;
      font-weight: 800;
    }
    .resaltado {
      color: var(--verde);
    }
    .hero__sub {
      font-size: 1.125rem;
      color: var(--texto-suave);
      max-width: 36rem;
      margin: 1.25rem 0 1.75rem;
    }
    .hero__ctas {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }
    .hero__btn {
      min-height: 52px;
      padding: 0 1.5rem;
      font-size: 1.0625rem;
      text-align: center;
      white-space: nowrap;
    }
    @media (max-width: 540px) {
      .hero__ctas {
        gap: 0.5rem;
      }
      .hero__btn {
        flex: 1 1 0;
        min-height: 48px;
        padding: 0.5rem clamp(0.5rem, 2vw, 0.875rem);
        font-size: clamp(0.8125rem, 3.4vw, 0.9375rem);
      }
    }
    .hero__garantias {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      color: var(--texto-suave);
      font-size: 0.9375rem;
    }

    .hero__visual {
      position: relative;
      display: grid;
      justify-items: center;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
    }
    /* Partículas de la ráfaga (las crea el componente) */
    .hero__visual :is(.hoja) {
      position: absolute;
      z-index: 3;
      font-size: 18px;
      line-height: 1;
      pointer-events: none;
      will-change: transform, opacity;
    }
    .demo-oferta {
      display: flex;
      width: 100%;
      max-width: 380px;
      background: var(--superficie);
      border-radius: 20px;
      box-shadow:
        0 24px 48px -12px rgba(4, 120, 87, 0.25),
        var(--sombra-1);
      overflow: hidden;
      transform: rotate(-1.5deg);
    }
    .demo-oferta__foto {
      display: grid;
      place-items: center;
      width: 110px;
      flex-shrink: 0;
      font-size: 3rem;
      background: linear-gradient(160deg, #fef3c7, #fde68a);
    }
    .demo-oferta__cuerpo {
      padding: 1rem 1.125rem;
    }
    .demo-oferta__fila {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chip {
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .chip--verde {
      background: var(--verde);
      color: #fff;
    }
    .demo-oferta__dist {
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .demo-oferta__titulo {
      margin: 0.5rem 0 0;
      font-weight: 700;
    }
    .demo-oferta__comercio {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }
    .demo-oferta__precio {
      margin: 0.5rem 0 0;
      font-size: 1.25rem;
    }
    .demo-oferta__precio strong {
      color: var(--verde-oscuro);
    }
    .demo-oferta__precio s {
      margin-left: 0.375rem;
      font-size: 0.875rem;
      color: var(--texto-suave);
    }
    .demo-oferta__vence {
      margin: 0.25rem 0 0;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--rojo);
    }

    .flujo {
      display: grid;
      justify-items: center;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }
    .flujo {
      position: relative;
    }
    .flujo__viajero {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 2;
      font-size: 1.375rem;
      opacity: 0;
      pointer-events: none;
    }
    .flujo__texto b {
      font-variant-numeric: tabular-nums;
    }
    .flujo__linea {
      transform-origin: top center;
      width: 2px;
      height: 36px;
      background: repeating-linear-gradient(to bottom, var(--naranja) 0 6px, transparent 6px 12px);
    }
    .flujo__texto {
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      background: var(--superficie);
      color: var(--naranja-oscuro);
      border: 1px solid var(--borde);
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .demo-donacion {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      width: 100%;
      max-width: 340px;
      padding: 1rem 1.125rem;
      background: var(--superficie);
      border: 2px solid var(--borde);
      border-radius: 16px;
      box-shadow: var(--sombra-1);
      transform: rotate(1deg);
    }
    .demo-donacion__icono {
      display: inline-block;
      font-size: 2rem;
    }
    .demo-donacion {
      position: relative;
    }
    .demo-donacion__rescate {
      position: absolute;
      top: -12px;
      right: 10px;
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
      background: var(--verde);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 800;
      box-shadow: var(--sombra-1);
      white-space: nowrap;
    }
    .demo-oferta__precio strong {
      font-variant-numeric: tabular-nums;
    }
    .demo-donacion__titulo {
      margin: 0;
      font-weight: 700;
      color: var(--verde-oscuro);
    }
    .demo-donacion__texto {
      margin: 0;
      font-size: 0.8125rem;
      color: var(--texto-suave);
    }

    @media (min-width: 960px) {
      .hero {
        padding: 5rem 0 6rem;
      }
      .hero__grid {
        grid-template-columns: 1.15fr 0.85fr;
      }
    }
  `,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly escena = viewChild.required<ElementRef<HTMLElement>>('escena');
  private readonly oferta = viewChild.required<ElementRef<HTMLElement>>('oferta');
  private readonly chip = viewChild.required<ElementRef<HTMLElement>>('chip');
  private readonly precio = viewChild.required<ElementRef<HTMLElement>>('precio');
  private readonly precioViejo = viewChild.required<ElementRef<HTMLElement>>('precioViejo');
  private readonly vence = viewChild.required<ElementRef<HTMLElement>>('vence');
  private readonly linea = viewChild.required<ElementRef<HTMLElement>>('linea');
  private readonly viajero = viewChild.required<ElementRef<HTMLElement>>('viajero');
  private readonly aviso = viewChild.required<ElementRef<HTMLElement>>('aviso');
  private readonly hora = viewChild.required<ElementRef<HTMLElement>>('hora');
  private readonly donacion = viewChild.required<ElementRef<HTMLElement>>('donacion');
  private readonly mano = viewChild.required<ElementRef<HTMLElement>>('mano');
  private readonly rescate = viewChild.required<ElementRef<HTMLElement>>('rescate');

  private observador?: IntersectionObserver;
  private cuadros: number[] = [];
  private temporizadores: ReturnType<typeof setTimeout>[] = [];

  ngAfterViewInit(): void {
    if (
      typeof IntersectionObserver === 'undefined' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    this.observador = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          this.observador?.disconnect();
          this.reproducir();
        }
      },
      { threshold: 0.45 },
    );
    this.observador.observe(this.escena().nativeElement);
  }

  /** Reproduce la escena desde el inicio (también al tocarla). */
  reproducir(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.detener();
    const anim = (el: () => ElementRef<HTMLElement>, k: Keyframe[], o: KeyframeAnimationOptions) =>
      el().nativeElement.animate(k, { fill: 'both', ...o });
    const t0 = 120;

    // 1) Llega la oferta (12 px, escala 0.96 → 1)
    anim(
      this.oferta,
      [
        { opacity: 0, transform: 'translateY(-12px) rotate(-1.5deg) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0) rotate(-1.5deg) scale(1)' },
      ],
      { duration: 520, delay: t0, easing: EASE_OUT },
    );

    // 2) Descuento: el chip salta y el precio baja contando
    anim(
      this.chip,
      [
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 460, delay: t0 + 620, easing: RESORTE },
    );
    this.contar(this.precio().nativeElement, 10, 4, t0 + 620, 760, (v) => `S/ ${v.toFixed(2)}`);
    anim(
      this.precioViejo,
      [
        { opacity: 0, transform: 'translateX(-8px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ],
      { duration: 320, delay: t0 + 1250, easing: EASE_OUT },
    );
    anim(this.vence, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      delay: t0 + 1400,
      easing: EASE_OUT,
    });

    // 3) Corre el reloj hasta la hora de derivación
    anim(
      this.aviso,
      [
        { opacity: 0, transform: 'scale(0.9)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 420, delay: t0 + 1650, easing: RESORTE },
    );
    this.contar(
      this.hora().nativeElement,
      30,
      45,
      t0 + 1650,
      650,
      (v) => `8:${String(Math.round(v)).padStart(2, '0')}`,
    );

    // 4) Se dibuja la ruta y el pan viaja por ella
    anim(this.linea, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
      duration: 520,
      delay: t0 + 2200,
      easing: EASE_IN_OUT,
    });
    anim(
      this.viajero,
      [
        { opacity: 0, transform: 'translate(-50%, -4px) scale(0.6) rotate(-20deg)' },
        { opacity: 1, transform: 'translate(-50%, 14px) scale(1) rotate(0deg)', offset: 0.35 },
        { opacity: 1, transform: 'translate(-50%, 40px) scale(0.9) rotate(15deg)', offset: 0.8 },
        { opacity: 0, transform: 'translate(-50%, 56px) scale(0.5) rotate(25deg)' },
      ],
      { duration: 820, delay: t0 + 2250, easing: EASE_IN_OUT },
    );

    // 5) Llega la donación (resorte suave)
    anim(
      this.donacion,
      [
        { opacity: 0, transform: 'translateY(12px) rotate(1deg) scale(0.96)' },
        { opacity: 1, transform: 'translateY(0) rotate(1deg) scale(1)' },
      ],
      { duration: 620, delay: t0 + 2900, easing: RESORTE },
    );
    anim(
      this.mano,
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.35) rotate(-12deg)', offset: 0.45 },
        { transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: 560, delay: t0 + 3250, easing: EASE_OUT },
    );

    // 6) Ráfaga de hojas + sello de impacto
    this.temporizadores.push(setTimeout(() => this.rafaga(), t0 + 3300));
    anim(
      this.rescate,
      [
        { opacity: 0, transform: 'translateY(8px) scale(0.8)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
      ],
      { duration: 520, delay: t0 + 3380, easing: RESORTE },
    );
  }

  /** Contador de texto con ease-out (solo cambia texto, no layout de alrededor: ancho tabular). */
  private contar(
    el: HTMLElement,
    desde: number,
    hasta: number,
    retraso: number,
    dur: number,
    fmt: (v: number) => string,
  ): void {
    el.textContent = fmt(desde);
    const inicio = performance.now() + retraso;
    const paso = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - inicio) / dur));
      const s = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(desde + (hasta - desde) * s);
      if (p < 1) this.cuadros.push(requestAnimationFrame(paso));
    };
    this.cuadros.push(requestAnimationFrame(paso));
  }

  /** Hojas que brotan de la tarjeta de donación, dentro de la escena (hero tiene overflow oculto). */
  private rafaga(): void {
    const escena = this.escena().nativeElement;
    const m = this.mano().nativeElement.getBoundingClientRect();
    const e = escena.getBoundingClientRect();
    const cx = m.left - e.left + m.width / 2;
    const cy = m.top - e.top + m.height / 2;
    const alcance = innerWidth < 640 ? 70 : 120;
    const formas = ['🍃', '🌱', '🍃', '✨', '🍃', '🌿'];
    for (let i = 0; i < 16; i++) {
      const h = document.createElement('span');
      h.className = 'hoja';
      h.textContent = formas[i % formas.length];
      h.style.left = `${cx}px`;
      h.style.top = `${cy}px`;
      escena.appendChild(h);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
      const f = alcance * (0.5 + Math.random() * 0.5);
      const dx = Math.cos(ang) * f,
        dy = Math.sin(ang) * f;
      const giro = (Math.random() - 0.5) * 420;
      h.animate(
        [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(0.3)' },
          {
            opacity: 1,
            transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.85}px)) scale(1) rotate(${giro / 2}deg)`,
            offset: 0.4,
          },
          {
            opacity: 0,
            transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy * 0.4 + alcance * 0.35}px)) scale(0.8) rotate(${giro}deg)`,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          delay: Math.random() * 80,
          easing: EASE_OUT,
          fill: 'both',
        },
      ).onfinish = () => h.remove();
    }
  }

  private detener(): void {
    this.cuadros.forEach(cancelAnimationFrame);
    this.temporizadores.forEach(clearTimeout);
    this.cuadros = [];
    this.temporizadores = [];
    const escena = this.escena().nativeElement;
    escena.querySelectorAll('.hoja').forEach((h) => h.remove());
    escena.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    this.detener();
  }
}
