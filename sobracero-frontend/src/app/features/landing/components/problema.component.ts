import { RevelarDirective } from '@shared/ui/revelar.directive';
import { Component } from '@angular/core';
import { CIFRAS_PROBLEMA } from '../data/contenido-landing';
import { SeccionTituloComponent } from './seccion-titulo.component';

/** Contexto del problema con las cifras del informe. */
@Component({
  selector: 'app-problema',
  imports: [RevelarDirective, SeccionTituloComponent],
  template: `
    <section class="pr" aria-labelledby="pr-titulo">
      <div class="contenedor">
        <app-seccion-titulo
          claro
          idTitulo="pr-titulo"
          eyebrow="El problema"
          titulo="El Perú bota comida mientras 3 de cada 10 personas no acceden a ella"
          bajada="Gran parte se pierde en la distribución: alimento ya listo, a pocos metros del consumidor, que se descarta solo por acercarse a su fecha límite."
        />
        <ul class="pr__cifras" appRevelar="grupo">
          @for (c of cifras; track c.valor) {
            <li>
              <p class="pr__valor">{{ c.valor }}</p>
              <p class="pr__texto">{{ c.texto }}</p>
              <p class="pr__fuente">{{ c.fuente }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .pr {
      padding: 4.5rem 0;
      background: #0b1f17;
    }
    .pr__cifras {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.875rem;
    }
    li {
      padding: 1.5rem 1.25rem;
      border-radius: var(--radio-lg);
      background: #11291f;
      border: 1px solid #1f3a2e;
    }
    .pr__valor {
      margin: 0;
      font-size: clamp(2rem, 5vw, 2.75rem);
      font-weight: 800;
      color: var(--naranja);
      letter-spacing: -0.02em;
    }
    .pr__texto {
      margin: 0.25rem 0 0.75rem;
      color: #e5e7eb;
      font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
    }
    .pr__fuente {
      margin: 0;
      font-size: 0.8125rem;
      color: #9ca3af;
    }
    @media (max-width: 767px) {
      .pr__cifras li:last-child {
        grid-column: span 2;
      }
    }
    @media (min-width: 768px) {
      .pr__cifras {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
      }
      li {
        padding: 1.75rem;
      }
    }
  `,
})
export class ProblemaComponent {
  protected readonly cifras = CIFRAS_PROBLEMA;
}
