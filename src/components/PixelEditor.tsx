import PictureCanvas from "./PixelEditor Components/PictureCanvas.tsx";
import type Picture from "../classes/Picture.ts";
import { fill, pick, rectangle, draw, line, circle } from "../utility/tools.ts";
import ToolSelect from "./PixelEditor Components/ToolSelect.tsx";
import ColorSelect from "./PixelEditor Components/ColorSelect.tsx";
import type State from "../classes/State.ts";
import type { Tool } from "../classes/State.ts";
import SaveButton from "./PixelEditor Components/SaveButton.tsx";
import LoadButton from "./PixelEditor Components/LoadButton.tsx";
import UndoButton from "./PixelEditor Components/UndoButton.tsx";

type pos = {
  x: number;
  y: number;
};

// type controls = [typeof ToolSelect, typeof ColorSelect];

export interface Dispatch {
  tool?: Tool;
  color?: string;
  picture?: Picture;
  undo?: boolean;
}

export type DispatchFunction = (action: Dispatch) => void;

export interface config {
  tools: {
    draw: typeof draw;
    fill: typeof fill;
    pick: typeof pick;
    rectangle: typeof rectangle;
    line: typeof line;
    circle: typeof circle;
  };
  // controls: controls;
  dispatch: DispatchFunction;
}

export type masterState = [State, React.Dispatch<React.SetStateAction<State>>];

interface PixelEditor {
  masterState: masterState;
  config: config;
}

export default function PixelEditor({ masterState, config }: PixelEditor) {
  const posFunction = (pos: pos) => {
    const tool = config.tools[masterState[0].tool];
    const onMove = tool(pos, masterState, config.dispatch);
    if (onMove) return (pos: pos) => onMove(pos, masterState);
  };

  return (
    <div>
      <PictureCanvas
        picture={masterState[0].picture}
        pointerDown={posFunction}
        previous={masterState[0].done[0]}
      />
      <br />
      <ToolSelect config={config} state={masterState[0]} />{" "}
      <ColorSelect config={config} state={masterState[0]} />{" "}
      <SaveButton state={masterState[0]} />
      <LoadButton dispatch={config.dispatch} />
      <UndoButton dispatch={config.dispatch} state={masterState[0]} />
    </div>
  );
}
