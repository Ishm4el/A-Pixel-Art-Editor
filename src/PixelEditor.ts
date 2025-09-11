import { createElement } from "react";
import PictureCanvas from "./PictureCanvas";
import type Picture from "./Picture";
import { draw, fill, pick, rectangle } from "./tools";
import ToolSelect from "./ToolSelect";
import ColorSelect from "./ColorSelect";
import type State from "./State";
import type { tool } from "./State";

type controls = [typeof ToolSelect, typeof ColorSelect];
export type dispatch = (action: {
  tool?: tool | undefined;
  color?: string;
  picture?: Picture;
}) => void;
interface config {
  tools: {
    draw: typeof draw;
    fill: typeof fill;
    pick: typeof pick;
    rectangle: typeof rectangle;
  };
  controls: controls;
  dispatch: dispatch;
}

export default class PixelEditor {
  dom: React.ReactNode;
  state: {
    tool: "draw" | "fill" | "pick" | "rectangle";
    color: string;
    picture: Picture;
  };
  canvas: PictureCanvas;
  controls: (ColorSelect | ToolSelect)[];

  constructor(
    state: {
      tool: "draw" | "fill" | "pick" | "rectangle";
      color: string;
      picture: Picture;
    },
    config: config
  ) {
    const { tools, controls, dispatch } = config;
    this.state = state;

    const posFunction = (pos: pos) => {
      const tool = tools[this.state.tool];
      const onMove = tool(pos, this.state, dispatch);
      if (onMove) return (pos: pos) => onMove(pos, this.state);
    };

    this.canvas = new PictureCanvas(state.picture, posFunction);

    this.controls = controls.map((control) => new control(state, config));
    this.dom = createElement(
      "div",
      {},
      this.canvas.dom,
      createElement("br"),
      ...this.controls.reduce(
        (a, c) => a.concat(" ", c.dom!.toString()),
        [] as string[]
      )
    );
  }

  syncState(state: State) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (const ctrl of this.controls) ctrl.syncState(state);
  }
}
