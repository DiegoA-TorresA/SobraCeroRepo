/**
 * Ráfaga de hojas para momentos poco frecuentes (confirmar una reserva, completar un rescate).
 * Solo transform + opacity con Web Animations API (corre en el compositor).
 * Usa una capa fija con overflow oculto: nunca genera scroll horizontal. No hace nada con movimiento reducido.
 */
export function lanzarCelebracion(origen: Element | null | undefined, cantidad = 26): void {
  if (!origen || typeof document === 'undefined') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const r = origen.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const pequeno = innerWidth < 640;
  const alcance = pequeno ? 120 : 220;

  const capa = document.createElement('div');
  capa.setAttribute('aria-hidden', 'true');
  capa.style.cssText =
    'position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:1200;contain:strict';
  document.body.appendChild(capa);

  const formas = ['🍃', '🌱', '🍃', '●', '●', '◆'];
  const colores = ['#10b981', '#34d399', '#ff9800', '#047857'];
  let pendientes = cantidad;

  for (let i = 0; i < cantidad; i++) {
    const p = document.createElement('span');
    const forma = formas[i % formas.length];
    const esEmoji = forma.length > 1 || forma === '🍃' || forma === '🌱';
    p.textContent = forma;
    p.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;font-size:${esEmoji ? 16 + Math.random() * 10 : 8 + Math.random() * 6}px;line-height:1;color:${colores[i % colores.length]};will-change:transform,opacity;`;
    capa.appendChild(p);

    // Abanico hacia arriba con caída: tres fotogramas que simulan una parábola.
    const angulo = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
    const fuerza = alcance * (0.55 + Math.random() * 0.45);
    const dx = Math.cos(angulo) * fuerza;
    const dy = Math.sin(angulo) * fuerza;
    const giro = (Math.random() - 0.5) * 540;
    const dur = 950 + Math.random() * 650;

    p.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0.4) rotate(0deg)', opacity: 0 },
        {
          transform: `translate(calc(-50% + ${dx * 0.55}px), calc(-50% + ${dy * 0.85}px)) scale(1) rotate(${giro * 0.5}deg)`,
          opacity: 1,
          offset: 0.35,
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy * 0.35 + alcance * 0.5}px)) scale(0.9) rotate(${giro}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: dur,
        delay: Math.random() * 90,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        fill: 'both',
      },
    ).onfinish = () => {
      if (--pendientes === 0) capa.remove();
    };
  }
}
