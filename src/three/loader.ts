/**
 * Generic scene loader. Capability gating, lazy import, poster-to-canvas
 * crossfade and pause-when-hidden all live here so a future scene is a scene
 * file rather than a fresh round of performance mistakes.
 *
 * Do not bypass this. See .claude/rules/architecture.md.
 */

import { canLoadScene } from './capabilities';

export interface SceneHandle {
  destroy: () => void;
  setPlaying: (playing: boolean) => void;
  setPaletteFromDocument: () => void;
}

type SceneModule = {
  mount: (canvas: HTMLCanvasElement) => SceneHandle;
};

const loaders = import.meta.glob<SceneModule>('./scenes/*/scene.ts');

function loaderFor(name: string): (() => Promise<SceneModule>) | undefined {
  const key = `./scenes/${name}/scene.ts`;
  return loaders[key];
}

export function initScenes(root: ParentNode = document): void {
  const hosts = root.querySelectorAll<HTMLElement>('[data-scene]');
  for (const host of hosts) {
    const name = host.dataset.scene;
    if (!name) continue;
    void boot(host, name);
  }
}

async function boot(host: HTMLElement, name: string): Promise<void> {
  if (!canLoadScene()) return;

  const load = loaderFor(name);
  if (!load) return;

  const canvas = host.querySelector<HTMLCanvasElement>('[data-scene-canvas]');
  if (!canvas) return;

  let module: SceneModule;
  try {
    module = await load();
  } catch {
    return;
  }

  const handle = module.mount(canvas);
  host.dataset.sceneLive = '';

  const io = new IntersectionObserver(
    ([entry]) => handle.setPlaying(Boolean(entry?.isIntersecting)),
    { threshold: 0.05 },
  );
  io.observe(host);

  const onVisibility = () => {
    handle.setPlaying(document.visibilityState === 'visible');
  };
  document.addEventListener('visibilitychange', onVisibility);

  const onTheme = () => handle.setPaletteFromDocument();
  const themeObserver = new MutationObserver(onTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onTheme);

  const onReduce = (event: MediaQueryListEvent) => {
    if (event.matches) teardown();
  };
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduceQuery.addEventListener('change', onReduce);

  function teardown(): void {
    io.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    reduceQuery.removeEventListener('change', onReduce);
    handle.destroy();
    delete host.dataset.sceneLive;
  }
}
