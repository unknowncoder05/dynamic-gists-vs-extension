import * as React from "react";
import { render } from "react-dom";
import { ViewPanel } from "./ViewPanel";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vscode-collapsible": any;
      "vscode-button": any;
    }
  }
}

const elm = document.querySelector("#app");
render(<ViewPanel />, elm);