import PictureCanvas from "./PictureCanvas.tsx";
import type Picture from "./Picture";
import { draw, fill, pick, rectangle } from "./tools";
import ToolSelect from "./ToolSelect.tsx";
import ColorSelect from "./ColorSelect.tsx";
import type State from "./State";
import type { tool } from "./State";

type pos = {
  x: number;
  y: number;
};

// type controls = [typeof ToolSelect, typeof ColorSelect];

export type dispatch = (action: {
  tool?: tool | undefined;
  color?: string;
  picture?: Picture;
}) => void;

export interface config {
  tools: {
    draw: typeof draw;
    fill: typeof fill;
    pick: typeof pick;
    rectangle: typeof rectangle;
  };
  // controls: controls;
  dispatch: dispatch;
}

interface PixelEditor {
  state: State;
  config: config;
}

export default function PixelEditor({ state, config }: PixelEditor) {
  const posFunction = (pos: pos) => {
    const tool = config.tools[state.tool];
    const onMove = tool(pos, state, config.dispatch);
    if (onMove) return (pos: pos) => onMove(pos, state);
  };

  return (
    <div>
      <PictureCanvas picture={state.picture} pointerDown={posFunction} />
      <br />
      <ToolSelect config={config} state={state} />{" "}
      <ColorSelect config={config} state={state} />
    </div>
  );
}
