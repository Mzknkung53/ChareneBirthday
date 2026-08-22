import type { Options } from 'canvas-confetti';

const COLORS = ['#FFBFD8', '#F2739F', '#FF9FC3', '#A8D8F4', '#7FD1E6', '#C9BCEF', '#DFB964', '#FFFFFF'];

const CONFETTI_DEFAULTS: Partial<Options> = {
  colors: COLORS,
  zIndex: 200,
  disableForReducedMotion: false,
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/** Full-screen birthday fireworks using canvas-confetti. Returns a cleanup function. */
export async function runBirthdayCelebration() {
  const confetti = (await import('canvas-confetti')).default;
  const duration = 6500;
  const end = Date.now() + duration;
  const timers: number[] = [];
  let raf = 0;
  let stopped = false;

  const burst = (options: Options) => {
    if (stopped) return;
    void confetti({ ...CONFETTI_DEFAULTS, ...options });
  };

  // Opening triple burst — fills the screen immediately.
  burst({ particleCount: 180, spread: 110, startVelocity: 48, origin: { x: 0.5, y: 0.5 } });
  burst({ particleCount: 100, angle: 58, spread: 62, startVelocity: 52, origin: { x: 0.02, y: 0.62 } });
  burst({ particleCount: 100, angle: 122, spread: 62, startVelocity: 52, origin: { x: 0.98, y: 0.62 } });

  timers.push(
    window.setTimeout(() => {
      burst({ particleCount: 140, spread: 95, startVelocity: 44, origin: { x: 0.5, y: 0.45 } });
    }, 450),
  );

  timers.push(
    window.setTimeout(() => {
      burst({ particleCount: 120, spread: 120, startVelocity: 40, origin: { x: 0.5, y: 0.55 } });
    }, 1100),
  );

  // Continuous fireworks raining from top/sides across the whole viewport.
  const shower = window.setInterval(() => {
    if (Date.now() > end) {
      window.clearInterval(shower);
      return;
    }

    burst({
      particleCount: 28,
      startVelocity: randomInRange(38, 58),
      spread: randomInRange(55, 100),
      ticks: randomInRange(60, 100),
      origin: { x: randomInRange(0.05, 0.95), y: randomInRange(-0.05, 0.25) },
    });
  }, 280);

  timers.push(shower);

  const cannon = () => {
    if (Date.now() > end || stopped) return;

    burst({
      particleCount: 6,
      angle: randomInRange(55, 125),
      spread: randomInRange(48, 72),
      startVelocity: randomInRange(42, 58),
      origin: { x: randomInRange(0.08, 0.92), y: randomInRange(0.15, 0.45) },
    });

    raf = requestAnimationFrame(cannon);
  };

  raf = requestAnimationFrame(cannon);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    timers.forEach((id) => window.clearInterval(id));
    confetti.reset();
  };
}
