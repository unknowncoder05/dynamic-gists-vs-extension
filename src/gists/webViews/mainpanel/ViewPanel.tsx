import * as React from 'react';
import { useEffect, useState } from 'react';

interface ClientVsCode<T> {
  getState: () => T;
  setState: (data: T) => void;
  postMessage: (msg: unknown) => void;
}

declare const acquireVsCodeApi: <T = unknown>() => ClientVsCode<T>;

const vscode = acquireVsCodeApi();

export interface IViewPanelProps {}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ViewPanel: React.FunctionComponent<IViewPanelProps> = (props: React.PropsWithChildren<IViewPanelProps>) => {
  return (
    <div>
      Hello There!
    </div>
  );
};