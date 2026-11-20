import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SesionService } from '@core/auth/sesion.service';
import { EstadoBadgeComponent } from '@shared/ui/estado-badge.component';
import { PerfilDatosService, ResumenPerfil } from './perfil-datos.service';

type Estado = 'cerrado' | 'entrando' | 'abierto' | 'cerrando';

/** Ancho a partir del cual el perfil es modal centrado; por debajo es un panel inferior (bottom sheet). */
const CONSULTA_HOJA = '(max-width: 639px)';
/** Cierra si se arrastra más de este % de la altura del panel… */
const UMBRAL_DISTANCIA = 0.3;
/** …o si se suelta con un "flick" más rápido que esto (px/ms, medido en los últimos ~80 ms). */
const UMBRAL_VELOCIDAD = 0.45;

/**
 * Panel de perfil.
 * - Escritorio: modal centrado que entra con escala 0.96 → 1 + opacidad (220 ms, ease-out).
 * - Celular: panel inferior que sube desde abajo con la curva tipo iOS; se arrastra 1:1 con el dedo
 *   desde la zona superior, se cierra por distancia o velocidad, y el fondo se aclara según el arrastre.
 * - Cierra con Escape, tocando fuera o con el botón ×. Respeta prefers-reduced-motion.
 * Usa <dialog> nativo: capa superior, foco atrapado y devolución del foco al avatar al cerrar.
 */
@Component({
  selector: 'app-perfil-panel',
  imports: [RouterLink, EstadoBadgeComponent],
  templateUrl: './perfil-panel.component.html',
  styleUrl: './perfil-panel.component.scss',
})
export class PerfilPanelComponent {
  readonly abierto = model(false);
  readonly nombreRol = input('');
  readonly iniciales = input('?');
  readonly notificacionesSinLeer = input(0);

  protected readonly sesion = inject(SesionService);
  private readonly datosSrv = inject(PerfilDatosService);

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  private readonly hoja = viewChild.required<ElementRef<HTMLElement>>('hoja');
  private readonly fondo = viewChild.required<ElementRef<HTMLElement>>('fondo');

  protected readonly estado = signal<Estado>('cerrado');
  protected readonly resumen = signal<ResumenPerfil | null>(null);
  protected readonly cargando = signal(false);
  protected readonly estadoCuenta = computed(() => this.sesion.usuario()?.estadoCuenta ?? null);

  private carga?: Subscription;
  private temporizador?: ReturnType<typeof setTimeout>;

  // Arrastre
  private arrastre: {
    id: number;
    inicioY: number;
    alto: number;
    dy: number;
    muestras: { y: number; t: number }[];
  } | null = null;

  constructor() {
    effect(() => {
      const quiereAbrir = this.abierto();
      untracked(() => (quiereAbrir ? this.abrir() : this.cerrar()));
    });
    inject(DestroyRef).onDestroy(() => {
      this.carga?.unsubscribe();
      clearTimeout(this.temporizador);
      document.documentElement.classList.remove('pp-bloqueo');
    });
  }

  // ---------------------------------------------------------------- abrir / cerrar
  private abrir(): void {
    const d = this.dlg().nativeElement;
    if (this.estado() === 'abierto' || this.estado() === 'entrando') return;
    clearTimeout(this.temporizador);
    if (!d.open) d.showModal();
    document.documentElement.classList.add('pp-bloqueo');
    this.limpiarEstilosArrastre();
    this.estado.set('entrando');
    // Dos frames: el navegador pinta primero el estado inicial y luego transiciona al final.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => this.estado() === 'entrando' && this.estado.set('abierto')),
    );
    this.cargarDatos();
  }

  /** Cierre animado. La transición continúa desde donde esté (también a mitad de un arrastre). */
  protected cerrar(): void {
    const d = this.dlg().nativeElement;
    if (!d.open || this.estado() === 'cerrando' || this.estado() === 'cerrado') {
      if (this.abierto()) this.abierto.set(false);
      return;
    }
    this.estado.set('cerrando');
    this.limpiarEstilosArrastre();
    if (this.abierto()) this.abierto.set(false);
    const terminar = () => {
      if (this.estado() !== 'cerrando') return;
      this.hoja().nativeElement.removeEventListener('transitionend', alTerminar);
      d.close();
    };
    const alTerminar = (e: TransitionEvent) => {
      if (
        e.target === this.hoja().nativeElement &&
        (e.propertyName === 'transform' || e.propertyName === 'opacity')
      )
        terminar();
    };
    this.hoja().nativeElement.addEventListener('transitionend', alTerminar);
    this.temporizador = setTimeout(terminar, 650); // respaldo si no hay transición (p. ej. movimiento reducido)
  }

  /** El <dialog> se cerró (por nosotros o por el navegador): dejar todo en reposo. */
  protected alCerrarDialogo(): void {
    this.estado.set('cerrado');
    this.limpiarEstilosArrastre();
    document.documentElement.classList.remove('pp-bloqueo');
    if (this.abierto()) this.abierto.set(false);
  }

  /** Escape: el navegador cerraría de golpe; lo cambiamos por el cierre animado. */
  protected alCancelar(e: Event): void {
    e.preventDefault();
    this.cerrar();
  }

  protected cerrarSesion(): void {
    this.dlg().nativeElement.close();
    this.sesion.cerrarSesion();
  }

  private cargarDatos(): void {
    const rol = this.sesion.rol();
    if (!rol) return;
    this.carga?.unsubscribe();
    this.cargando.set(!this.resumen());
    this.carga = this.datosSrv.cargar(rol).subscribe((r) => {
      this.resumen.set(r);
      this.cargando.set(false);
    });
  }

  // ---------------------------------------------------------------- gesto (solo panel inferior)
  protected alPresionar(e: PointerEvent): void {
    if (this.arrastre || e.button !== 0 || this.estado() !== 'abierto') return; // un solo dedo
    if (!matchMedia(CONSULTA_HOJA).matches) return;
    if ((e.target as HTMLElement).closest('button, a')) return; // tocar un botón no inicia arrastre
    const hoja = this.hoja().nativeElement;
    this.arrastre = {
      id: e.pointerId,
      inicioY: e.clientY,
      alto: hoja.offsetHeight,
      dy: 0,
      muestras: [{ y: e.clientY, t: e.timeStamp }],
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    // Fase de seguimiento: sin transición, la hoja ES el dedo.
    hoja.style.transition = 'none';
    this.fondo().nativeElement.style.transition = 'none';
  }

  protected alMover(e: PointerEvent): void {
    const a = this.arrastre;
    if (!a || e.pointerId !== a.id) return;
    const crudo = e.clientY - a.inicioY;
    // Hacia arriba no hay más recorrido: resistencia creciente en lugar de un tope seco.
    const dy = crudo >= 0 ? crudo : -Math.sqrt(-crudo) * 2;
    a.dy = dy;
    a.muestras.push({ y: e.clientY, t: e.timeStamp });
    if (a.muestras.length > 6) a.muestras.shift();
    this.hoja().nativeElement.style.transform = `translate3d(0, ${dy}px, 0)`;
    // El fondo se aclara en proporción exacta al arrastre (un solo origen de verdad).
    this.fondo().nativeElement.style.opacity = String(1 - Math.min(1, Math.max(0, dy / a.alto)));
  }

  protected alSoltar(e: PointerEvent): void {
    const a = this.arrastre;
    if (!a || e.pointerId !== a.id) return;
    this.arrastre = null;
    const recientes = a.muestras.filter((m) => e.timeStamp - m.t < 80);
    const primero = recientes[0] ?? a.muestras[0];
    const dt = Math.max(1, e.timeStamp - primero.t);
    const velocidad = (e.clientY - primero.y) / dt; // px/ms, positiva hacia abajo
    const cerrarPorDistancia = a.dy > a.alto * UMBRAL_DISTANCIA;
    const cerrarPorVelocidad = velocidad > UMBRAL_VELOCIDAD && a.dy > 8;
    if (cerrarPorDistancia || cerrarPorVelocidad) {
      this.cerrar(); // la transición CSS sigue desde la posición actual hasta abajo
    } else {
      this.limpiarEstilosArrastre(); // vuelve rápido a su sitio
    }
  }

  private limpiarEstilosArrastre(): void {
    const hoja = this.hoja().nativeElement;
    const fondo = this.fondo().nativeElement;
    hoja.style.transition = '';
    hoja.style.transform = '';
    fondo.style.transition = '';
    fondo.style.opacity = '';
  }
}
