declare module "gpio" {
  function internalexport(pin: number, opts?: ExportOpts): INpmGpio;
  let DIRECTION: IDirections;

  export interface IDirections {
    IN: string;
    OUT: string;
  }

  export interface ExportOpts {
    direction: string;
    interval: number;
    ready: () => void;
  }

  export interface INpmGpio {
    set(value: number, cb:() => void);
    unexport(): void;
  }

  export { internalexport as export, DIRECTION }
}
