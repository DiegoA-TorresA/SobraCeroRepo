import { Component } from '@angular/core';
import { EnConstruccionComponent } from '@shared/ui/en-construccion.component';

/**
 * PARTE 2 · Landing: propuesta de valor, cómo funciona, para quién, diferenciadores
 * Historias: US21, US22, US23, US24
 *
 * TODO (Desarrollador 2): reemplazar este placeholder por la vista real.
 * Servicios disponibles en '@core/api' y modelos en '@core/models'.
 */
@Component({
  selector: 'app-landing-page',
  imports: [EnConstruccionComponent],
  template: `<app-en-construccion />`,
})
export class LandingPage {}
