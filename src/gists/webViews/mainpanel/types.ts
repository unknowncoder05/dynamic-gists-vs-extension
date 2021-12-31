export interface ClientVsCode<T> {
    getState: () => T;
    setState: (data: T) => void;
    postMessage: (msg: unknown) => void;
  }