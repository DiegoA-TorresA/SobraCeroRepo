import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Revela un elemento (o a sus hijos, escalonados) cuando entra en pantalla, una sola vez.
 * Solo agrega clases: no cambia la estructura del HTML.
 *
 *   <section appRevelar>…</section>            → el elemento entra completo
 *   <ul appRevelar="grupo">…</ul>              → cada hijo directo entra escalonado
 *
 * Estilos en styles.scss (.revelar / .revelar-grupo). Respeta prefers-reduced-motion.
 */
@Directive({ selector: '[appRevelar]' })
export class RevelarDirective implements OnInit, OnDestroy {
  readonly appRevelar = input<'' | 'grupo'>('');
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observador?: IntersectionObserver;

  ngOnInit(): void {
    this.el.classList.add(this.appRevelar() === 'grupo' ? 'revelar-grupo' : 'revelar');
    if (typeof IntersectionObserver === 'undefined') {
      this.mostrar();
      return;
    }
    this.observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          this.mostrar();
          this.observador?.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    this.observador.observe(this.el);
  }

  private mostrar(): void {
    this.el.classList.add('revelar--visible');
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }
}
