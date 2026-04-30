declare module 'bwip-js' {
  interface BwipOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    width?: number;
    includetext?: boolean;
    [key: string]: unknown;
  }

  function toCanvas(canvas: HTMLCanvasElement, options: BwipOptions): void;

  export default { toCanvas };
  export { toCanvas };
}
