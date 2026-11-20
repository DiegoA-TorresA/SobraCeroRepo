import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { API_URL } from '@core/config/api.config';
import { SIN_TOAST_DE_ERROR } from '@core/interceptors/error.interceptor';
import {
  Comercio,
  ImpactoComercio,
  ImpactoOrganizacion,
  ImpactoPlataforma,
  OrganizacionSocial,
  ReservaVista,
  Rol,
} from '@core/models';

export interface DatoPerfil {
  etiqueta: string;
  valor: string;
}

export interface ResumenPerfil {
  bio: string;
  estadisticas: DatoPerfil[];
  datos: DatoPerfil[];
}

const num = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1 });
const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
const kg = (v: number) => `${num.format(v)} kg`;

const BIO: Record<Rol, string> = {
  CONSUMIDOR: 'Rescatas comida en buen estado cerca de ti y pagas menos por ella.',
  COMERCIO: 'Vendes tus excedentes del día con descuento; lo que no se vende se dona solo.',
  ORGANIZACION: 'Recibes donaciones de comercios cercanos según tu capacidad de recojo.',
  ADMINISTRADOR: 'Validas comercios y organizaciones y sigues el impacto de toda la plataforma.',
};

/**
 * Datos del panel de perfil por rol, armados con los endpoints existentes.
 * Las peticiones van sin toast de error: si alguna falla, el panel muestra "—" en ese dato.
 */
@Injectable({ providedIn: 'root' })
export class PerfilDatosService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);
  private readonly silencioso = { context: new HttpContext().set(SIN_TOAST_DE_ERROR, true) };

  cargar(rol: Rol): Observable<ResumenPerfil> {
    const bio = BIO[rol];
    switch (rol) {
      case 'CONSUMIDOR':
        return this.get<ReservaVista[]>('/api/reservas/mias').pipe(
          map((r) => {
            const lista = r ?? [];
            const recogidas = lista.filter((x) => x.estado === 'RECOGIDA');
            return {
              bio,
              estadisticas: [
                { etiqueta: 'Reservas', valor: r ? num.format(lista.length) : '—' },
                {
                  etiqueta: 'Por recoger',
                  valor: r ? num.format(lista.filter((x) => x.estado === 'PAGADA').length) : '—',
                },
                {
                  etiqueta: 'En rescates',
                  valor: r ? soles.format(recogidas.reduce((s, x) => s + x.monto, 0)) : '—',
                },
              ],
              datos: [
                { etiqueta: 'Pedidos recogidos', valor: r ? num.format(recogidas.length) : '—' },
              ],
            };
          }),
        );
      case 'COMERCIO':
        return forkJoin([
          this.get<Comercio>('/api/comercios/yo'),
          this.get<ImpactoComercio>('/api/impacto/comercio'),
        ]).pipe(
          map(([c, i]) => ({
            bio,
            estadisticas: [
              { etiqueta: 'Rescatado', valor: i ? kg(i.rescatadoKg) : '—' },
              { etiqueta: 'Ingresos', valor: i ? soles.format(i.ingresos) : '—' },
              { etiqueta: 'Donaciones', valor: i ? num.format(i.donacionesCompletadas) : '—' },
            ],
            datos: [
              { etiqueta: 'RUC', valor: c?.ruc ?? '—' },
              { etiqueta: 'Distrito', valor: c?.distrito ?? '—' },
              { etiqueta: 'Plan', valor: c ? (c.plan === 'PREMIUM' ? 'Premium' : 'Gratis') : '—' },
            ],
          })),
        );
      case 'ORGANIZACION':
        return forkJoin([
          this.get<OrganizacionSocial>('/api/organizaciones/yo'),
          this.get<ImpactoOrganizacion>('/api/impacto/organizacion'),
        ]).pipe(
          map(([o, i]) => ({
            bio,
            estadisticas: [
              { etiqueta: 'Recibido', valor: i ? kg(i.recibidoKg) : '—' },
              { etiqueta: 'Recojos', valor: i ? num.format(i.donacionesCompletadas) : '—' },
              { etiqueta: 'CO₂ evitado', valor: i ? kg(i.co2EvitadoKg) : '—' },
            ],
            datos: [
              {
                etiqueta: 'Capacidad diaria',
                valor: o
                  ? o.capacidadDiariaKg != null
                    ? kg(o.capacidadDiariaKg)
                    : 'Sin límite'
                  : '—',
              },
              {
                etiqueta: 'Calificación SUNAT',
                valor: o ? (o.deducibleSunat ? 'Sí, deducible' : 'No registrada') : '—',
              },
              { etiqueta: 'Dirección', valor: o?.direccion ?? '—' },
            ],
          })),
        );
      case 'ADMINISTRADOR':
        return this.get<ImpactoPlataforma>('/api/impacto/plataforma').pipe(
          map((p) => ({
            bio,
            estadisticas: [
              { etiqueta: 'Rescatado', valor: p ? kg(p.rescatadoKg) : '—' },
              { etiqueta: 'Comercios', valor: p ? num.format(p.comerciosActivos) : '—' },
              { etiqueta: 'Organizaciones', valor: p ? num.format(p.organizacionesActivas) : '—' },
            ],
            datos: [
              {
                etiqueta: 'Avance de la meta',
                valor: p ? `${num.format(p.avanceMetaPct)} %` : '—',
              },
            ],
          })),
        );
    }
  }

  private get<T>(ruta: string): Observable<T | null> {
    return this.http.get<T>(`${this.api}${ruta}`, this.silencioso).pipe(catchError(() => of(null)));
  }
}
