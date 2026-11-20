import { RevelarDirective } from '@shared/ui/revelar.directive';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** US23 — Registro desde la landing: llamada final. */
@Component({
  selector: 'app-cta-final',
  imports: [RevelarDirective, RouterLink],
  template: `
    <section class="cta" aria-labelledby="cta-titulo">
      <div class="contenedor">
        <div class="cta__caja" appRevelar>
          <div>
            <h2 id="cta-titulo">Ahorra hoy y evita que se pierda comida.</h2>
            <p>Crear tu cuenta toma menos de un minuto.</p>
          </div>
          <div class="cta__botones">
            <a class="btn btn--primario cta__btn" routerLink="/autenticacion/registro"
              >Crear mi cuenta gratis</a
            >
            <a class="btn btn--secundario cta__btn" routerLink="/autenticacion/login"
              >Ya tengo cuenta</a
            >
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .cta {
      padding: 4rem 0 5rem;
      background: var(--superficie);
    }
    .cta__caja {
      display: grid;
      gap: 1.5rem;
      align-items: center;
      padding: 2rem 1.5rem;
      border-radius: 24px;
      background: var(--cta-caja-bg);
      border: 1px solid var(--cta-caja-borde);
    }
    h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3.5vw, 2.125rem);
      font-weight: 800;
      color: var(--texto);
    }
    p {
      margin: 0.5rem 0 0;
      color: var(--texto-suave);
      font-size: 1.0625rem;
    }
    .cta__botones {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
    }
    .cta__btn {
      min-height: 52px;
      padding: 0 1.5rem;
      font-size: 1.0625rem;
      text-align: center;
      white-space: nowrap;
    }
    @media (max-width: 540px) {
      .cta__botones {
        gap: 0.5rem;
      }
      .cta__btn {
        flex: 1 1 0;
        min-height: 48px;
        padding: 0.5rem clamp(0.375rem, 2vw, 0.75rem);
        font-size: clamp(0.75rem, 3.2vw, 0.9375rem);
      }
    }
    @media (min-width: 900px) {
      .cta__caja {
        grid-template-columns: 1fr auto;
        padding: 3rem;
      }
    }
  `,
})
export class CtaFinalComponent {}
