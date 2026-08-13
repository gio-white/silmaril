/**
 * Read the live theme from computed styles so the canvas and the page can
 * never drift apart. Custom properties that use light-dark() return the
 * *specified* function string from getPropertyValue, not the used colour,
 * so we resolve through a probe element's computed `color`.
 */

export interface ScenePalette {
  paper: string;
  ink: string;
  rust: string;
  rustBright: string;
}

let probe: HTMLSpanElement | null = null;

function resolve(variable: string, fallback: string): string {
  if (!probe) {
    probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    document.body.append(probe);
  }
  probe.style.color = `var(${variable})`;
  const used = getComputedStyle(probe).color;
  return used || fallback;
}

export function readPalette(): ScenePalette {
  return {
    paper: resolve('--c-paper', 'rgb(237, 240, 242)'),
    ink: resolve('--c-ink', 'rgb(16, 20, 24)'),
    rust: resolve('--c-rust', 'rgb(178, 58, 22)'),
    rustBright: resolve('--c-rust-bright', 'rgb(228, 87, 46)'),
  };
}

/** Hex or rgb() -> [0..1, 0..1, 0..1] for shader uniforms. */
export function toVec3(input: string): [number, number, number] {
  const hex = input.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = Number.parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const rgb = input.match(/rgba?\(\s*([\d.]+)\s*[,/\s]\s*([\d.]+)\s*[,/\s]\s*([\d.]+)/i);
  if (rgb) {
    const a = Number(rgb[1]);
    const scale = a > 1 ? 255 : 1;
    return [a / scale, Number(rgb[2]) / scale, Number(rgb[3]) / scale];
  }
  return [0.93, 0.94, 0.95];
}
